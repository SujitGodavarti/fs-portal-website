import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestorListRoutingModule } from './investor-list-routing.module';
import { InvestorListComponent } from './investor-list.component';
import { InvestorListService } from './investor-list.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortFilterModule } from '../../shared/directives/sort-filter/sort-filter.module';

@NgModule({
  declarations: [
    InvestorListComponent
  ],
  imports: [
    CommonModule,
    InvestorListRoutingModule,
    NgbModule,
    SortFilterModule
  ],
  providers: [
    InvestorListService
  ]
})
export class InvestorListModule { }
