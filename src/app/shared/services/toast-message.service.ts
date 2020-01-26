import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export enum messageType {
  SUCCESS = 1,
  ERROR = 2
}

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  error: any;
  errorMessage: string;

  constructor(private toastr: ToastrService) { }

  // Common function to show toast messages 
  showToastMessage(message: string, id: number) {

    if (id == messageType.SUCCESS) {
        this.toastr.success(message, 'Success!');
    }
    else if (id == messageType.ERROR) {
        this.toastr.error(message, 'Error!', {
            positionClass: 'toast-top-full-width',
            disableTimeOut: true,
            closeButton: true
        });
    }
  }

  showErrorToastMessage(error: any) {
      this.error = error;
      if (this.error.status == 0 || this.error.status == 500) {
          this.errorMessage = this.getErrorMessage('Sorry! Could not connect to server.');
      } else if (error.status == 400) {
          this.errorMessage = this.getErrorMessage('Sorry! Bad request');
      } else if (error.status == 401) {
          this.errorMessage = this.getErrorMessage('You are unauthorized to access this resource.');
      } else if (error.status == 404) {
          this.errorMessage = this.getErrorMessage('Sorry! The requested resource is not available.');
      } else {
          this.errorMessage = this.getErrorMessage('Sorry! An error has occurred');
      }

      this.showToastMessage(this.errorMessage, messageType.ERROR);
  }

  private getErrorMessage(defaultMessage: string): string {
      if (this.error.error) {
          const err = this.error.error;

          // For some errors, the error body is not a string. So we do a check here. For example errors with status code 0, 500 etc
          if (Object.prototype.toString.call(err) === '[object String]') {
            return err;
          }
      }
      return defaultMessage;
  }
}
