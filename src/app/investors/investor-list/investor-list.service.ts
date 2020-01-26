import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Investor } from '../../models/investor';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppConfigService } from 'src/app/shared/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InvestorListService {
  accessToken: string;
  apiBaseUrl: string;

  constructor(private http: HttpClient,
    private appConfigService: AppConfigService,
    private authenticationService: AuthenticationService) {
    this.accessToken = this.authenticationService.tokenValue;
    this.apiBaseUrl = this.appConfigService.apiBaseUrl;
  }

  getAllInvestors(): Observable<Investor[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken
      })
    };

    return this.http.get<Investor[]>(`${this.apiBaseUrl}/api/investors`, httpOptions)
      .pipe(
        map(response => response)
      );
  }
}
