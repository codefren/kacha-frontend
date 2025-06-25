import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retryWhen, tap, delay, share, buffer, bufferTime, filter } from 'rxjs/operators';


import Echo from 'laravel-echo';
import { ToastService } from '../../../shared/src/lib/services/toast.service';
import { BackendService, JobDescriptor } from '@optimroute/backend';
import { RoutePlanningFacade } from './+state/route-planning.facade';
import { environment } from '@optimroute/env/environment';

interface JobPayload {
    id: number;
    queueName: string;
    state?: string;
    step?: number;
    progress?: number;
    found?: boolean;
    retries?: number;
    result?: any;
    error?: any;
}



@Injectable({
    providedIn: 'root',
})
export class WebSocketService implements OnDestroy {
    private socket$?: WebSocketSubject<object>;

    echo: Echo;

    constructor(
        private routePlanningFacade: RoutePlanningFacade,
        private toast: ToastService,
        private backend: BackendService
    ) {
        this.echo = backend.getSockets();
    }

    /*
                        COMPUTE
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    */
    public compute(payload: { id: number; job: any }[]) {
        const idsMap: { [key: string]: number } = {};
        payload.forEach((item) => {
            console.log(payload);
            idsMap[item.job.id] = item.id;
            this.echo.channel('vrp-optimize.' + item.job.id)
                .listen('.optimize.event', (message: any) => {
                    if (this.isSuccessfulResult(message)) {
                        this.processSuccessfulResultsMessages(message, idsMap);
                    } else if (!this.isSuccessfulResult(message)) {
                        this.progressNonResultNotification(message.payload, idsMap, message.jobsId);
                    }

                });
        });
    }

    private processSuccessfulResultsMessages(msgs: any, idsMap: { [key: string]: number }) {
        const self = this;
        self.successNotification(
            {
                id: msgs.jobsId,
                queueName: msgs.payload.queueName,
                result: msgs.payload.result,
            },
            idsMap,
        );

    }


    private progressNonResultNotification(
        payload: any,
        idsMap: { [key: string]: number },
        jobId: number
    ) {
        console.log(payload);
        if (payload.result && payload.result.error !== null && typeof payload.result.error !== 'undefined') {
            this.toast.displayWebsiteRelatedToastNoHidde(payload.result.description && payload.result.description.includes('hora') ? payload.result.description : payload.result.error);
            this.failOptimizationNotification(
                {
                    id: payload.id,
                    queueName: payload.queueName,
                    error: payload.result.description && payload.result.description.includes('hora') ? payload.result.description : payload.result.error,
                },
                idsMap,
            );
        } else if (payload.progress >= 0) {
            this.routePlanningFacade.setOptimizationStatus(
                idsMap[jobId],
                payload.progress > 0 ? 'active' : 'waiting',
                Math.floor(payload.progress),
            );
        }
    }

    private successNotification(
        payload: { id: number; queueName: string; result: any },
        idsMap: { [key: string]: number },
    ) {
        // console.log('result zone: ' + idsMap[payload.id]);
        if (payload.result.routes.length > 0) {
            this.routePlanningFacade.optimizationSuccess(
                idsMap[payload.id],
                payload.result,
            );
        } else {
            this.routePlanningFacade.optimizationFail(
                [idsMap[payload.id]],
                'No se ha encontrado solución.',
            );
            this.toast.displayHTTPErrorToast(400, 'No se ha encontrado solución.');
        }
    }

    private failOptimizationNotification(
        payload: {
            id: number;
            queueName: string;
            error: any;
        },
        idsMap: { [key: string]: number },
    ) {
        console.log(idsMap);
        this.routePlanningFacade.optimizationFail([payload.id], payload.error);
    }


    private isSuccessfulResult(msg: any) {
        if (msg.payload.result && !msg.payload.result.error) return true;
        return false;
    }

    /*
                   RECOMPUTE
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  */

    public recompute(payload: { id: number; job: any, zoneId: number }[]) {
        // const idsMap: { [key: string]: number } = {};
        const idsMap: { [jobId: number]: { routeId: number; zoneId: number } } = {};

        payload.forEach((item) => {
            (idsMap[item.job.id] = { routeId: item.id, zoneId: item.zoneId }),
            this.echo.channel('vrp-optimize.' + item.job.id)
                .listen('.optimize.event', (message: any) => {
                    this.progressRecomputationNotification(message, idsMap);
                });
        });
    }


    private progressRecomputationNotification(
        payload: any,
        idsMap: { [jobId: number]: { routeId: number; zoneId: number } },
    ) {
        console.log(payload.payload);
        if (payload.payload.result && payload.payload.result.error) {
            console.log(payload.payload.result);
            this.failRecomputationNotification(
                payload.payload.id,
                idsMap,
                payload.payload.result.description ? payload.payload.result.description : 'No se ha encontrado solución',
            );
        } else if (payload.payload.result) {

            if(payload.payload.result.error){
                this.toast.displayWebsiteRelatedToastNoHidde(payload.payload.result.error);
                this.failRecomputationNotification(
                    payload.jobsId,
                    idsMap,
                    payload.payload.result.error,
                );
            } else {
                this.successRecomputation(payload.jobsId, idsMap,payload.payload.result);
            }

        } else if (payload.payload.progress >= 0) {

            console.log('aqui entro', idsMap, payload);
            this.routePlanningFacade.setRecomputationProgress(
                idsMap[payload.jobsId].zoneId,
                idsMap[payload.jobsId].routeId,
                Math.floor(payload.payload.progress ? payload.payload.progress : 0),
            );
        }
    }


    failRecomputationNotification(
        jobId: number,
        idsMap: { [jobId: number]: { routeId: number; zoneId: number } },
        error: string,
    ) {
        this.toast.displayWebsiteRelatedToastNoHidde(error);
        this.routePlanningFacade.recomputationFail(
            {
                [idsMap[jobId].routeId]: {
                    routeId: idsMap[jobId].routeId,
                    zoneId: idsMap[jobId].zoneId,
                },
            },
            error,
        );
    }

    successRecomputation(
        jobId: number,
        idsMap: { [jobId: number]: { routeId: number; zoneId: number } },
        result: any,
    ) {
        this.routePlanningFacade.recomputationSuccess(
            idsMap[jobId].zoneId,
            idsMap[jobId].routeId,
            result,
        );
    }



    ngOnDestroy() {
        this.socket$.complete();
    }
}
