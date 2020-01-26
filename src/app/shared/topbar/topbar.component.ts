import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { faChevronDown, faUsers, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AppSharedService } from '../services/app-shared.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  isLoggedIn$: Observable<string>;
  pageTitle$: Observable<string>;
  faChevronDown = faChevronDown;
  faUsers = faUsers;
  faLayerGroup = faLayerGroup;

  constructor(private authenticationService: AuthenticationService,
              private appSharedService: AppSharedService) { 
              }

  ngOnInit() {
    this.isLoggedIn$ = this.authenticationService.isLoggedIn;
    this.pageTitle$ = this.appSharedService.currentPageTitle;
  }

  onLogout(){
    this.authenticationService.logout();
  }

}
