import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { CustomerResponse } from "../models/customer-response";
import { Customer } from "../models/customer.model";
import { Page } from "../models/page";
import { MessageService } from "./message.service";

@Injectable({ providedIn: 'root' })
export class CustomerService {

    private readonly serverUrl: string = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }


    onCreateCustomer(customer?: Customer) {
        console.log("hello");
        return this.http.post<Customer>(`${this.serverUrl}/customer/save`, customer).pipe(catchError(this.getErrorHandler));
    }

    customer$ = (name: string = '', page: number = 0, size: number = 2): Observable<CustomerResponse<Page>> =>
        this.http.get<any>(`${this.serverUrl}/customer/getCustomers?name=${name}&page=${page}&size=${size}`);


    onUpdateCustomer(updateData: Customer) {
        return this.http.post<Customer>(`${this.serverUrl}/customer/update`, updateData).pipe(catchError(this.getErrorHandler));
    }

    getCustomer(id: number): Observable<Customer> {
        console.log(id);
        return this.http.get<Customer>(`${this.serverUrl}/customer/get`, {
            params: {
                id: id
            },
            observe: 'body'
        }).pipe(catchError(this.getErrorHandler));

    }
    deleteCustomer(id: number, customerStatus: String) {
        return this.http.post<any>(`${this.serverUrl}/customer/delete`, { id: id, status: customerStatus }).pipe(catchError(this.getErrorHandler));

    }
    onStatusChange(id: number, customerStatus: String) {
        return this.http.post<any>(`${this.serverUrl}/customer/changeStatus`, { id: id, status: customerStatus }).pipe(catchError(this.getErrorHandler));

    }
    getErrorHandler(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An Error Occured';
        if (!errorResponse || !errorResponse.error) {
            return throwError(errorMessage);
        }

        if (errorResponse.error.violations) {
            console.log(errorResponse.error.violations);
            return throwError(errorResponse.error.violations);
        }
        console.log(errorResponse.error);
        return throwError(errorResponse.error);
    }
}



