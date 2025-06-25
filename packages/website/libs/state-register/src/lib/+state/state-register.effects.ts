import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { StateRegisterActionTypes } from './state-register.actions';

import * as fromRegister from './state-register.actions';
import { concatMap, map, catchError } from 'rxjs/operators';
import { StateRegisterService } from '../state-register.service';
import { Register } from './state-register.reducer';
import { of } from 'rxjs';
import { ToastService } from '@optimroute/shared';


@Injectable()
export class StateRegisterEffects {
    @Effect()
    persistRegister$ = this.actions$
    .pipe(ofType<fromRegister.PersistRegister>(StateRegisterActionTypes.PersistRegister))
    .pipe(
      concatMap((action) =>
        this.service.persistRegister(action.payload.register).pipe(
          map(
            (register: Register) =>
              new fromRegister.PersistRegisterSuccess({ register: action.payload.register })
          ),
          catchError(error => of(new fromRegister.PersistRegisterFail({ error })))
        )
      )
    );
  @Effect({ dispatch: false })
  persistRegisterFail$ = this.actions$
    .pipe(
      ofType<fromRegister.PersistRegisterFail>(StateRegisterActionTypes.PersistRegisterFail)
    )
    .pipe(
      map(x => {
        this.toastService.displayHTTPErrorToast(Number(x.payload.error.status), x.payload.error.error );
      })
  );
    constructor(
        private actions$: Actions,
        private service: StateRegisterService,
        private toastService: ToastService
    ) {}
}
