import { NgbDateParserFormatter, NgbDateStruct, NgbDatepickerI18n, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export class MomentDateFormatter extends NgbDateParserFormatter {
    readonly DT_FORMAT = 'DD/MM/YYYY';
  
    parse(value: string): NgbDateStruct {
        if (value) {
            value = value.trim();
            moment(value, this.DT_FORMAT)
        }
        return null;
    }
    format(date: NgbDateStruct): string {
        if (!date) return '';
        let mdt = moment([date.year, date.month - 1, date.day]);
        if (!mdt.isValid()) return '';
        return mdt.format(this.DT_FORMAT);
    }
  
}

const I18N_VALUES = {
    en: {
      weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    es: {
      weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
      months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    }
};

@Injectable()
export class Language {
  language = 'es';
}

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
    constructor(private _i18n: Language, private translateService: TranslateService) {
        super();
        this._i18n.language = this.translateService.currentLang;
    }

    getWeekdayShortName(weekday: number): string {
        return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
    }
    getMonthShortName(month: number): string {
        return I18N_VALUES[this._i18n.language].months[month - 1];
    }
    getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }
    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }
}

export function dateToObject(date: string = new Date().toISOString()): NgbDateStruct {

    let dateSelected = moment(date);
    return {
        year: +dateSelected.format('YYYY'),
        month: +dateSelected.format('MM'),
        day: +dateSelected.format('DD')
    };
         
}

export function objectToString(date: NgbDateStruct): string {
    if(date){
        let data = `${date.year}-${date.month.toString().padStart(2,'0')}-${date.day.toString().padStart(2,'0')}`;

        return moment( data ).format('YYYY-MM-DD');
    } else {
        return '';
    }
}

export function dateNbToYYYYMMDD( date: NgbDateStruct ): string {
    let data = `${date.year}-${date.month}-${date.day}`;
    let fecha = new Date(data).toISOString()

    return moment( fecha ).format('YYYY-MM-DD');
}

export function getToday(): string {
    return moment().format('YYYY-MM-DD');
}

export function getYearToToday(): string {
    return moment().subtract(1, 'years').format('YYYY-MM-DD');
}

export function getYearToTodayFilter(year: any): string {
    return moment(year).subtract(1, 'years').format('YYYY-MM-DD');
}

export function getTodaysubtract(): string {
    return moment().subtract(30,'days').format('YYYY-MM-DD');
}

export function getYesterdaySubtract(): string {
    return moment().subtract(2,'days').format('YYYY-MM-DD');
}

export function getDateMoment( date: string ): string {
    return moment( date ).format('DD/MM/YYYY');
}

export function getDateMomentHours( date: string ): string {
    return moment( date ).format('DD-MM-YYYY kk:mm:ss');
}


//Primer dia del mes
export function getStartOf(): string {
    return moment().startOf('month').format('YYYY-MM-DD');
}

//Ultimo día del mes
export function getEndOf(): string {
    return moment().endOf('month').format('YYYY-MM-DD');
}

export function dateToDDMMYYY(date: Date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();

    return dd + 'z/' + mm + '/' + yyyy;
}

export function dateToDDMMYYYMM(date: Date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();
    var hm=moment( date ).format('kk:mm:ss');

    return dd + 'z/' + mm + '/' + yyyy +hm;
}


export function dateNbToDDMMYYY(date: any) {
    
    var dd = String(date.day).padStart(2, '0');
    var mm = String(date.month).padStart(2, '0');
    var yyyy = date.year;

    return dd + '-' + mm + '-' + yyyy;
}

export function dateNbToYYYDDMM(date: any) {
    
    var dd = String(date.day).padStart(2, '0');
    var mm = String(date.month).padStart(2, '0');
    var yyyy = date.year;

    return yyyy + '-' + dd + '-' + mm;
}

// para backend
export function dateYYYYMMDD( date = '' ) {
    let arrdate = date.split('/');
    return `${ arrdate[2] }-${ arrdate[1] }-${ arrdate[0] }`;
}

// para la vista 
export function parseDate( date = '' ) {
    let arrdate = date.split('-');
    return `${ arrdate[2] }/${ arrdate[1] }/${ arrdate[0] }`;
}

export function getHour( date: string ): string {
    return moment( date ).format('HH:mm');
}
