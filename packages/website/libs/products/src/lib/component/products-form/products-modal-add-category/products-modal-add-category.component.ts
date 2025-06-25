import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryInterface } from '../../../../../../backend/src/lib/types/category.type';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryMessages } from '../../../../../../shared/src/lib/messages/category/category.message';

@Component({
  selector: 'easyroute-products-modal-add-category',
  templateUrl: './products-modal-add-category.component.html',
  styleUrls: ['./products-modal-add-category.component.scss']
})
export class ProductsModalAddCategoryComponent implements OnInit {

  categoryForm: FormGroup;
  category: CategoryInterface;
  category_messages: any;
  regiterSatisfactory: boolean;

  constructor(
    public activeModal: NgbActiveModal, 
    private fb: FormBuilder) { }

    ngOnInit() {

      this.category = new CategoryInterface();
      this.regiterSatisfactory = false;
      this.validaciones( this.category);
      
    }
  
    validaciones( measure : CategoryInterface ) {
  
      this.categoryForm = this.fb.group({
        name:[measure.name,[Validators.required]],
        isActive:[measure.isActive, [Validators.required]],
      });
  
      let category_messages = new CategoryMessages();
      this.category_messages = category_messages.getCategoryMessages();
  
    }
  
    changeActive() {
    
      if ( this.category.isActive == true ) {
    
        this.category.isActive = false;
    
        this.categoryForm.controls['isActive'].setValue( this.category.isActive );
    
      } else if ( this.category.isActive == false  ) {
    
        this.category.isActive = true;
    
        this.categoryForm.controls['isActive'].setValue( this.category.isActive );
    
      }
    
    }

}
