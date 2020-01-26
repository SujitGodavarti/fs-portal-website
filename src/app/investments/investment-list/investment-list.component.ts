import { Component, OnInit, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { InvestmentListService } from './investment-list.service';
import { takeUntil } from 'rxjs/operators';
import { Investment } from '../../models/investment';
import { Subject } from 'rxjs';
import { NgbdSortableHeader, SortEvent, SortDirection, sortAndFilter, ItemType } from '../../shared/directives/sort-filter/sort-filter.directive';
import { ToastMessageService } from 'src/app/shared/services/toast-message.service';
import { AppSharedService } from 'src/app/shared/services/app-shared.service';

@Component({
  selector: 'app-investment-list',
  templateUrl: './investment-list.component.html',
  styleUrls: ['./investment-list.component.scss']
})
export class InvestmentListComponent implements OnInit, OnDestroy {
  investments: Investment[] = [];
  allInvestments: Investment[] = [];
  onDestroy$: Subject<void> = new Subject<void>();
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: SortDirection = '';
  pageTitle: string = 'INVESTMENTS';

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(private investmentListService: InvestmentListService,
              private toastMessageService: ToastMessageService,
              private appSharedService: AppSharedService) {
  }

  ngOnInit() {
    this.appSharedService.setPageTitleValue(this.pageTitle);

    this.investmentListService.getAllInvestments()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {

        if(response) {
          this.investments = response;

          this.investments.forEach(item => {
            item.PriceUpdatedUtc = new Date(item.PriceUpdatedUtc).toLocaleDateString('en-AU'); // This displays only date. If time should also be displayed, we can use 'toLocaleString'
          });

          // The investments list is used in dropdown while adding holding. So we store it in session storage
          sessionStorage.setItem("investments", JSON.stringify(this.investments));

          this.allInvestments = this.investments; // 'allInvestments' stores the complete list of investments fetched and 'investments' value which binds to template keeps changing based on search term
        }
        
      }, error => {
          this.toastMessageService.showErrorToastMessage(error);
      });
  }

  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.investments = sortAndFilter(this.allInvestments, ItemType.INVESTMENT, this.sortColumn, this.sortDirection, this.searchTerm);
  }

  onSort({column, direction}: SortEvent) {
    // Resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.sortColumn = column;
    this.sortDirection = direction;

    this.investments = sortAndFilter(this.allInvestments, ItemType.INVESTMENT, this.sortColumn, this.sortDirection, this.searchTerm);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
