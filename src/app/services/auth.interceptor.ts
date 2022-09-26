import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let modifiedRequest = req;
        if (!(req.url === '/login')) {
            let token = sessionStorage.getItem('token');
            console.log(token);
            let authToken = `Bearer ${token}`;
            modifiedRequest = req.clone({
                setHeaders: {
                    ['Authorization']: authToken
                }
            })
        }

        console.log('Sending Request interceptor');
        return next.handle(modifiedRequest);

    }

}