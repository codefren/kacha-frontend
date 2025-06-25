import { ModalPromotionImgInfoComponent } from './components/modal-promotion-img-info/modal-promotion-img-info.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
/* import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client'; */
import { TranslateModule } from '@ngx-translate/core';
import { CustomFormsModule } from 'ngx-custom-validators';
import { EditableFieldModule } from './components/editable-field/editable-field.module';
import { FilterInputComponent } from './components/filter-input/filter-input.component';
import { HelpTooltipComponent } from './components/help-tooltip/help-tooltip.component';
import { InfoChipComponent } from './components/info-chip/info-chip.component';
import { MenuComponent } from './components/menu/menu.component';
import { MockComponent } from './components/mock-component/mock/mock.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PanelComponent } from './components/panel/panel.component';
import { RoutePrintTemplateComponent } from './components/route-print-template/route-print-template.component';
import { SideMenuModule } from './components/side-menu/side-menu.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ButtonIconDirective } from './directives/button-icon/button-icon.directive';
import { ColorFilterDirective } from './directives/color-filter/color-filter.directive';
import { ImageFilterDirective } from './directives/image-filter/image-filter.directive';
import { OnlyNumberDirective } from './directives/only-number/only-number.directive';
import { ProgressSpinnerPercentageDirective } from './directives/progress-spinner-percentage/progress-spinner-percentage.directive';
import { CustomMaterialModule } from './material.module';
import { DistancePipe } from './pipes/distance.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { TimesPipe } from './pipes/times.pipe';
import { ToDayTimePipe } from './pipes/to-day-time.pipe';
import { ToastService } from './services/toast.service';

import { CustomDateAdapter } from './adapters/custom-date-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { LoadingService } from './services/loading.service';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { DebounceClickDirective } from './directives/debounce-click/debounce-click.directive';
import { ModalModulesComponent } from './components/modal-modules/modal-modules.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { ModalCategoryActivateComponent } from './components/modal-category-activate/modal-category-activate.component';
import { AsignProductsFranchiseComponent } from './components/asign-products-franchise/asign-products-franchise.component';
import { ImageViewsComponent } from './components/image-views/image-views.component';
import { ModalLogOutComponent } from './components/modal-log-out/modal-log-out.component';
import { ImageViewComponent } from './components/image-view/image-view.component';
import { ModalWarningComponent } from './components/modal-warning/modal-warning.component';
import { DetailComponent } from './components/detail/detail.component';
import { ModalDeliveryRatesComponent } from './components/modal-delivery-rates/modal-delivery-rates.component';
import { DeliveryModalConfirmationComponent } from './components/delivery-modal-confirmation/delivery-modal-confirmation.component';
import { DetailPageComponent } from './components/detail-page/detail-page.component';
import { ProductModalImgInfoComponent } from './components/product-modal-img-info/product-modal-img-info.component';
import { ModalContactUsComponent } from './components/modal-contact-us/modal-contact-us.component';
import { ModalConfirmDocumentComponent } from './components/modal-confirm-document/modal-confirm-document.component';
import { ModalDocumentComponent } from './components/modal-document/modal-document.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModaSendNotificationComponent } from './components/moda-send-notification/moda-send-notification.component';
import { TicketModalComponent } from './components/ticket-modal/ticket-modal.component';
import { ImageViewDeliveryPointComponent } from './components/image-view-delivery-point/image-view-delivery-point.component';
import { ExpandImageComponent } from './components/expand-image/expand-image.component';
import { ModalViewPdfGeneralComponent } from './components/modal-view-pdf-general/modal-view-pdf-general.component';
import { ModalMyProfileComponent } from './components/modal-my-profile/modal-my-profile.component';
import { NgxMaskModule } from 'ngx-mask';
import { ModalCostDeleteComponent } from './components/modal-cost-delete/modal-cost-delete.component';
import { ModalCheckCostComponent } from './components/modal-check-cost/modal-check-cost.component';
import { ModalGeneralWarningComponent } from './components/modal-general-warning/modal-general-warning.component';
import { ModalConfirmNewComponent } from './components/modal-confirm-new/modal-confirm-new.component';
import { ModalViewPdfBillsGeneralComponent } from './components/modal-view-pdf-bills-general/modal-view-pdf-bills-general.component';
import { ModalGeneralDownloadComponent } from './components/modal-general-download/modal-general-download.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { RoutePrintTemplateSimpleComponent } from './components/route-print-template-simple/route-print-template-simple.component';
import { ModalApplySalaryCostComponent } from './components/modal-apply-salary-cost/modal-apply-salary-cost.component';
import { ModalApplyRentingCostComponent } from './components/modal-apply-renting-cost/modal-apply-renting-cost.component';
import { ModalAttachTicketComponent } from './components/modal-attach-ticket/modal-attach-ticket.component';
import { ModalGeneralDiscardComponent } from './components/modal-general-discard/modal-general-discard.component';
import { ModalGeneralMergeRecordComponent } from './components/modal-general-merge-record/modal-general-merge-record.component';
import { ModalOpenClientsComponent } from './components/modal-open-clients/modal-open-clients.component';
import { ModalActivateComponent } from './components/modal-activate/modal-activate.component';
import { ModalDeleteComponent } from './components/modal-delete/modal-delete.component';


