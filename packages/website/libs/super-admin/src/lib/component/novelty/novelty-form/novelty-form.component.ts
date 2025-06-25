import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Novelty } from '../../../../../../backend/src/lib/types/novelty.type';
import { NoveltyMessages } from '../../../../../../shared/src/lib/messages/novelty/novelty.message';
import { StateEasyrouteService } from '../../../../../../state-easyroute/src/lib/state-easyroute.service';
import { ToastService } from '../../../../../../shared/src/lib/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'easyroute-novelty-form',
  templateUrl: './novelty-form.component.html',
  styleUrls: ['./novelty-form.component.scss']
})
export class NoveltyFormComponent implements OnInit {

  noveltyForm: FormGroup;
  novelty: Novelty;
  noveltyMessages: any;
  constructor(
    private Router: Router,
    private fb: FormBuilder,
    private _toastService: ToastService,
    private _translate: TranslateService,
    private _activatedRoute: ActivatedRoute,
    private stateEasyrouteService: StateEasyrouteService,
  ) { }

  ngOnInit() {
    this.load();
  }
  load() {
    this._activatedRoute.params.subscribe((params) => {
        if (params['id'] !== 'new') {
            this.stateEasyrouteService.getnovelty(params['id']).subscribe(
                (resp: any) => {
                    this.novelty = resp.data;

                    console.log(this.novelty, 'this.novelty');
                  //  this.changeDetect.detectChanges();

                
                    this.validaciones( this.novelty);
                },
                (error) => {
                    this._toastService.displayHTTPErrorToast(
                        error.status,
                        error.error.error,
                    );
                },
            );
        } else {
            
  
            this.novelty = new Novelty();

            this.validaciones(this.novelty);
        }
    });
}

validaciones(novel: Novelty) {

  this.noveltyForm = this.fb.group({
    title: [novel.title, [ Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    descripcion: [novel.descripcion, [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
    url: [novel.url, [ Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
    
  });
  
  let noveltyMessages = new NoveltyMessages();

  this.noveltyMessages = noveltyMessages.getNoveltyMessages();


}

createNovelty() {

  if (
      this.noveltyForm.invalid
  ) {
      this._toastService.displayHTTPErrorToast('Aviso;', 'El usuario no es valido');
  } else {
      if (this.novelty.id && this.novelty.id > 0) {
          this.stateEasyrouteService.updateNovelty(this.novelty.id, this.noveltyForm.value).subscribe(
              (data: any) => {
                  this._toastService.displayWebsiteRelatedToast(
                      this._translate.instant('GENERAL.UPDATE_SUCCESSFUL'),
                      this._translate.instant('GENERAL.ACCEPT'),
                  );

                  this.Router.navigate(['super-admin/novelty']);
              },
              (error) => {
                  this._toastService.displayHTTPErrorToast(
                      error.status,
                      error.error.error,
                  );
              },
          );
      } else {
          this.stateEasyrouteService.createNovelty(this.noveltyForm.value).subscribe(
              (data: any) => {
                  this._toastService.displayWebsiteRelatedToast(
                      this._translate.instant('GENERAL.REGISTRATION'),
                      this._translate.instant('GENERAL.ACCEPT'),
                  );

                  this.Router.navigate(['super-admin/novelty']);
              },
              (error) => {
                  this._toastService.displayHTTPErrorToast(
                      error.status,
                      error.error.error,
                  );
              },
          );
      }
  }
}


}
