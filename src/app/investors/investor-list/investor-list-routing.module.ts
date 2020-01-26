import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvestorListComponent } from './investor-list.component';


const routes: Routes = [
  {path: '', component: InvestorListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestorListRoutingModule { }
