
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@optimroute/env/environment';
import { Observable, from, of, throwError } from 'rxjs';
import * as moment from 'moment';
import { take, map, tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { dateToDDMMYYYMM } from '../../../shared/src/lib/util-functions/date-format';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
declare var window: any;
window.Pusher = Pusher;

// const helper = new JwtHelperService();

// const decodedToken = helper.decodeToken(myRawToken);
// const expirationDate = helper.getTokenExpirationDate(myRawToken);
// const isExpired = helper.isTokenExpired(myRawToken);

@Injectable({
    providedIn: 'root',
})
export class BackendService {
    client_id: number = 1;
    grant_type: any = 'password';
    client_secret: any = 'tT96kecNtYVf92dvRfQ1Ikj6sjsx5tKZzaCCpHun';
    timeRefresh: number = environment.sessionTimeOut;
    constructor(private http: HttpClient, private router: Router) {}
    private createBackendUrl(path: string) {
        return Location.joinWithSlash(environment.apiUrl, path);
    }

    public get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        return this.timeoutToken().pipe(
            switchMap(async (isLogged) => {
                if (isLogged) {
                    let response = await this.http
                        .get(this.createBackendUrl(path), {
                            headers: this.headers,
                            params,
                        })
                        .pipe(take(1))
                        .toPromise();
                    return response;
                }
            }),
            catchError(async (error) => {
                if (error.status === 401) {
                    this.Logout();
                }
                return await throwError(error).toPromise();
            }),
        );
    }

    public get_client(
        path: string,
        params: HttpParams = new HttpParams(),
    ): Observable<any> {
        return this.http.get(this.createBackendUrl(path), {
            headers: this.headers_client,
            params,
        });
    }

    public post(path: string, data: Object = {}): Observable<any> {
        return this.timeoutToken().pipe(
            switchMap(async (isLogged) => {
                if (isLogged) {
                    let response = await this.http
                        .post(this.createBackendUrl(path), JSON.stringify(data), {
                            headers: this.headers,
                        })
                        .pipe(take(1))
                        .toPromise();

                    return response;
                }
            }),
            catchError(async (error) => {
                if (error.status === 401) {
                    this.Logout();
                }
                return await throwError(error).toPromise();
            }),
        );
    }

    public post_client(path: string, data: Object = {}): Observable<any> {
        return this.http.post(this.createBackendUrl(path), JSON.stringify(data), {
            headers: this.headers_client,
        });
    }

    public put(path: string, data: Object = {}): Observable<any> {
        return this.timeoutToken().pipe(
            switchMap(async (isLogged) => {
                if (isLogged) {
                    let response = await this.http
                        .put(this.createBackendUrl(path), JSON.stringify(data), {
                            headers: this.headers,
                        })
                        .pipe(take(1))
                        .toPromise();
                    return response;
                }
            }),
            catchError(async (error) => {
                if (error.status === 401) {
                    this.Logout();
                }
                return await throwError(error).toPromise();
            }),
        );
    }

    public patch(path: string, data: Object = {}): Observable<any> {
        return this.timeoutToken().pipe(
            switchMap(async (isLogged) => {
                if (isLogged) {
                    let response = await this.http
                        .patch(this.createBackendUrl(path), JSON.stringify(data), {
                            headers: this.headers,
                        })
                        .pipe(take(1))
                        .toPromise();
                    return response;
                }
            }),
            catchError(async (error) => {
                if (error.status === 401) {
                    this.Logout();
                }
                return await throwError(error).toPromise();
            }),
        );
    }

    public delete(path: string): Observable<any> {
        return this.timeoutToken().pipe(
            switchMap(async (isLogged) => {
                if (isLogged) {
                    let response = await this.http
                        .delete(this.createBackendUrl(path), { headers: this.headers })
                        .pipe(take(1))
                        .toPromise();
                    return response;
                }
            }),
            catchError(async (error) => {
                if (error.status === 401) {
                    this.Logout();
                }
                return await throwError(error).toPromise();
            }),
        );
    }

    getPDF(path: string, params: HttpParams = new HttpParams()) {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.createBackendUrl(path), {
                    headers: this.headersPdf,
                    params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {
                        const fileURL = URL.createObjectURL(
                            new Blob([data.body], { type: 'application/pdf' }),
                        );

                        window.open(fileURL, '_blank');
                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }

    getIMG(path: string, params: HttpParams = new HttpParams()) {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.createBackendUrl(path), {
                    headers: this.headersPdf,
                    params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        const fileURL = URL.createObjectURL(
                            new Blob([data.body], { type: 'image/png' }),
                        );

                        resolve(fileURL);


                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }



    getpdfSheet(path: string, params: HttpParams = new HttpParams()) {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.createBackendUrl(path), {
                    headers: this.headersPdf,
                    params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        const fileURL = URL.createObjectURL(
                            new Blob([data.body], { type: 'application/pdf' }),
                        );

                        resolve(fileURL);


                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }

    /* get sheet */
    getExcelSheet(path: string, params: HttpParams = new HttpParams()) {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.createBackendUrl(path), {
                    headers: this.headersExell,
                    params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        // para descargar

                        let downloadLink = document.createElement('a');

                        downloadLink.href = window.URL.createObjectURL(new Blob([data.body], { type: 'application/octet-stream' }));
                        if (data)

                        downloadLink.setAttribute('download', `SheetRoute_${dateToDDMMYYYMM(new Date())}_.xlsx`);

                        document.body.appendChild(downloadLink);

                        downloadLink.click();

                       // resolve(fileURL);


                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }

    /* parcel */
    getExcelParcel(path: string, params: HttpParams = new HttpParams()) {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.createBackendUrl(path), {
                    headers: this.headersExell,
                    params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        // para descargar

                        let downloadLink = document.createElement('a');

                        downloadLink.href = window.URL.createObjectURL(new Blob([data.body], { type: 'application/octet-stream' }));
                        if (data)

                        downloadLink.setAttribute('download', `parcel${dateToDDMMYYYMM(new Date())}_.xlsx`);

                        document.body.appendChild(downloadLink);

                        downloadLink.click();

                       // resolve(fileURL);


                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }

    /* dockList */
    getDockList(path: string, params: HttpParams = new HttpParams()) {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.createBackendUrl(path), {
                    headers: this.headersExell,
                    params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        // para descargar

                        let downloadLink = document.createElement('a');

                        downloadLink.href = window.URL.createObjectURL(new Blob([data.body], { type: 'application/octet-stream' }));
                        if (data)

                        downloadLink.setAttribute('download', `Dock${dateToDDMMYYYMM(new Date())}_.xlsx`);

                        document.body.appendChild(downloadLink);

                        downloadLink.click();

                       // resolve(fileURL);


                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }

    /* getuserExel */
    getExcelUser(path: string, params: HttpParams = new HttpParams()) {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.createBackendUrl(path), {
                    headers: this.headersExell,
                    params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        // para descargar

                        let downloadLink = document.createElement('a');

                        downloadLink.href = window.URL.createObjectURL(new Blob([data.body], { type: 'application/octet-stream' }));
                        if (data)

                        downloadLink.setAttribute('download', `User_${dateToDDMMYYYMM(new Date())}_.xlsx`);

                        document.body.appendChild(downloadLink);

                        downloadLink.click();

                       // resolve(fileURL);


                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }

    // Descargar excel general
    getDownloadExcel(path: string, test:any, params: HttpParams = new HttpParams()) {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.createBackendUrl(path), {
                    headers: this.headersExell,
                    params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        // para descargar

                        let downloadLink = document.createElement('a');

                        downloadLink.href = window.URL.createObjectURL(new Blob([data.body], { type: 'application/octet-stream' }));
                        if (data)

                        downloadLink.setAttribute('download', `${test}_${dateToDDMMYYYMM(new Date())}_.xlsx`);

                        document.body.appendChild(downloadLink);

                        downloadLink.click();

                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }

    /* AnalysisClient */
    getAnalysisClientList(path: string, params: HttpParams = new HttpParams()) {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.createBackendUrl(path), {
                    headers: this.headersExell,
                    params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        // para descargar
                        let downloadLink = document.createElement('a');

                        downloadLink.href = window.URL.createObjectURL(new Blob([data.body], { type: 'application/octet-stream' }));
                        if (data)

                        downloadLink.setAttribute('download', `Analysis_${dateToDDMMYYYMM(new Date())}_.xlsx`);

                        document.body.appendChild(downloadLink);

                        downloadLink.click();

                       // resolve(fileURL);
                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }

    getExcel(path: string, params: HttpParams = new HttpParams()) {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.createBackendUrl(path), {
                    headers: this.headersExell,
                    params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        // para descargar

                        let downloadLink = document.createElement('a');

                        downloadLink.href = window.URL.createObjectURL(new Blob([data.body], { type: 'application/octet-stream' }));
                        if (data)

                        downloadLink.setAttribute('download', `Providers_${dateToDDMMYYYMM(new Date())}_.xlsx`);

                        document.body.appendChild(downloadLink);

                        downloadLink.click();

                       // resolve(fileURL);


                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }

    getCsvIntegrationDeliveryPoint(path: string, params: HttpParams = new HttpParams()) {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.createBackendUrl(path), {
                    headers: this.headersExell,
                    params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        // para descargar

                        let downloadLink = document.createElement('a');

                        downloadLink.href = window.URL.createObjectURL(new Blob([data.body], { type: 'application/octet-stream' }));
                        if (data)

                        downloadLink.setAttribute('download', `IntegrationDeliveryPoint_${dateToDDMMYYYMM(new Date())}.csv`);

                        document.body.appendChild(downloadLink);

                        downloadLink.click();

                       // resolve(fileURL);


                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }

    //vehicle-maintenance
    getvehicleMaintenance(path: string, params: HttpParams = new HttpParams()) {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.createBackendUrl(path), {
                    headers: this.headersExell,
                    params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        // para descargar

                        let downloadLink = document.createElement('a');

                        downloadLink.href = window.URL.createObjectURL(new Blob([data.body], { type: 'application/octet-stream' }));
                        if (data)

                        downloadLink.setAttribute('download', `vehicleMaintenance_${dateToDDMMYYYMM(new Date())}_.xlsx`);

                        document.body.appendChild(downloadLink);

                        downloadLink.click();

                       // resolve(fileURL);


                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }

    /* pdf si es metodo post */
    getPDFRouteAssigne(path: string, data:any) : any{
        return new Promise((resolve, reject) => {
            this.http
                .post(this.createBackendUrl(path), {routes:data},{
                   // routes: params,
                    headers: this.headers,
                    //params,
                    observe: 'response',
                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        const fileURL = URL.createObjectURL(
                            new Blob([data.body], { type: 'application/pdf' }),
                        );

                        window.open(fileURL, '_blank');

                        // para descargar
                        /* let dataType = 'application/pdf';
                        let binaryData = [];
                        binaryData.push(data);
                        let downloadLink = document.createElement('a');
                        downloadLink.href = window.URL.createObjectURL(new Blob([data.body], { type: 'application/pdf' }));
                        if (data)
                            downloadLink.setAttribute('download', 'rutas.pdf');
                        document.body.appendChild(downloadLink);
                        downloadLink.click(); */
                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }
    // pdf devolution type post
    getPDFDevolution(path: string, data:any) : any{
        return new Promise((resolve, reject) => {
            this.http
                .post(this.createBackendUrl(path), data,{

                    headers: this.headers,

                    observe: 'response',

                    responseType: 'blob',
                })
                .subscribe(
                    (data: any) => {

                        const fileURL = URL.createObjectURL(
                            new Blob([data.body], { type: 'application/pdf' }),
                        );

                        window.open(fileURL, '_blank');

                        // para descargar
                        /* let dataType = 'application/pdf';
                        let binaryData = [];
                        binaryData.push(data);
                        let downloadLink = document.createElement('a');
                        downloadLink.href = window.URL.createObjectURL(new Blob([data.body], { type: 'application/pdf' }));
                        if (data)
                            downloadLink.setAttribute('download', 'rutas.pdf');
                        document.body.appendChild(downloadLink);
                        downloadLink.click(); */
                    },
                    (error) => {
                        reject(error);
                        console.log(error);
                    },
                );
        });
    }

    public postFile(path: string, data: any): Observable<any> {
        return this.timeoutToken().pipe(
            switchMap(async (isLogged) => {
                if (isLogged) {
                    let response = await this.http
                        .post(this.createBackendUrl(path), data, {
                            headers: this.headersExcel,
                        })
                        .pipe(take(1))
                        .toPromise();
                    return response;
                }
            }),
            catchError(async (error) => {
                return await throwError(error).toPromise();
            }),
        );
    }

    get headersPdf(): HttpHeaders {
        const headersConfig = {
            'Content-Type': 'application/pdf',
            Authorization: `Bearer ${this.getTokenLocalStorage()}`,
        };
        return new HttpHeaders(headersConfig);
    }

    get headersExell(): HttpHeaders {
        const headersConfig = {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            Authorization: `Bearer ${this.getTokenLocalStorage()}`,
        };
        return new HttpHeaders(headersConfig);
    }

    get headers(): HttpHeaders {
        const headersConfig = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${this.getTokenLocalStorage()}`,
        };
        return new HttpHeaders(headersConfig);
    }

    get headers_client(): HttpHeaders {
        const headersConfig = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
        return new HttpHeaders(headersConfig);
    }

    get headersExcel(): HttpHeaders {
        const headersConfig = {
            // 'Content-Type': 'multipart/form-data',
            enctype: 'multipart/form-data',
            Accept: 'application/json',
            Authorization: `Bearer ${this.getTokenLocalStorage()}`,
        };
        return new HttpHeaders(headersConfig);
    }

    getTokenLocalStorage() {
        return localStorage.getItem('token');
    }

    timeoutToken() {
        return from(
            new Promise((resolve, reject) => {
                if (this.getTokenLocalStorage()) {
                    let payload = JSON.parse(
                        atob(this.getTokenLocalStorage().split('.')[1]),
                    );

                    let tokenExp: any = moment(payload.exp * 1000);
                    let ahora: any = moment(new Date());

                    let diff = Math.round(tokenExp.diff(ahora) / 1000);

                    if (diff < this.timeRefresh) {
                        this.get_client_token()
                            .then((data) => {
                                resolve(data);
                            })
                            .catch((error) => reject(error));
                    } else {
                        resolve(true);
                    }
                } else {
                    this.get_client_token()
                        .then((data) => {
                            resolve(data);
                        })
                        .catch((error) => reject(error));
                }
            }),
        );
    }

    get_client_token() {
        return new Promise((resolve, reject) => {
            this.post_client('oauth/token_admin', {
                client_id: this.client_id,

                client_secret: this.client_secret,

                grant_type: 'refresh_token',

                refresh_token: localStorage.getItem('refresh_token'),
            }).subscribe(
                (data) => {
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);

                    resolve(data);
                },
                (error) => {
                    reject(error);
                },
            );
        });
    }

    postChat(path, socketsID, data){
        const headers = new HttpHeaders({
        Authorization: `Bearer ${this.getTokenLocalStorage()}`,
        'X-Socket-ID': socketsID
        });
        console.log('aqui llegue', path, socketsID)
        return this.timeoutToken().pipe(
            switchMap(async (isLogged) => {
                if (isLogged) {
                    let response = await this.http
                        .post(this.createBackendUrl(path), data, {
                            headers: headers,
                        })
                        .pipe(take(1))
                        .toPromise();
                    return response;
                }
            }),
            catchError(async (error) => {
                return await throwError(error).toPromise();
            }),
        );
    }

    getChat(path, socketsID, data){
        const headers = new HttpHeaders({
        Authorization: `Bearer ${this.getTokenLocalStorage()}`,
        'X-Socket-ID': socketsID
        });

        return this.timeoutToken().pipe(
            switchMap(async (isLogged) => {
                if (isLogged) {
                    let response = await this.http
                        .post(this.createBackendUrl(path), data, {
                            headers: headers,
                        })
                        .pipe(take(1))
                        .toPromise();
                    return response;
                }
            }),
            catchError(async (error) => {
                return await throwError(error).toPromise();
            }),
        );
    }


    getSockets(): Echo {
        return new Echo({
            broadcaster: 'pusher',
            key: environment.geolocationWss.pusher_key,
            wsHost: environment.geolocationWss.wsHost,
            disableStats: true,
            encrypted: false,
            cluster: 'mt1',
            wsPort: 6001,
            wssPort: 6001,
            enabledTransports: ['ws' , 'wss'],
            forceTLS: false,
            authEndpoint: environment.geolocationWss.authEndpoint,
            auth: {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${ this.getTokenLocalStorage() }`
              }
            }
        });
      }

    Logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        localStorage.removeItem('company');
        localStorage.removeItem('roles');
        this.router.navigateByUrl('/login');
    }



}
