import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';
import { toASCII } from 'punycode';
import { Router } from '@angular/router';
@Injectable()
export class ToastService {
    displayWebsiteRelatedToast(content: string, action?: string, duration?: number, reload?: boolean) {
        let message = this.snackBar.open(content, action ? action : 'Aceptar', {
            duration: duration ? duration : 3000,
        });

        if(reload){
            message.afterDismissed().subscribe((data)=>{
               location.reload() ;
            })
        }

    }

    displayWebsiteRelatedToastNoHidde(content: string, action?: string, duration?: number, reload?: boolean) {
        let message = this.snackBar.open(content, action ? action : 'Aceptar');

        if(reload){
            message.afterDismissed().subscribe((data)=>{
               location.reload() ;
            })
        }

    }

    displayHTTPErrorToast(status: any, content?: any, action?: string, duration?: number) {


        console.log('status', status, 'content', content);
        console.log(status);
        console.log(content);
        let toastContent = null;
        let goLogin: boolean = false;
        console.log('status', status);
        if(status === 500 || status === '500'){
            toastContent = 'Error inesperado,  Contacte al proveedor';
        }

        if(status === 409 || status === '409'){
            toastContent = content.error;
        }
        else if (status === 0) {
            toastContent = 'Comprueba la conexión a internet';
        } 
        else if (status == 422) {
            if (content.error) {
                console.log(content);
                let errores = Object.keys(content.error);
                console.log(errores);
                errores.forEach((element) => {
                    toastContent = content.error[element];
                });
            } else {
                console.log(content);
                let errores = Object.keys(content);
                console.log(errores);
                errores.forEach((element) => {
                    toastContent = content[element];
                });
            }
           
        } else if (status == 401) {
            toastContent = content;
            goLogin = true;
        } else if (400 <= status && status < 500) {
            toastContent = 'Error inesperado,  Contacte al proveedor';
        } else if (500 <= status && status < 600) {
            toastContent = 'Error inesperado,  Contacte al proveedor';
        }
        if (toastContent !== null) {
            this.snackBar.open(toastContent, action ? action : 'Aceptar', {
                duration: duration ? duration : 3000
            });
        }
        if (goLogin) {
            this.router.navigateByUrl('/login');
        }
    }
    pruevba(pru: any) {
        console.log(pru);
    }
    constructor(private snackBar: MatSnackBar, private router: Router) {}
}
