import { Component, OnInit, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { InvestorListService } from './investor-list.service';
import { takeUntil } from 'rxjs/operators';
import { Investor } from '../../models/investor';
import { Subject } from 'rxjs';
import { NgbdSortableHeader, SortEvent, SortDirection, sortAndFilter, ItemType } from '../../shared/directives/sort-filter/sort-filter.directive';
import { Router } from '@angular/router';
import { ToastMessageService } from 'src/app/shared/services/toast-message.service';
import { AppSharedService } from 'src/app/shared/services/app-shared.service';

@Component({
  selector: 'app-investor-list',
  templateUrl: './investor-list.component.html',
  styleUrls: ['./investor-list.component.scss']
})
export class InvestorListComponent implements OnInit, OnDestroy {

  investors: Investor[] = [];
  allInvestors: Investor[] = [];
  onDestroy$: Subject<void> = new Subject<void>();
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: SortDirection = '';
  pageTitle: string = 'INVESTORS';

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(private investorListService: InvestorListService,
              private toastMessageService: ToastMessageService,
              private appSharedService: AppSharedService,
              private router: Router) {
  }

  ngOnInit() {
    this.appSharedService.setPageTitleValue(this.pageTitle);

    this.investorListService.getAllInvestors()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(response => {

        if(response) {
          this.investors = response;
          this.allInvestors = this.investors; // 'allInvestors' stores the complete list of investors fetched and 'investors' value which binds to template keeps changing based on search term
        }
      }, error => {
        this.toastMessageService.showErrorToastMessage(error);
      });
  }

  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.investors = sortAndFilter(this.allInvestors, ItemType.INVESTOR, this.sortColumn, this.sortDirection, this.searchTerm);
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

    this.investors = sortAndFilter(this.allInvestors, ItemType.INVESTOR, this.sortColumn, this.sortDirection, this.searchTerm);
  }

  onInvestorDetails(investor: Investor) {
    this.router.navigate(['investor-detail/', investor.Id]);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