@NgModule({
    declarations: [
        FilterInputComponent,
        InfoChipComponent,
        MenuComponent,
        PanelComponent,
        SidenavComponent,
        ToolbarComponent,
        MockComponent,
        RoutePrintTemplateComponent,
        RoutePrintTemplateSimpleComponent,
        ProgressSpinnerPercentageDirective,
        OnlyNumberDirective,
        ButtonIconDirective,
        ColorFilterDirective,
        ImageFilterDirective,
        ToDayTimePipe,
        TimesPipe,
        DistancePipe,
        DurationPipe,
        OrderByPipe,
        PageNotFoundComponent,
        HelpTooltipComponent,
        ConfirmModalComponent,
        DebounceClickDirective,
        ModalModulesComponent,
        ModalCategoryActivateComponent,
        AutocompleteComponent,
        AsignProductsFranchiseComponent,
        ErrorDialogComponent,
        ImageViewsComponent,
        ModalLogOutComponent,
        ImageViewComponent,
        ImageViewDeliveryPointComponent,
        ModalWarningComponent,
        DetailComponent, // modal de detalle de ruta
        ModalDeliveryRatesComponent,
        DeliveryModalConfirmationComponent,
        DetailPageComponent,
        ProductModalImgInfoComponent,
        ModalPromotionImgInfoComponent,
        ModalContactUsComponent,
        ModalConfirmDocumentComponent,
        ModalDocumentComponent,
        ModaSendNotificationComponent,
        TicketModalComponent,
        ExpandImageComponent,
        ModalViewPdfGeneralComponent,
        ModalMyProfileComponent,
        ModalCheckCostComponent,
        ModalCostDeleteComponent,
        ModalGeneralWarningComponent,
        ModalConfirmNewComponent,
        ModalViewPdfBillsGeneralComponent,
        ModalGeneralDownloadComponent,
        ModalApplySalaryCostComponent,
        ModalApplyRentingCostComponent,
        ModalAttachTicketComponent,
        ModalGeneralDiscardComponent,
        ModalGeneralMergeRecordComponent,
        ModalOpenClientsComponent,
        ModalActivateComponent,
        ModalDeleteComponent
    ],
    entryComponents: [
        RoutePrintTemplateComponent,
        RoutePrintTemplateSimpleComponent,
        ConfirmModalComponent,
        ConfirmModalComponent,
        ErrorDialogComponent,
        //ModalCategoryActivateComponent,
        AsignProductsFranchiseComponent,
        ImageViewsComponent,
        ModalCategoryActivateComponent,
        ModalLogOutComponent,
        ImageViewComponent,
        ImageViewDeliveryPointComponent,
        ModalWarningComponent,
        DetailComponent, // modal de detalle de ruta
        ModalDeliveryRatesComponent,
        DeliveryModalConfirmationComponent,
        DetailPageComponent,  // detalle de la orden
        ProductModalImgInfoComponent,
        ModalPromotionImgInfoComponent,
        ModalContactUsComponent,
        ModalConfirmDocumentComponent,
        ModalDocumentComponent,
        ModaSendNotificationComponent,
        TicketModalComponent,
        ExpandImageComponent,
        ModalViewPdfGeneralComponent,
        ModalMyProfileComponent,
        ModalCheckCostComponent,
        ModalCostDeleteComponent,
        ModalGeneralWarningComponent,
        ModalConfirmNewComponent,
        ModalViewPdfBillsGeneralComponent,
        ModalGeneralDownloadComponent,
        ModalApplySalaryCostComponent,
        ModalApplyRentingCostComponent,
        ModalAttachTicketComponent,
        ModalGeneralDiscardComponent,
        ModalGeneralMergeRecordComponent,
        ModalOpenClientsComponent,
        ModalActivateComponent,
        ModalDeleteComponent
    ],
    imports: [
        CustomMaterialModule,
        SideMenuModule,
        EditableFieldModule,
        FlexLayoutModule,
        FormsModule,
        CustomFormsModule,
        ReactiveFormsModule,
        NgbModule,
        CommonModule,
        RouterModule,
        DragDropModule,
        NgxMaskModule.forChild(),
        TranslateModule.forChild()
    ],
    exports: [
        CustomMaterialModule,
        FlexLayoutModule,
        EditableFieldModule,
        SideMenuModule,
        FormsModule,
        FilterInputComponent,
        InfoChipComponent,
        MenuComponent,
        PanelComponent,
        SidenavComponent,
        ToolbarComponent,
        RouterModule,
        MockComponent,
        RoutePrintTemplateComponent,
        RoutePrintTemplateSimpleComponent,
        ProgressSpinnerPercentageDirective,
        OnlyNumberDirective,
        ButtonIconDirective,
        ColorFilterDirective,
        ImageFilterDirective,
        DebounceClickDirective,
        ToDayTimePipe,
        CustomFormsModule,
        ReactiveFormsModule,
        CommonModule,
        TimesPipe,
        DistancePipe,
        DurationPipe,
        OrderByPipe,
        PageNotFoundComponent,
        DragDropModule,
        TranslateModule,
        HelpTooltipComponent,
        ConfirmModalComponent,
        AutocompleteComponent,
        ErrorDialogComponent,
        ModalCategoryActivateComponent,
        AsignProductsFranchiseComponent,
        ImageViewsComponent,
        ModalLogOutComponent,
        ImageViewComponent,
        ImageViewDeliveryPointComponent,
        ModalWarningComponent,
        DetailComponent,
        ModalDeliveryRatesComponent,// modal de detalle de ruta
        DeliveryModalConfirmationComponent,
        DetailPageComponent,
        ProductModalImgInfoComponent,
        ModalPromotionImgInfoComponent,
        ModalContactUsComponent,
        ModalConfirmDocumentComponent,
        ModalDocumentComponent,
        ModaSendNotificationComponent,
        TicketModalComponent,
        ExpandImageComponent,
        ModalViewPdfGeneralComponent,
        ModalMyProfileComponent,
        ModalCheckCostComponent,
        ModalCostDeleteComponent,
        ModalGeneralWarningComponent,
        ModalConfirmNewComponent,
        ModalViewPdfBillsGeneralComponent,
        ModalGeneralDownloadComponent,
        ModalApplySalaryCostComponent,
        ModalApplyRentingCostComponent,
        ModalAttachTicketComponent,
        ModalGeneralDiscardComponent,
        ModalGeneralMergeRecordComponent,
        ModalOpenClientsComponent,
        ModalActivateComponent,
        ModalDeleteComponent
    ],
    providers: [
        { provide: DateAdapter, useClass: CustomDateAdapter },
        ToastService,
        LoadingService,
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    ],
})
export class SharedModule { }
