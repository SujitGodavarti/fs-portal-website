import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Investor } from '../../models/investor';
import { AppConfigService } from 'src/app/shared/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InvestorDetailService {
  accessToken: string;
  apiBaseUrl: string;

  constructor(private http: HttpClient,
    private appConfigService: AppConfigService,
    private authenticationService: AuthenticationService) {
    this.accessToken = this.authenticationService.tokenValue;
    this.apiBaseUrl = this.appConfigService.apiBaseUrl;
  }

  getInvestorDetails(investorId: number): Observable<Investor> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken
      })
    };

    return this.http.get<Investor>(`${this.apiBaseUrl}/api/investors/${investorId}`, httpOptions)
      .pipe(
        map(response => response)
      );
  }

  updateInvestor(investor: Investor): Observable<Investor> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.accessToken,
        'Content-Type': 'application/json'
      })
    };

    const body = investor;

    return this.http.post<Investor>(`${this.apiBaseUrl}/api/investors`, body, httpOptions)
      .pipe(
        map(response => response)
      );
  }
}
