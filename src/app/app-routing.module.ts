import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './shared/services/auth-guard.service';


const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
  { path: 'investment-list', loadChildren: () => import('./investments/investment-list/investment-list.module').then(m => m.InvestmentListModule), canActivate: [AuthGuardService]},
  { path: 'investor-list', loadChildren: () => import('./investors/investor-list/investor-list.module').then(m => m.InvestorListModule), canActivate: [AuthGuardService]},
  { path: 'investor-detail/:id', loadChildren: () => import('./investors/investor-detail/investor-detail.module').then(m => m.InvestorDetailModule), canActivate: [AuthGuardService]},
  { path: '',   redirectTo: 'investment-list', pathMatch: 'full', canActivate: [AuthGuardService]},
  { path: '**', redirectTo: 'investment-list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
