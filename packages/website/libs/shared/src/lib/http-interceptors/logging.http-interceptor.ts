import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { tap } from 'rxjs/operators'; // fancy pipe-able operators
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = request.url;
        const method = request.method;
        return next.handle(request).pipe(
            tap(
                (response) => {
                    console.log({
                       method,
                        url,
                        request,
                         response,
                    });
                },
                (error) => {
                    console.log({ method, url, request, error });
                },
            ),
        );
    }
}
