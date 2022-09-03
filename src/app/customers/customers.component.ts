import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { BehaviorSubject, catchError, map, Observable, of, startWith, Subscription } from 'rxjs';
import { CustomerResponse } from '../models/customer-response';
import { Page } from '../models/page';
import { CustomerService } from '../services/customer.service';
import { IMessage, MessageService } from '../services/message.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit, OnDestroy {

  usersState$: Observable<{ appState: string, appData?: CustomerResponse<Page>, error?: HttpErrorResponse }>;
  responseSubject = new BehaviorSubject<CustomerResponse<Page>>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);
  $currentPage = this.currentPageSubject.asObservable();

  searchForm: FormGroup;
  isDeleted: string = null;
  isStatusChanged: string = null;

  messages: IMessage[] = [];
  subscription: Subscription;


  constructor(private customerService: CustomerService, private router: Router, private messageService: MessageService) {

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe;
  }

  ngOnInit(): void {

    this.searchForm = new FormGroup({
      'name': new FormControl(""),
    })

    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message) {
        this.messages.push(message.data);

        console.log(this.messages[0].text);
        setTimeout(() => {
          this.messages = [];
        }, 3000);

      } else {
        this.messages = [];
      }
    });

    this.fetchUsers();
  }

  fetchUsers() {
    this.usersState$ = this.customerService.customer$().pipe(
      map((response: CustomerResponse<Page>) => {
        this.responseSubject.next(response);
        this.currentPageSubject.next(response.data.page.number);
        console.log(response);
        return ({ appState: 'APP_LOADED', appData: response });
      }
      ),
      startWith({ appState: 'APP_LOADING' }),
      catchError((error: HttpErrorResponse) => of({ appState: 'APP_ERROR', error }))
    )
  }

  goToPage(name?: string, pageNumber?: number): void {
    this.usersState$ = this.customerService.customer$(name, pageNumber).pipe(
      map((response: CustomerResponse<Page>) => {
        this.responseSubject.next(response);
        this.currentPageSubject.next(response.data.page.number);
        console.log(response);
        return ({ appState: 'APP_LOADED', appData: response });
      }
      ),
      startWith({ appState: 'APP_LOADED', appData: this.responseSubject.value }),
      catchError((error: HttpErrorResponse) => of({ appState: 'APP_ERROR', error }))
    )
  }
  goToNextOrPrevious(direction?: string, name?: string): void {
    this.goToPage(name, direction === 'forward' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1);
  }


  onAddUser() {
    this.router.navigate(['/user/post']);

  }

  onStatusChange(id: number, customerStatus: String) {
    let authObs: Observable<CustomerResponse<Page>>;
    authObs = this.customerService.onStatusChange(id, customerStatus);
    authObs.subscribe((response: CustomerResponse<Page>) => {
      if (response) {

        this.isStatusChanged = response.message;
        setTimeout(() => {
          this.isStatusChanged = "";
        }, 3000);
        this.goToPage('', this.currentPageSubject.value);
      }
      else {
        return;
      }
    },
      (errorMessage) => {
        console.log(errorMessage);

      }
    )
  }

  onUpdateUser(id: number) {
    this.router.navigate(["/user/update"], { queryParams: { userId: id } });
  }
  onDeleteUser(id: number, customerStatus: String) {
    if (window.confirm("Are you sure you want to delete?")) {
      let authObs: Observable<CustomerResponse<Page>>;
      authObs = this.customerService.deleteCustomer(id, customerStatus);
      authObs.subscribe((response: CustomerResponse<Page>) => {
        if (response) {
          this.isDeleted = response.message;
          setTimeout(() => {
            this.isDeleted = "";
          }, 3000);
          this.goToPage('', this.currentPageSubject.value);
          console.log(response);
        }
        else {
          return;
        }
      },
        (errorMessage) => {
          console.log(errorMessage);

        }
      )
    }

  }

}
