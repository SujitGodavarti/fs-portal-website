import { Component, OnInit, OnDestroy, QueryList, ViewChildren, ViewChild, TemplateRef } from '@angular/core';
import { InvestorDetailService } from './investor-detail.service';
import { takeUntil } from 'rxjs/operators';
import { Account } from '../../models/account';
import { Subject } from 'rxjs';
import { NgbdSortableHeader, SortEvent, SortDirection, sortAndFilter, ItemType } from '../../shared/directives/sort-filter/sort-filter.directive';
import { ActivatedRoute } from '@angular/router';
import { Investor } from '../../models/investor';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Investment } from '../../models/investment';
import { ToastMessageService, messageType } from 'src/app/shared/services/toast-message.service';
import { AppSharedService } from 'src/app/shared/services/app-shared.service';

@Component({
  selector: 'app-investor-detail',
  templateUrl: './investor-detail.component.html',
  styleUrls: ['./investor-detail.component.scss']
})
export class InvestorDetailComponent implements OnInit, OnDestroy {
  investor: Investor;
  accounts: Account[] = [];
  allAccounts: Account[] = [];
  onDestroy$: Subject<void> = new Subject<void>();
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: SortDirection = '';
  investments: Investment[];
  showHoldingFields: boolean = false; // Flag to show/hide form fields based on value seleted in the investments drop-down
  selectedAccount: Account;
  holdingToAdd: Investment;
  faDollarSign = faDollarSign;
  adding = false; // Flag to disable 'Add' button in the modal once user clicks it and waits for a response from backend. This is to prevent user from clicking the button multiple times
  submitted = false; // Flag to check whether form is submitted by the user or not
  pageTitle: string = 'ACCOUNTS';

  @ViewChild('addHoldingModal', { static: false }) addHoldingModal: TemplateRef<any>;
  addHoldingDialog: NgbModalRef | null;
  addHoldingForm: FormGroup;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(private investorDetailService: InvestorDetailService,
    private appSharedService: AppSharedService,
    private modalService: NgbModal,
    private toastMessageService: ToastMessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.appSharedService.setPageTitleValue(this.pageTitle);

    this.addHoldingForm = this.formBuilder.group({
      investmentcode: [''],
      price: [''],
      units: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });

    const investorId = this.route.snapshot.params['id'];

    // Retrieve investments stored in session storage in investment list component
    this.investments = JSON.parse(sessionStorage.getItem("investments"));

    this.investorDetailService.getInvestorDetails(investorId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        if (response) {
          this.investor = response;
          this.accounts = response.Accounts;

          this.accounts.forEach(account => {
            if (!account.Holdings) {
              account.Holdings = [];
            }
            account.NoofHoldings = account.Holdings.length;
          })

          this.allAccounts = this.accounts; // 'allAccounts' stores the complete list of accounts fetched and 'accounts' value which binds to template keeps changing based on search term
        }

      }, error => {
          this.toastMessageService.showErrorToastMessage(error);
      });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.addHoldingForm.controls; }

  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.accounts = sortAndFilter(this.allAccounts, ItemType.ACCOUNT, this.sortColumn, this.sortDirection, this.searchTerm);
  }

  onSort({ column, direction }: SortEvent) {
    // Resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.sortColumn = column;
    this.sortDirection = direction;

    this.accounts = sortAndFilter(this.allAccounts, ItemType.ACCOUNT, this.sortColumn, this.sortDirection, this.searchTerm);
  }

  openAddHoldingModal(account: Account) {
    // Shallow copy is enough here since account is a single-level object and not a multi-level one
    this.selectedAccount = Object.assign({}, account);

    this.submitted = false; // Clear errors which might have been displayed during previous form validtion
    this.adding = false; // Enable Add button of form if it has been disabled previously
    this.addHoldingForm.reset();

    this.showHoldingFields = false;
    this.addHoldingDialog = this.modalService.open(this.addHoldingModal, { backdrop: 'static' });
  }

  onOptionSelected(event) {
    // Keep form fields hidden if "----Select an option----" option is selected in the dropdown
    if (Number(event.target.value) === 0) {
      this.showHoldingFields = false;
    }
    else {
      this.showHoldingFields = true;
      this.holdingToAdd = this.investments.find(investment => investment.Id === Number(event.target.value));

      this.addHoldingForm.get("investmentcode").setValue(this.holdingToAdd.InvestmentCode);
      this.addHoldingForm.get("price").setValue(this.holdingToAdd.Price);
    }
    this.addHoldingForm.get("units").reset(); // Reset the Units field if the option in the dropdown is changed
  }

  onAddHolding() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.addHoldingForm.invalid) {
      return;
    }

    this.adding = true; // Disable 'Add' button to prevent user from clicking it more than once if the form is valid

    // Copy the form values over the added holding object values
    this.holdingToAdd = Object.assign({}, this.addHoldingForm.value);

    this.holdingToAdd.PurchaseDateUtc = (new Date()).toString();

    this.selectedAccount.Holdings.push(this.holdingToAdd);
    this.selectedAccount.NoofHoldings += 1;
    
    // We need to clone the original object and modify the cloned object without affecting 
    // original object (since object in javascript is a reference type i.e it is mutable)
    const investor = Object.assign({}, this.investor); 
    investor.Accounts.splice(investor.Accounts.findIndex(item => item.Id === this.selectedAccount.Id), 1, this.selectedAccount);

    this.investorDetailService.updateInvestor(investor)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {
        this.closeModal(this.addHoldingDialog);

        // Updating the UI here can be done in two ways. We can use the response returned by API and update the entire table with it.
        // Second way is to update only the account row to which holding has been added. This is what we re doing here 
        // after a 200 is returned by API
        this.accounts.splice(this.accounts.findIndex(item => item.Id === this.selectedAccount.Id), 1, this.selectedAccount);
        
        this.toastMessageService.showToastMessage('Investor details updated successfully', messageType.SUCCESS);
      }, error => {
          this.adding = false; // If any error occurs, disabled 'Add' button in form while adding a holding should be enabled again

          // If error occurs we remove the holding added to the selected account and decrement the count value
          this.selectedAccount.Holdings.pop();
          this.selectedAccount.NoofHoldings -= 1;

          this.toastMessageService.showErrorToastMessage(error);
      });
  }

  closeModal(dialog: NgbModalRef) {
    dialog.dismiss();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
