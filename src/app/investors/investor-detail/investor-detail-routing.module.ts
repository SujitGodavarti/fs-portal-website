import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvestorDetailComponent } from './investor-detail.component';


const routes: Routes = [
  {path: '', component: InvestorDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestorDetailRoutingModule { }
