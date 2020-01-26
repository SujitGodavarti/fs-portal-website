import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppSharedService {
  private pageTitle: BehaviorSubject<string>;

  constructor() {
    this.pageTitle = new BehaviorSubject<string>("");
  }

  public get currentPageTitle() {
    return this.pageTitle.asObservable();
  }

  setPageTitleValue(pageTitle: string) {
    this.pageTitle.next(pageTitle);
  }
}
