import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestmentListRoutingModule } from './investment-list-routing.module';
import { InvestmentListComponent } from './investment-list.component';
import { InvestmentListService } from './investment-list.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortFilterModule } from '../../shared/directives/sort-filter/sort-filter.module';

@NgModule({
  declarations: [
    InvestmentListComponent
  ],
  imports: [
    CommonModule,
    InvestmentListRoutingModule,
    NgbModule,
    SortFilterModule
  ],
  providers: [
    InvestmentListService
  ]
})
export class InvestmentListModule { }
