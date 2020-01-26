import { Component, OnInit } from '@angular/core';
import { faUsers, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { AppSharedService } from '../services/app-shared.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  faUsers = faUsers;
  faLayerGroup = faLayerGroup;
  isLoggedIn$: Observable<string>;   

  constructor(private authenticationService: AuthenticationService,
              private appSharedService: AppSharedService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authenticationService.isLoggedIn;
  }
}
