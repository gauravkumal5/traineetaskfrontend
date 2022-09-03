import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Subject, tap, throwError } from "rxjs";
import { User } from "../models/user.model";


export interface AuthResponseData {
    jwtToken: string;
    statusCode: number,
    status: string,
    error: string,

}
@Injectable({ providedIn: 'root' })
export class AuthService {
    isLoggedIn = false;
    userSubject = new Subject<User>();

    constructor(private http: HttpClient) { }


    logout() {
        localStorage.clear();
        this.isLoggedIn = false;
    }

    login(username?: string, password?: string) {
        return this.http.post<AuthResponseData>(`http://localhost:8080/api/authenticate`,
            { username, password }).pipe(catchError(this.getErrorHandler), tap(this.handleUser.bind(this)));
    }
    getErrorHandler(errorResponse: HttpErrorResponse) {
        console.log(errorResponse.error);
        let errorMessage = 'An Error Occured';
        if (!errorResponse || !errorResponse.error.error) {
            return throwError(errorMessage);
        }
        switch (errorResponse.error.statusCode) {
            case 401:
                errorMessage = errorResponse.error.error;
                break;
            case 404:
                errorMessage = errorResponse.error.error
                break;

        }
        return throwError(errorMessage);

    }

    private handleUser(response: AuthResponseData) {
        const user = new User(response.jwtToken);
        this.userSubject.next(user);
        console.log(user);
    }

    isAuthenticated() {
        const token = localStorage.getItem('token');
        if (token != undefined) {
            this.isLoggedIn = true;
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.isLoggedIn);
            }, 1000);
        })
    }
}