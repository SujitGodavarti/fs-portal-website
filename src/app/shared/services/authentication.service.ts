import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppConfigService } from './app-config.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private tokenSubject: BehaviorSubject<string>;
    apiBaseUrl: string;

    constructor(private http: HttpClient,
                private appConfigService: AppConfigService,
                private router: Router) {
        this.tokenSubject = new BehaviorSubject<string>(sessionStorage.getItem('accessToken'));
        this.apiBaseUrl = this.appConfigService.apiBaseUrl;
    }

    public get tokenValue(): string {
        return this.tokenSubject.value;
    }

    public get isLoggedIn() {
        return this.tokenSubject.asObservable();
    }

    login(username: string, password: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };

        const body = new HttpParams()
            .set('grant_type', 'password')
            .set('username', username)
            .set('password', password);

        return this.http.post<any>(`${this.apiBaseUrl}/token`, body, httpOptions)
            .pipe(map(user => {
                // Login successful if there's a token in the response
                if (user && user.access_token) {
                    // Store token in session storage to keep user logged in between page refreshes
                    sessionStorage.setItem('accessToken', user.access_token);
                    this.tokenSubject.next(user.access_token);
                }
            }));
    }

    logout() {
        // Remove token from session storage to log user out and redirect to login page
        sessionStorage.removeItem('accessToken');
        this.tokenSubject.next(null);
        this.router.navigate(['/login']);
    }

    // Dummy GET request to overcome CORS proxy issue. A proxy should never be used in production and CORS should be handled in a different way
    dummyGetRequest(): any {
        return this.http.get<any>(`https://cors-anywhere.herokuapp.com/https://dummygetrequest`)
        .pipe(
          map(response => response)
        );
    }
}