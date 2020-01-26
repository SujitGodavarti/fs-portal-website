import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { AuthenticationService } from './shared/services/authentication.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from './shared/sidebar/sidebar.module';
import { TopbarModule } from './shared/topbar/topbar.module';
import { ToastrModule } from 'ngx-toastr';
import { ToastMessageService } from './shared/services/toast-message.service';
import { AppConfigService } from './shared/services/app-config.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    ToastrModule.forRoot(),
    NgbModule,
    SidebarModule,
    TopbarModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          return appConfigService.loadAppConfig();
        };
      }
    },
    AuthenticationService,
    ToastMessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
