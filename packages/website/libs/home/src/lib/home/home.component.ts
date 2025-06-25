import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BackendService, FilterState } from '@optimroute/backend';
import { ToastService, contrastColor } from '@optimroute/shared';
import { StateEasyrouteFacade } from '@optimroute/state-easyroute';
import { ProfileSettingsFacade, StateProfileSettingsService } from '@optimroute/state-profile-settings';
import { AuthLocalService } from 'libs/auth-local/src/lib/auth-local.service';
import { take, tap, map, concatMap } from 'rxjs/operators';
import { ModalHelpComponent } from '../modal-help/modal-help.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalNoveltyComponent } from '../modal-novelty/modal-novelty.component';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { environment } from '@optimroute/env/environment';
declare var $: any;
@Component({
    selector: 'easyroute-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

    profile: any;

    guide: any;

    soon: boolean = false;

    companyPorfileTypeId: number = 0;

    novelties = [];

    urlYoutube:string ='https://www.youtube.com/embed/rIDP756HGUI?si=R2d0tI7l5W2StZcB';

    videoLoaded:any;


    readonly urlPolpoCom: string = 'https://polpoo.com/'

    readonly urlAcademy :string ='https://academy.polpoo.com/';

    readonly urlExperience :string ='https://docs.google.com/forms/d/1bofgOrxSiqnXxHcTtfQNHBcEUTmIYiepezdnOjILe8A/viewform?edit_requested=true';

    readonly urlSuggestions :string ='https://docs.google.com/forms/d/1Eu_tGZWN9xnvL3u-ihrtJX7SjIBPxj6h1Y6p5jWdAQY/viewform?edit_requested=true';

    totalizedDate: any;

    showCode: boolean = false;

    filter: FilterState = {
        name: 'travel_tracking',
        values: {
            dateDeliveryStart: this.getToday(),
        }
    };

    tableHome: any;


    constructor(public authLocal: AuthLocalService,
            private modalService: NgbModal,
            public  profileService: StateProfileSettingsService,
            public facade: ProfileSettingsFacade,
            private router: Router,
            private backend: BackendService,
            private changeDetectorRef: ChangeDetectorRef,
            private toast: ToastService,
            private sanitizer: DomSanitizer,
            private _translate:TranslateService
            ) {
                //this.videoLoaded = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlYoutube);
            }

    ngOnInit() {


        this.facade.guide$.pipe(take(1)).subscribe( (guide)=>{

            this.guide = guide;

            console.log(this.guide, 'this.guide');

            /* if( guide.noveltyLast) {

                this.openModalNovelty();
             }  */
           /*  if( guide.noveltyLast) {

                this.openModalNovelty();
             }  */
          /*   if (guide.showTipsModal && guide.helpGuideId === null) {

                this.openModalHelp();

            } else if( guide.noveltyLast) {

               this.openModalNovelty();
            } */
        });

        this.getInfoProfile().pipe( take(1) ).subscribe(
            ( companyProfileId ) => {
                if ( companyProfileId ) {
                    this.companyPorfileTypeId = companyProfileId;
                }
            },
            ( error ) => console.log( error )
        );

        this.backend.get('novelty_home_list').pipe(take(1)).subscribe(({data}) =>{
            this.novelties = data;
            this.loadTotalizedDate();

            this.cargar();
            this.changeDetectorRef.detectChanges();
        }, error => {
            this.toast.displayHTTPErrorToast(error.error.code, error.error.error);
        })
       this.getUrlVideo();

    }

    async getUrlVideo(){
        await this.backend.get('user/me').pipe(take(1)).subscribe((data) =>{

            console.log(data , 'me');

           this.videoLoaded = this.sanitizer.bypassSecurityTrustResourceUrl(data.urlVideo);


            this.changeDetectorRef.detectChanges();
        }, error => {
            this.toast.displayHTTPErrorToast(error.error.code, error.error.error);
        })
    }

    isAdminAdministrative() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 1 || role === 2 || role === 3 || role === 8) !==
                  undefined
            : false;
    }

    isDirectorAgent() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 9 || role === 10) !== undefined
            : false;
    }

    isControlPanel() {
        return this.authLocal.getRoles()
            ? this.authLocal.getRoles().find((role) => role === 7) !== undefined
            : false;
    }

    openModalHelp(){
        const modal = this.modalService.open(ModalHelpComponent, {

            backdrop:'static',

            backdropClass:'customBackdrop',

            centered: true,

            size:''

          });

          modal.result.then((data) => {

            console.log(data,'data cierre del modal')

              if (data) {

                this.facade.changeShowTipsModal(data);

                this.openModalNovelty();

              } else {
                  this.facade.updateHelpGuideId(this.guide.helpGuideId === null? 1 : this.guide.helpGuideId +1 );
              }
            }, (error) => {
          });
    }

    openModalNovelty(data?: any){

        const modal = this.modalService.open(ModalNoveltyComponent, {

          backdropClass: 'modal-backdrop-ticket',

          centered: true,

          windowClass:'modal-novelty-home',

          size:'md'

        });

        modal.componentInstance.title = this._translate.instant('HOME.NOVELTY_1');

        modal.componentInstance.Subtitle = '';

        modal.componentInstance.message = this._translate.instant('HOME.TEXT_8');


        modal.componentInstance.accept =  this._translate.instant('HOME.UNDERTOOD');

        modal.componentInstance.videoLoaded = this.videoLoaded;

        modal.result.then(

          (data) => {

            if (!data) {

              console.log(data);
              this.facade.changeNoveltyLast(data);

            }

          },
          (reason) => {


          },
        );

      }

    getInfoProfile() {

        // concatMap permite ejecutar una serie de observables en secuencia.
        let observable$ = this.facade.loaded$.pipe(
            take(1),
            concatMap( loaded => loaded ?
                this.facade.profile$.pipe(
                    take(1),
                    map( data => data.company.companyProfileTypeId ),
                ) : null )
        );

        return observable$;
    }

    isAdmin() {
        let value =
            this.authLocal.getRoles() !== null
                ? this.authLocal
                    .getRoles()
                    .find(
                        (role) =>
                            role === 1 ||
                            role === 2,
                    ) !== undefined
                : false;
        return value;
    }


     goToLinkAcademyHome(url: string){

        window.open(url, "_blank");

    }

    openLinkGeneral(url: string){
        window.open(url, "_blank");
    }

    getToday(nextDay: boolean = false) {
        if (nextDay) {
            return moment(new Date().toISOString())
                .add(1, 'day')
                .format('YYYY-MM-DD');
        }

        return moment(new Date().toISOString()).format('YYYY-MM-DD');
    }

    /* informacion de cuadros */
    loadTotalizedDate() {

        this.showCode = false;

        this.backend

            .post('route_planning/route/travel_tracking_totalized', this.filter.values)
            .pipe(
                take(1)).subscribe(

                    (resp: any) => {

                        this.totalizedDate = null;

                        this.totalizedDate = resp;

                        console.log(this.totalizedDate, 'this.totalizedDate');

                        this.showCode = true;

                        this.changeDetectorRef.detectChanges();


                       /*  try {
                            this.changeDetectorRef.detectChanges();
                            this.cargar();
                        } catch (error) {

                        } */
                       /*  if (this.zones.length > 0) {
                            this.cargar();

                        } else {

                            this.zones = [];
                            this.cargar();
                        } */

                    },
                    (error) => {
                        this.showCode = true;

                        this.toast.displayHTTPErrorToast(
                            error.status,
                            error.error.error,
                        );
                    },
                );
    }

    cargar() {

        console.log('entro aqui');


        if (this.tableHome) {
            this.tableHome.clear();
            //this.table.state.clear();
        }

        let that = this;

        let url = environment.apiUrl + 'route_planning/route/travel_tracking?' +

            (this.filter.values.dateDeliveryStart != '' ? '&dateDeliveryStart=' +
                this.filter.values.dateDeliveryStart : '');


        let tok = 'Bearer ' + this.authLocal.obtenerTokenLocalStorage();

        let table = '#travelTrackingHome';

        this.tableHome = $(table).DataTable({
            destroy: true,
            processing: true,
            serverSide: true,
            stateSave: true,
            stateSaveParams: function (settings, data) {
                data.search.search = '';
            },
            initComplete: function (settings, data) {
                settings.oClasses.sScrollBody = '';
               // $("#travelTrackingHome thead").remove();
            },
            order: [[0, 'asc']],
            cache: false,
            lengthMenu: [10, 100],
            dom: `
                <'row'
                    <'col-xl-6 col-12 d-flex flex-column justify-content-start align-items-center align-items-md-start p-0'
                        <'col-xl-12 col-md-12 col-12 col-sm-12 pl-2'>
                    >
                    <'col-xl-6 col-12 d-flex flex-column justify-content-center align-items-center align-items-md-end p-0'
                        <'row'
                            <'col-sm-6 col-md-6 col-xl-3 col-5 dt-buttons-table-otro pb-0 pt-0'>
                        >
                    >
                >
                <'row p-0 reset'
                <'offset-sm-6 offset-lg-6 offset-5'>
                <'col-sm-4 col-lg-4 col-4 d-flex flex-column justify-content-center'r>>
                <"top-button-hide"><'table-responsive't>
                <'row align-items-center reset'
                    <'col-lg-5 col-md-5 col-xl-5 col-12 pl-2 pr-3 d-flex flex-column justify-content-center align-items-lg-start mt-xl-0 mt-3'i>
                    <'col-lg-7 col-md-7 col-xl-7 col-12 pl-3 pr-0 d-flex flex-column justify-content-center align-items-lg-end align-items-sm-center'
                        <'row reset align-items-center'
                            <'col-sm-6 col-md-6 col-xl-6 col-6'l>
                            <'col-sm-6 col-md-6 col-xl-6 col-6'p>
                        >
                    >
                >
            `,

            buttons: [
                {
                    extend: 'colvis',
                    text: '',
                    columnText: function (dt, idx, title) {
                        return title;
                    },
                },
            ],

            language: environment.DataTableEspaniol,
            ajax: {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: tok,
                },
                error: (xhr, error, thrown) => {
                    let html = '<div class="container" style="padding: 30px;">';
                    html +=
                        '<span class="text-orange">Ha ocurrido un errror al procesar la informacion.</span> ';
                    html +=
                        '<button type="button" class="btn btn-outline-danger" id="refrescar"><i class="fa fa-refresh fa-spin"></i> Refrescar</button>';
                    html += '</div>';

                    $('#companies_processing').html(html);

                    $('#refrescar').click(() => {
                        this.cargar();
                    });
                },
            },
            rowCallback: (row, data) => {

                console.log('hay cambios en la tabla ?');

                //$("#travelTrackingHome thead").remove();
                /* if ($.inArray(data.id, this.selected) !== -1) {

                    $(row).addClass('selected');
                    $('#checkboxDriverCost').prop('checked', that.selectAll).addClass('checked');
                    setTimeout(() => {
                        $('#ck-' + data.id.replace(' ', '-')).prop('checked', true);
                    }, 900);

                } */
                $(row).addClass('point');
            },

            columns: [
                {
                    data:'id',
                    visible:false,
                },
                {
                    data: 'name',
                    className: 'text-left padding-travel',
                    width: "30%",
                    title: this._translate.instant('TRAVEL_TRACKING.ROUTE'),
                    render: (data, type, row) => {
                        let id = data;
                        if (id.length > 35) {
                            id = id.substr(0, 29) + '...';
                        }
                        return (
                            '<span class="route-name " data-toggle="tooltip" data-placement="top" title="' +
                            data +
                            '">' +
                            id +
                            '</span>'
                        );
                    },
                },
                {
                    data: 'id',
                    className: 'text-center',
                    width: "30%",
                    title: this._translate.instant('TRAVEL_TRACKING.CONDITION'),
                    render: (data, type, row) => {

                        let parcent = row.percentComplete;

                        let status = row.statusRouteId == 3 ? 'state-end' : row.statusRouteId == 2 && row.percentComplete > 0 ? 'state-process' : 'state-assigned';

                        let statusText = row.statusRouteId == 3 ? 'Finalizado' : row.statusRouteId == 2 && row.percentComplete > 0 ? 'En activo' : 'Por iniciar';



                        return (`
                            <div class="condition-state ${status}">
                               ${statusText}
                            </div>
                        `);


                    }
                },
                {
                    data: 'id',
                    width: "30%",
                    className: 'text-left',
                    title: this._translate.instant('TRAVEL_TRACKING.PROCESS'),
                    render: (data, type, row) => {

                        let parcent = row.percentComplete;

                        let classSpan = that.getContrastColor(row.color);

                        if (!row.percentComplete && !row.totalDelivered) {
                            return (`
                                <div class="progress light  progres-travel">
                                    <div class="progress-bar value-bar-travel" style="background-color:${row.color}; color:${parcent < 40 ? '#000' : '#FFF'}; width:${parcent}% !important;">
                                        <span class="pl-2">${row.totalDelivered}/${row.totalClient}</span>
                                    </div>

                                </div>
                    `);
                        } else {
                            return (`
                                <div class="progress light  progres-travel">
                                    <div class="progress-bar complete border-travel" style="background-color:${row.color}!important; width:${row.percentComplete}% !important" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"">

                                        <span class="pl-2" style="color:${classSpan}">${row.totalDelivered}/${row.totalClient}</span>

                                    </div>
                                </div>
                            `);
                        }

                    }
                },

            ],
        });



        $('.dataTables_filter').html(`
        <div class="input-group datatables-input-group-width">
            <input
                id="search"
                type="text"
                class="form-control search-general
                pull-right input-personalize-datatable"
                placeholder="Buscar"
                style="max-width: initial;"
            >
            <span class="input-group-append">
                <span class="input-group-text input-group-text-general table-append">
                    <img class="icons-search" src="assets/icons/optimmanage2/icono-lupanaranja.svg">
                </span>
            </span>
        </div>
    `);



/*         $('.dt-button').css("border", "0px");

        $('.dt-button').css("height", "0px");

        const $elem = $('.dt-button');


        $elem[0].style.setProperty('padding', '0px', 'important');

        $('.dt-buttons').css("height", "0px");

        $('#dt-buttons-table').off('click');

        $('#dt-buttons-table').on('click', function (event: any) {

            $('.dt-button').click();

        }); */

        $('#search').on('keyup', function () {
            $(table)
                .DataTable()
                .search(this.value)
                .draw();
        });

        $('.dataTables_filter').removeAttr('class');


        /* evento del reorder */


       // this.initEvents(table + ' tbody', this.tableHome);
    }
    getContrastColor(originalColor: string) {
        return contrastColor(originalColor === '#000' ? '#000000' : originalColor);
    }

}

