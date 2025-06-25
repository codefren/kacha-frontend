import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import * as _ from 'lodash';
import { MT } from '@optimroute/backend';

@Component({
    selector: 'easyroute-management-delivery-points-table',
    templateUrl: './management-delivery-points-table.component.html',
    styleUrls: ['./management-delivery-points-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ManagementDeliveryPointsTableComponent implements OnInit {
    // @Input()
    // name: string;
    // @Input()
    // columns: {
    //     name: string;
    //     type: string;
    //     attributeName: string;
    //     validators: ValidatorFn[];
    // }[];
    // @Input()
    // tableElements: MT[];
    // elements: MT[];
    // @Output() itemAdded = new EventEmitter<MT>();
    // filterNone = {
    //     name: 'none',
    //     type: 'none',
    //     attributeName: 'none',
    // };
    // filter = this.filterNone;
    // filterValue = null;
    // adding: boolean;
    // editingElementIndex: number = -1;
    // emptyForm = {};
    // formGroup: FormGroup;
    // filteredElements() {
    //     if (
    //         this.filter.type == 'none' ||
    //         this.filterValue == null ||
    //         this.filterValue.length == 0
    //     ) {
    //         return this.elements;
    //     } else if (this.filter.type == 'number') {
    //         return this.elements.filter(e => {
    //             return e[this.filter.attributeName] == this.filterValue;
    //         });
    //     } else if (this.filter.type == 'string') {
    //         return this.elements.filter(e => {
    //             return e[this.filter.attributeName].includes(this.filterValue);
    //         });
    //     }
    // }
    // editTable(): void {
    //     console.log('Edit Table');
    // }
    // deleteTable(): void {
    //     console.log('Delete Table');
    // }
    // newAddition(): void {
    //     this.setUpForm(this.emptyForm);
    //     this.adding = true;
    // }
    // confirmAddition(): void {
    //     let newElement = {} as MT;
    //     for (const x of this.columns) {
    //         if (x.type === 'number') {
    //             newElement[x.attributeName] = +this.formGroup.get(x.attributeName).value;
    //         } else if (x.type === 'string')
    //             newElement[x.attributeName] = this.formGroup.get(x.attributeName).value;
    //     }
    //     this.elements.splice(0, 0, newElement);
    //     this.adding = false;
    //     this.itemAdded.emit(newElement);
    // }
    // editElement(i: number): void {
    //     let editingCopy = _.cloneDeep(this.elements[i]);
    //     this.setUpForm(editingCopy);
    //     this.editingElementIndex = i;
    // }
    // confirmEdition(): void {
    //     let element = {} as MT;
    //     for (const x of this.columns) {
    //         element[x.attributeName] = this.formGroup.get(x.attributeName).value;
    //     }
    //     this.elements[this.editingElementIndex] = element;
    //     this.editingElementIndex = -1;
    // }
    // deleteElement(i: number): void {
    //     this.elements.splice(i, 1);
    // }
    // formIsCorrect(): boolean {
    //     for (const x of this.columns) {
    //         if (this.formGroup.get(x.attributeName).invalid) return false;
    //     }
    //     return true;
    // }
    // getErrorMessage(i: number): string {
    //     if (this.formGroup.get(this.columns[i].attributeName).errors.required) {
    //         return 'The field must be defined';
    //     } else if (this.formGroup.get(this.columns[i].attributeName).errors.maxlength) {
    //         return 'The value is too long';
    //     } else if (this.formGroup.get(this.columns[i].attributeName).errors.minlength) {
    //         return 'The value is too short';
    //     } else if (this.formGroup.get(this.columns[i].attributeName).errors.max) {
    //         return 'The value is too large';
    //     } else if (this.formGroup.get(this.columns[i].attributeName).errors.min) {
    //         return 'The value is too small';
    //     }
    // }
    // setUpForm(o: {}): void {
    //     this.formGroup = this.fb.group(o);
    //     for (const x of this.columns) {
    //         this.formGroup.get(x.attributeName).setValidators(x.validators);
    //     }
    // }
    // constructor(private fb: FormBuilder) {}
    constructor() {}
    ngOnInit() {
        //     for (const x of this.columns) {
        //         this.emptyForm[x.attributeName] = '';
        //     }
        //     this.setUpForm(this.emptyForm);
        //     this.elements = this.tableElements.slice();
    }
}
