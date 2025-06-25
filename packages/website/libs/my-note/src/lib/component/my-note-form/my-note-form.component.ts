import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotesInterface, SubNotesInterface } from '@optimroute/backend';
import { MyNoteService } from '../../my-note.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService, NotesMessages, LoadingService } from '@optimroute/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedNoteComponent } from './shared-note/shared-note.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
declare var $: any;
import { MyNoteModalNewSubNotesComponent } from './my-note-modal-new-sub-notes/my-note-modal-new-sub-notes.component';
import { MyNoteModalConfirmationSubNotesComponent } from './my-note-modal-confirmation-sub-notes/my-note-modal-confirmation-sub-notes.component';

@Component({
  selector: 'lib-my-note-form',
  templateUrl: './my-note-form.component.html',
  styleUrls: ['./my-note-form.component.scss']
})
export class MyNoteFormComponent implements OnInit {
  
  noteForm: FormGroup;
  users : any;
  note_messages: any;
  notes = new NotesInterface ();

  NewSubnotes :string ='new';

  subNotesTable :any =[];

  subNotes: SubNotesInterface [] =[];

  loadingProfiles: string = 'success';
  loadingCompanyList: string = 'success';
  loadingCompanyProductUniquelist: string = 'success';

  salesmanSelected: any = [];

  constructor(private fb: FormBuilder,
              private _myNoteService: MyNoteService,
              private _translate : TranslateService,
              private _toastService: ToastService,
              private _router: Router,
              private _modalService: NgbModal,
              private loading: LoadingService,
              private noteService: MyNoteService,
              private _activatedRoute: ActivatedRoute,
              private detectChanges: ChangeDetectorRef  
            ) { }

  ngOnInit() {
    this.validaciones( this.notes);

    this._activatedRoute.params.subscribe( params => {
      if ( params['my_note_id'] !== 'new' ) {
        this.loading.showLoading();
        this._myNoteService.getNotes( params['my_note_id'] ).subscribe( (resp: any) => {
          this.notes = resp.data;
          this.subNotes =[];
          this.subNotes = resp.data.companySubNote;
          this.salesmanSelected = resp.data.companyNoteShare.map(x => {
            return {
              name: x.user.name,
              surname: x.user.surname,
              id: '' + x.userId
            }
          });
          this.loading.hideLoading();
          this.validaciones( this.notes);

        }, (error)=>{
          this.loading.hideLoading();
          this._toastService.displayHTTPErrorToast( error.status, error.error.error );
        }); 
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
  
    let note_messages = new NotesMessages();
    this.note_messages = note_messages.getNotesMessages();
  }

  createNote(){

    let dataform = _.cloneDeep(this.noteForm.value);

    let companySubNote = [];

    this.subNotes.forEach((element) => {
      companySubNote.push({
        title:element.title,
        description:element.description
      })
    });
  
    dataform.companySubNote = companySubNote;

    if (this.notes.id && this.notes.id > 0) {
      this._myNoteService.updateNote(this.notes.id, this.noteForm.value).subscribe( (data: any) => {
        this._toastService.displayWebsiteRelatedToast(
          this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
          this._translate.instant('GENERAL.ACCEPT')
        );
        this._router.navigate(['my-note']);
      }, (error)=>{
        this._toastService.displayHTTPErrorToast( error.status, error.error.error );
      });

    } else {
        if (this.salesmanSelected.length > 0) {
          this.noteForm.value.companyNoteShare = this.salesmanSelected.map((data) => {
            return {
              userId:data.id
            }
          });  
        }

        this._myNoteService.registerNote(dataform).subscribe( (data: any) => {
        
          this._toastService.displayWebsiteRelatedToast(
          
          this._translate.instant('GENERAL.REGISTRATION'),
          this._translate.instant('GENERAL.ACCEPT') 
        );
        this._router.navigate(['my-note']);
      }, (error)=>{
        
        this._toastService.displayHTTPErrorToast( error.status, error.error.error );
      }); 
    }
  }

  changeActive() {
    if ( this.notes.isActive == true ) {
  
      this.notes.isActive = false;
  
      this.noteForm.controls['isActive'].setValue( this.notes.isActive );
  
    } else if ( this.notes.isActive == false  ) {
  
      this.notes.isActive = true;
  
      this.noteForm.controls['isActive'].setValue( this.notes.isActive );
  
    }
  }
  
  changeIsDeleted() {
    if (  this.notes.isDeleted == true ) {
  
      this.notes.isDeleted = false;
  
      this.noteForm.controls['isDeleted'].setValue( this.notes.isDeleted);
  
    } else if ( this.notes.isDeleted == false  ) {
  
      this.notes.isDeleted = true;
  
      this.noteForm.controls['isDeleted'].setValue( this.notes.isDeleted);
  
    }
  }

  eliminated(id: number) {

    if (this.notes.id && this.notes.id > 0) {

      let companyNoteShare = this.salesmanSelected.filter(x => x.id === id).map(y => { 
        return {
          userId: y.id
        }
      });
  
      this.deleteFromNote(companyNoteShare, this.notes.id);  

    }
    

    this.salesmanSelected = this.salesmanSelected.filter(x => x.id !== id);
  }
  
  shareNote() {
    const modal = this._modalService.open(SharedNoteComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false

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
    this.loading.showLoading();
    this.noteService.deleteUserShareNote({companyNoteShare}, id).pipe(take(1)).subscribe((data) => {
      this.loading.hideLoading();
    });
  }


  searchSubNotes(subNote : any){

    const modal = this._modalService.open(MyNoteModalNewSubNotesComponent, {
      // size:'xl',
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
    this.noteService.updateSubNote(companySubNote.id, companySubNote).subscribe( (data: any) => {

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

    this.noteService.registerSubNote(companySubNote).subscribe( (data: any) => {

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

      const modal = this._modalService.open(MyNoteModalConfirmationSubNotesComponent, {
    
        backdrop:'static',
    
        backdropClass:'customBackdrop',  
    
      });
    
      modal.result.then((data) => {
    
          if (data) {
    
          this.noteService.deleteSubnotes(companyNoteId).subscribe( (data: any) => {
            
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

}
