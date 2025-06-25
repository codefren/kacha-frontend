import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { NotesInterface, SubNotesInterface } from '@optimroute/backend';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NoteService } from '../../note.service';
import { NotesMessages } from '@optimroute/shared';
import { environment } from '@optimroute/env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedNoteComponent } from './shared-note/shared-note.component';
import { LoadingService, ToastService } from '@optimroute/shared';
import { take } from 'rxjs/operators';
import { NoteModalNewSubNotesComponent } from './note-modal-new-sub-notes/note-modal-new-sub-notes.component';
// import { dateToDDMMYYY } from '../../../../../shared/src/lib/util-functions/date-format';
declare var $: any;
import * as _ from 'lodash';
import { NoteModalConfirmationSubNotesComponent } from './note-modal-confirmation-sub-notes/note-modal-confirmation-sub-notes.component';
import { AuthLocalService } from '@optimroute/auth-local';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';

@Component({
  selector: 'lib-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit {

    loadingUSer: string = 'success';
    NewSubnotes :string ='new';
    note_messages: any;
    noteForm: FormGroup;
    notes: NotesInterface;
    salesmanSelected: any = [];
    subNotes: SubNotesInterface [] =[];
    subNotesTable :any =[];
    table: any;
    users : any = [];

    constructor(
        private fb: FormBuilder,
        private _noteService: NoteService,
        private _translate : TranslateService,
        private _toastService: ToastService,
        private loading: LoadingService,
        private Router: Router,
        private _modalService: NgbModal,
        private _loading: LoadingService,
        private noteService: NoteService,
        private _activatedRoute: ActivatedRoute,
        private detectChanges: ChangeDetectorRef,
        public _authLocalService: AuthLocalService,
        private profileFacade: ProfileSettingsFacade
    ) { }

    ngOnInit() {
        this.initDataTable();
    
        this._activatedRoute.params.subscribe(params => {
            if ( params['note_id'] !== 'new' ) {
                this.loading.showLoading();
            
                this._noteService.getNotes( params['note_id'] ).subscribe( (resp: any) => {
                    this.notes = resp.data;

                    console.log( this.notes );

                    this.subNotes =[];
                    
                    this.subNotes = resp.data.companySubNote;
          
                    this.salesmanSelected = resp.data.companyNoteShare.map(x => {
                        return {
                            name: x.user.name,
                            surname: x.user.surname,
                            id: ''+x.userId
                        }
                    });

                    console.log( this.salesmanSelected );
          
                    this.loading.hideLoading();
          
                    this.validaciones( this.notes);
                },(error)=>{
                    this.loading.hideLoading();
          
                    this._toastService.displayHTTPErrorToast( error.status, error.error.error );
                }); 
            }else{
                this.notes = new NotesInterface();
      
                this.validaciones( this.notes);
            }
        });
    }

    validaciones( note : NotesInterface ) {
        this.noteForm = this.fb.group({
            name:[note.name,[Validators.required]],
            description: [note.description, [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
            isActive:[note.isActive, [Validators.required]],
            isDeleted:[note.isDeleted, [Validators.required]]
        });

        if (this.isAdmin()) {
            this.profileFacade.profile$.pipe(take(1)).subscribe((data) => {
                if (data) {
                    this.noteForm.addControl(
                        'userSellerId', new FormControl(note.user.id === 0 ? data.profile.id : note.user.id, [Validators.required]),
                    );
                
                    this.getUsers();
                }
            });  
        }

        let note_messages = new NotesMessages();
    
        this.note_messages = note_messages.getNotesMessages();
    }

    getUsers() {
        this.loadingUSer = 'load';

        setTimeout( () => {
            this._noteService.getUsers(this.notes.user.id).subscribe((data:any) => {
                this.users = data.data;
                
                this.loadingUSer = 'success';
            }, (error)=>{
                this.loadingUSer = 'error';
                
                this._toastService.displayHTTPErrorToast( error.status, error.error.error );
            }); 
        }, 1000 );
    }
    
    initDataTable() {
        this.table = $('#userShare').DataTable({
            destroy: true,
            serverSide: false,
            processing: false,
            stateSave: true,
            cache: false,
            lengthMenu: [ 30, 50, 100],
            stateSaveParams: function (settings, data) {
                data.search.search = "";
            },
            dom:'<lfr<"top-button-hide"B><t>ip>',
            buttons: [{
                extend: 'colvis',
                text: 'Mostrar/ocultar',
                columnText: function(dt, idx, title) {
                    return idx + 1 + ': ' + title;
                },
            }], 
            language: environment.DataTableEspaniol,
            columns: [{
                data: 'name',
                title: this._translate.instant('NOTES.NOTES_FORM.TITLE'),
                render: (data, type, row) => {
                    let name = data;
                  
                    if (name.length > 30) {
                      name = name.substr(0, 29) + '...';
                    }
                  
                    return (
                        '<span data-toggle="tooltip" data-placement="top" title="' +
                        data +
                        '">' +
                        name +
                        '</span>'
                    );
              },
            }
          ]
        });
      
        //this.editar('#notes tbody', this.table);
    }

    createNote() {
        let dataform = _.cloneDeep(this.noteForm.value);

        let companySubNote = [];

        this.subNotes.forEach((element) => {
            companySubNote.push({
                title:element.title,
                description:element.description
            })
        });
  
        dataform.companySubNote = companySubNote;

        if (false) {
            this._toastService.displayHTTPErrorToast('Aviso;', 'El usuario no es valido');
        } else {
            if (this.notes.id && this.notes.id > 0) {
                if (this.salesmanSelected.length > 0) {
                    this.noteForm.value.companyNoteShare = this.salesmanSelected.map((data) => {
                        return {
                            userId: data.id
                        }
                    });  

                    dataform.companyNoteShare = this.noteForm.value.companyNoteShare;
                }

                this._noteService.updateNote(this.notes.id, this.noteForm.value).subscribe( (data: any) => {
                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                        this._translate.instant('GENERAL.ACCEPT')
                    );

                    this.Router.navigate(['note']);
                }, (error)=>{
                    this._toastService.displayHTTPErrorToast( error.status, error.error.error );
                });
            } else {
                if (this.salesmanSelected.length > 0) {
                    this.noteForm.value.companyNoteShare = this.salesmanSelected.map((data) => {
                        return {
                            userId: data.id
                        }
                    });  

                    dataform.companyNoteShare = this.noteForm.value.companyNoteShare;
                }

                this._noteService.registerNote(dataform).subscribe( (data: any) => {
                    this._toastService.displayWebsiteRelatedToast(
                        this._translate.instant('GENERAL.REGISTRATION'),
                        this._translate.instant('GENERAL.ACCEPT') 
                    );

                    this.Router.navigate(['note']);
                }, (error)=>{
                    this._toastService.displayHTTPErrorToast( error.status, error.error.error );
      
                }); 
            }
        }
    }

    changeActive() {

        if ( this.notes.isActive ) {
            this.notes.isActive = false;
            this.noteForm.get('isActive').setValue( this.notes.isActive );

        } else if ( !this.notes.isActive ) {
            this.notes.isActive = true;
            this.noteForm.controls['isActive'].setValue( this.notes.isActive );
        
        }
    }

    changeIsDeleted() {
        
        if ( this.notes.isDeleted ) {
            this.notes.isDeleted = false;
            this.noteForm.controls['isDeleted'].setValue( this.notes.isDeleted );

        } else {
            this.notes.isDeleted = true;
            this.noteForm.controls['isDeleted'].setValue( this.notes.isDeleted );

        }
    }

    eliminated(id: number) {
        // if (this.notes.id && this.notes.id > 0) {
        //     let companyNoteShare = this.salesmanSelected.filter(x => x.id === id).map(y => { 
        //         return {
        //             userId: y.id
        //         }
        //     });
  
        //     this.deleteFromNote(companyNoteShare, this.notes.id);  
        // }
    
        this.salesmanSelected = this.salesmanSelected.filter(x => x.id !== id);
    }
  
    shareNote() {
        const modal = this._modalService.open(SharedNoteComponent, {
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            centered: true
        });
    
        modal.componentInstance.selected = this.salesmanSelected;

        if (this.notes.id && this.notes.id > 0) {
            modal.componentInstance.idNote = this.notes.id;
        }
    
        modal.result.then((data) => {
            if (data) {
                this.salesmanSelected = data;

                this.detectChanges.detectChanges();
                /* let dataResult = {
                    isActive: true,
                    name :data.name,
                }

                this._categoryService.registerByCompany(dataResult).subscribe( (data: any) => {
                    this._toastService.showSuccess(this._translate.instant('GENERAL.CONFIRMATION'), this._translate.instant('GENERAL.REGISTRATION'));
      
                    this.getCategory();
                }, (error)=>{
                    this._toastService.errors(error.error);
                }); */
            }
        }, (reason) => {
            this._toastService.displayWebsiteRelatedToast(
                this._translate.instant('GENERAL.YOU_HAVE_NOT_MADE_SELECTION'),
                this._translate.instant('GENERAL.NOTICE') 
            );
        });
    }

    deleteFromNote(companyNoteShare: any, id: number) {
        this._loading.showLoading();
        
        this.noteService.deleteUserShareNote({companyNoteShare}, id).pipe(take(1)).subscribe((data) => {
            this._loading.hideLoading();
        });
    }

    searchSubNotes(subNote : any){
        const modal = this._modalService.open(NoteModalNewSubNotesComponent, {
            // size:'xl',
            centered: true
        });
    
        modal.componentInstance.SubnoteData = subNote;
  
        modal.result.then((data) => {
            if (data) {
                let dato = {
                    title :data.title,
                    description: data.description,
                    companyNoteId:data.companyNoteId,
                    id:data.id
                };
        
                if (this.notes.id >0) {
                    const datosFilter = this.subNotes.find(x => x.id == dato.id);
          
                    if (datosFilter) {
                        this.updateSubNotes(dato);
                    } else if(!datosFilter){
                        this.addNewSubNotes(dato);
                    }; 
                } else {
                    if (dato.id === null) {
                        this.subNotesTable.push(dato);

                        for (let i = 0; i < this.subNotesTable.length; i++) {
                            this.subNotesTable[i].id = i;
                        }
                    } else {
                        this.subNotesTable.find((x: any) => x.id == dato.id).title = dato.title;

                        this.subNotesTable.find((x: any) => x.id == dato.id).description = dato.description;
                    }

                    this.subNotes = this.subNotesTable;

                    this.detectChanges.detectChanges();
                };
            };
        }, (reason) => {});
    }

    updateSubNotes(subNotes: any){
        let companySubNote = {
            id:subNotes.id,
            title:subNotes.title,
            description:subNotes.description
        };

        this._noteService.updateSubNote(companySubNote.id, companySubNote).subscribe( (data: any) => {
            this.ngOnInit();
        }, (error)=>{
            this._toastService.displayHTTPErrorToast( error.status, error.error.error );
        });
    }

    addNewSubNotes(subNotes: any){
        let companySubNote = {
            companyNoteId: this.notes.id,
            title: subNotes.title,
            description: subNotes.description
        };

        this._noteService.registerSubNote(companySubNote).subscribe( (data: any) => {
            this.ngOnInit();
        }, (error)=>{
            this._toastService.displayHTTPErrorToast( error.status, error.error.error );
        });
    }

    deleteSubNoteTable(companyNoteId: any){
        if (this.notes.id == 0) {
            this.subNotesTable = this.subNotesTable.filter( (x: any) => x.id !== companyNoteId );

            this.subNotes = this.subNotesTable;
        } else {
            const modal = this._modalService.open(NoteModalConfirmationSubNotesComponent, {
                backdrop:'static',
                backdropClass:'customBackdrop', 
                centered: true 
            });
    
            modal.result.then((data) => {
                if (data) {
                    this._noteService.deleteSubnotes(companyNoteId).subscribe( (data: any) => {
                        this.ngOnInit();
                    }, (error)=>{
                        this._toastService.displayHTTPErrorToast( error.status, error.error.error );
                    });
                }
            }, (error) => {
                this._toastService.displayHTTPErrorToast( error.status, error.error.error );
            });
        }
    }

    editSubNoteTable(subNote:any){
        this.searchSubNotes(subNote);
    }
  
    isAdmin() {
        let value = this._authLocalService.getRoles() !== null
            ? this._authLocalService.getRoles().find((role) => role === 1 || role === 2 || role === 3 || role === 8 || role === 9) !== undefined
            : false;
    
        return value;
    }

}
