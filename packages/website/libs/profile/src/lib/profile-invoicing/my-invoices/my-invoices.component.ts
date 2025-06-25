import {
    Component,
    OnInit,
    ViewEncapsulation,
    OnDestroy,
    ChangeDetectorRef,
} from '@angular/core';
import { StateCompaniesService } from '@optimroute/state-companies';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DateAdapter, getMatIconFailedToSanitizeUrlError } from '@angular/material';
import { ToastService, dateToObject, getToday, dateNbToDDMMYYY } from '@optimroute/shared';
import { TranslateService } from '@ngx-translate/core';
import { Invoice, Pagination } from '@optimroute/backend';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
    NgbDateParserFormatter,
    NgbDatepickerI18n,
    NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@optimroute/env/environment';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
declare var $;
@Component({
    selector: 'easyroute-my-invoices',
    templateUrl: './my-invoices.component.html',
    styleUrls: ['./my-invoices.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MyInvoicesComponent implements OnInit, OnDestroy {
    minDate: NgbDateStruct = dateToObject('2019-01-01');
    today: NgbDateStruct = dateToObject(getToday());

    selectedPage: number = 1;
    pagination: Pagination;
    paginationArray: any = [];
    offset: number = 3;
    invoices: any[] = [];
    showedInvoices: any[] = [];
    date_from: any = moment()
        .startOf('month')
        .format('DD-MM-YYYY');
    date_to: any = moment(Date.now()).format('DD-MM-YYYY');
    unsubscribe$ = new Subject<void>();
    table: any;

    constructor(
        private companiesService: StateCompaniesService,
        private router: Router,
        private toastService: ToastService,
        private _adapter: DateAdapter<any>,
        private _translate: TranslateService,
        private changeDetect: ChangeDetectorRef,
        private facadeProfile: ProfileSettingsFacade,
    ) {}

    ngOnInit() {
        this.facadeProfile.profile$.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
            if (data.email !== '') {
                this._adapter.setLocale('es');
                this.companyInvoices({
                    date_from: this.date_from,
                    date_to: this.date_to,
                });
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    async companyInvoices(range) {
        await this.companiesService
            .getCompanyInvoice(range)
            .pipe(take(1))
            .subscribe((data) => {
                this.cargar(data.data);
            });
    }

    getdateInvoicenTo(event: NgbDateStruct) {
        this.date_to = dateNbToDDMMYYY(event);
        this.companyInvoices({
            date_from: this.date_from,
            date_to: this.date_to,
        });
    }

    getdateInvoicenFrom(event: NgbDateStruct) {
        this.date_from = dateNbToDDMMYYY(event);
        this.companyInvoices({
            date_from: this.date_from,
            date_to: this.date_to,
        });
    }

    async getPdfInvoicen(id: any) {
        await this.companiesService.getPdfCompanyInvoice(id);
    }

    cargar(invoices) {
        this.table = $('#invoices').DataTable({
            destroy: true,
            processing: false,
            lengthMenu: [5, 10, 20, 30, 50],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            dom: `<r<'table-responsive't>p>`,
            /* dom: `
                  <'row'
                  <'col-sm-6 col-12 d-flex flex-column justify-content-center'l>
                      <'col-sm-6 col-12 label-search'fr>
                  >
                  <"top-button-hide"B><t><ip>
                `, */
            data: invoices,
            language: environment.DataTableEspaniol,
            columns: [
                {
                    data: 'created',
                    sortable: false,
                },
                {
                    data: 'number',
                    sortable: false,
                },
                {
                    data: null,
                    sortable: false,
                    render: (data, type, row) => {
                        return '';
                    },
                },
                {
                    data: 'url_pdf',
                    sortable: false,
                    searchable: false,
                    title: this._translate.instant('GENERAL.ACTIONS'),
                    render: (data, type, row) => {
                        let botones = `
                            <a target="_blank" href="${ data }">
                                <button class="btn btn-primary btn-small">
                                    ${ this._translate.instant('INVOICING.MY_INVOICES.DOWNLOAD') }
                                </button>
                            </a>
                        `;

                        return botones;
                    },
                },
            ],
        });
    }
}
