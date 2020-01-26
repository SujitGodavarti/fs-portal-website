import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../shared/services/authentication.service';
import { ToastMessageService } from '../shared/services/toast-message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  onDestroy$: Subject<void> = new Subject<void>();
  loading = false; // Flag to disable 'Login' button while credentials are being validated
  submitted = false; // Flag to check whether form is submitted by the user or not 
  returnUrl: string;
  errorDescription: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastMessageService: ToastMessageService) {
    // Redirect to home page if already logged in
    if (this.authenticationService.tokenValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // CORS Anywhere proxy is used as a workound in this app to overcome CORS issue. This proxy needs first request to be GET and throws an error when the first request is a POST.
    // In our app, the first request is a POST to fetch the token. So to overcome the issue, I added this dummy GET request. Now our POST request won't fail and the app works normally.
    // This is only a workaround and should never be used in production. CORS should be handled on the server side in a different way for development and production environments.
    if(!sessionStorage.getItem("requestDone")) {
      this.authenticationService.dummyGetRequest()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
      }, () => {
          sessionStorage.setItem("requestDone", "Yes");
      });
    } 
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.errorDescription = null; // If user retries with same invalid credentials, previous message disappears while loading button shows and displays the error message again

    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.login(this.f.username.value, this.f.password.value)
    .pipe(takeUntil(this.onDestroy$))
      .subscribe(
        () => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.loading = false;
          if (error.status === 400 && error.error.error_description) {
            this.errorDescription = error.error.error_description // Error description returned by API for invalid credentials
          }
          else {
            this.toastMessageService.showErrorToastMessage(error);
          }
        });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
