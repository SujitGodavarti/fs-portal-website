import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvestmentListComponent } from './investment-list.component';


const routes: Routes = [
  { path: '', component: InvestmentListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentListRoutingModule { }
