import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvestorDetailRoutingModule } from './investor-detail-routing.module';
import { InvestorDetailComponent } from './investor-detail.component';
import { InvestorDetailService } from './investor-detail.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortFilterModule } from '../../shared/directives/sort-filter/sort-filter.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    InvestorDetailComponent
  ],
  imports: [
    CommonModule,
    InvestorDetailRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SortFilterModule,
    FontAwesomeModule
  ],
  providers: [
    InvestorDetailService
  ]
})
export class InvestorDetailModule { }
