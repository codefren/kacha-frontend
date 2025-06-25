import { Injectable } from '@angular/core';
import { BackendService } from '../../../backend/src/lib/backend.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateEasyrouteService {

  constructor(private backendService:BackendService) { }

  /* Category */
  getCategory(id : number){
    return this.backendService.get('category/'+ id);
  }
  registerByCompany( data: any){
    return this.backendService.post('category_store_by_company', data);
  }
  updateByCompany(id :number , data: any){
    return this.backendService.put('category_update_by_company/'+ id, data);
  }
  registerCategoryGeneral( data: any){
    return this.backendService.post('category', data);
  }
  updateCategoryGeneral(id :number , data: any){
    return this.backendService.put('category/'+ id, data);
  }
  updateActiveCategory(productId:number, ProductRequest: any){
    return this.backendService.put('company_product/active/'+ productId, ProductRequest);
  }
  /* activate vehicles dattables */
  updateActiveVehicle(vehicleId:number, data: any){
    return this.backendService.put('vehicle/active/'+ vehicleId, {isActive:data});
  }

  /* activate zone dattables */
  updateActiveZone(zoneId:any, data: any){
    return this.backendService.put('delivery_zone/active/'+ zoneId, {isActive:data});
  }
  //getStatusPromotion
  getStatusPromotion(){
    return this.backendService.get('promotion_status_special_list');
  }

  // getDeliveryPointPaymentTypeId
  getDeliveryPointPaymentId(){
    return this.backendService.get('delivery_point_payment_type');
  }
/* product */
  getProduct(id : number){
   return this.backendService.get('company_product/'+ id);
  }
  getProductAndCategory(id : number, categoryId: number){
    // return this.backendService.get('company_product/'+ id);
     if (id && !categoryId) {
       return this.backendService.get('company_product/'+ id);
     } else{
       return this.backendService.get(`company_product/${id}?categoryId=${ categoryId }`);
     }
   }
  getCategorys(){
    return this.backendService.get('category_list_general');
  }
  getCategorysByCopmpany(){
    return this.backendService.get('category_list_company');
  }
  getSubCategoryFilter(resource: any){
    return this.backendService.get(resource);
  }

  /* Manage Zone */
  getZone(){
    return this.backendService.get('zone');
  }
  getZoneManage(id : number){
    return this.backendService.get('zone/'+ id);
  }
  addZoneManage(zone : any){
    return this.backendService.post('zone',zone);
  }
  editZoneManage(zoneId:number, zoneRequest: any){
    return this.backendService.put('zone/'+ zoneId, zoneRequest);
  }
  addCompanyZone(zoneId: number ,zone : any){
    return this.backendService.post('company_zone/zone/'+ zoneId, { franchises: zone });
  }
  destroyCompanyZone(zoneID: number){
    return this.backendService.delete('company_zone/'+ zoneID);
  }

  addZoneImagen(zoneImage : any, zoneId: number ,){
    return this.backendService.post('zone_image',  zoneImage );
  }

  destroyImagenZone(zoneID: number){
    return this.backendService.delete('zone_image/'+ zoneID);
  }

  getZoneDeliveryScheduleList(zoneId:number){
    return this.backendService.get('zone_delivery_schedule_list/'+ zoneId);
  }
  getCompanyZoneList(zoneId:number){
    return this.backendService.get('company_zone_list/'+ zoneId);
  }
  addZoneDeliverySchedule(zoneSchedule : any){
    return this.backendService.post('zone_delivery_schedule',  zoneSchedule );
  }
  editZoneDeliverySchedule(zoneId:number, zoneRequest: any){
    return this.backendService.put('zone_delivery_schedule/'+ zoneId, zoneRequest);
  }
  destroyZoneDeliverySchedule(zoneID: number){
    return this.backendService.delete('zone_delivery_schedule/'+ zoneID);
  }
  destroyZoneDeliveryScheduleLogict(zoneID: number){
    return this.backendService.delete('zone_delivery_schedule/delete/'+ zoneID);
  }
  getZoneAutocompleteCode(){
    return this.backendService.get('zone_autocomplete_code');
  }
  addZoneDelivery(zoneDelivery: any){
    return this.backendService.post('zone_delivery',  zoneDelivery );
  }
  getZoneDeliveryList(zoneId: number){
    return this.backendService.get('zone_delivery_list/'+ zoneId);
  }
  editZoneDeliveryList(zoneId: number, zoneDeliveryRequest){
    return this.backendService.put('zone_delivery/'+ zoneId, zoneDeliveryRequest);
  }

  addRidersZone( zoneId: number, riders: any,){
    return this.backendService.post('zone_rider/zone/' + zoneId,  {riders:riders} );
  }
  destroyRidersTable(zoneID: number){
    return this.backendService.delete('zone_rider/'+ zoneID);
  }


  /* End Manage Zone */

  getCategorysCopmpanyGeneral(){
    return this.backendService.get('category_list_general');
  }

  getSubcategory( id: number ) {
    return this.backendService.get(`sub_category?categoryId=${ id }`);
  }
  getFilterSubcategory( categoryId: number, subCategoryId: number ) {
    return this.backendService.get(`filter?categoryId=${categoryId}&subCategoryId=${subCategoryId}`);
  }

  editProducty(productId:number, ProductRequest: any){
    return this.backendService.put('company_product/'+ productId, ProductRequest);
  }
  addProduct(product: any){
    return this.backendService.post('company_product', product);
  }
  createProductImage(data: any){
    return this.backendService.post('company_product_image', data);

  }

  updateProductImage( data: any, id ) {
    return this.backendService.put('company_product_image/' + id, data);
  }

  updateProductImageMain( data: any, id ) {
    return this.backendService.put('company_product_image_main/' + id, data);
  }

  destroyProductImage(productImageId: number){
    return this.backendService.delete('company_product_image/'+ productImageId);
  }
  registerProductPrice( data: any){
    return this.backendService.post('company_product_price', data);
  }
  destroyProductPrice(productPriceId: number){
    return this.backendService.delete('company_product_price/'+ productPriceId);
  }
  updateProductPrice(id : number, data : any) {
    return this.backendService.put('company_product_price/'+ id, data);
  }

  updateProductMain(id : number, data : any) {
    return this.backendService.put('company_product_price_main/'+ id, data);
  }

  /* orders */
  getOrders(id : number){
    return this.backendService.get('order/'+ id);
  }

  getOrdersDetailTime(id : number){
    return this.backendService.get('order_detail_time/'+ id);
  }
  getOrdersProductDeleteList(id : number){
    return this.backendService.get('order_product_delete_list/'+ id);
  }



  getNetxStatusOrder(id: number) {
    return this.backendService.get('order/' + id + '/status_order_next');
  }

  changeStatus(id: number, idStatus: number) {
    return this.backendService.put('order/' + id + '/update_status_order', {
      statusOrderId: idStatus
    });
  }

  changeStatusGlobal(statusOrderIdFrom: number, statusOrderIdTo: number) {
    return this.backendService.post('order_status_change_multilple', {
      statusOrderIdFrom,
      statusOrderIdTo 
    })
  }

  sendOrdersFtp() {
    return this.backendService.get('orders_ftp'); 
  }

  getStatusNext(id: number) {
    return this.backendService.get('status_next/' + id);
  }

  getAgentuser(userSalesmanId: number){
    return this.backendService.get('users_salesman?userSalesmanId=' + userSalesmanId);
  }

  getAllagentuser(){
    return this.backendService.get('users_all_salesman');
  }

  getDrivers() {
    return this.backendService.get('users_collector');
  }

  getDriversFranchise() {
    return this.backendService.get('users_child_collector');
  }

  getStatus(){
    return this.backendService.get('status_order');
  }
  getCompanyCLientProductPrice(clientid : string, productId: number , MeasureId: number){
    return this.backendService.get('company_client_product_price/client/'+ clientid + '/product/' + productId + '/measure/' + MeasureId);
  }
  registerProducts( data: any){
    return this.backendService.post('order_product', data);
  }
  deleteproducts(orderId :number){
    return this.backendService.delete('order_product/'+ orderId);
  }
  updateOrdersProducts(id : number, data : any) {
    return this.backendService.put('order_product/'+ id, data);
  }
  updateOrders(id :number , data: any){
    return this.backendService.put('order/'+ id, data);
  }
  registerOrders( data: any){
    return this.backendService.post('order', data);
  }
  async getPdfOrder(id: number ){
    await this.backendService.getPDF('order/reports/order_pdf?orderId=' + id)
  }
  getClient(){
    return this.backendService.get('company_client');
  }
  //INFORMATIVE ORDERSUMARRY
  getInformativeOrderSummary( data: any){
    return this.backendService.post('order/informative_order_summary', data);
  }
  
  //Informative Client summary
  getInformativeClientSummary(){
    return this.backendService.post('delivery_point_boxes_informative');
  }

  //get INFORMATIVE PROMOTION
  getDataPromocionalInformation(statePromotionId: any){
    return this.backendService.get('data_promotional_information?statePromotionId=' + statePromotionId);
  }
  //devolution resument
  getInformativeDevolution( data: any){
    return this.backendService.post('route_planning/data_devolution', data);
  }

  // BILLS RESUMENT
  getInformativeBills( data: any){
    return this.backendService.post('company_bill_totalized', data);
  }


  //data vehículo resument
  getInformativeVehicule(filter:any){
    return this.backendService.post('vehicle_informative_data', filter);
  }

  /* orders-list-print-orders */
  async getPdfOrderPrint(resounce: any ){
    await this.backendService.getPDF(resounce);
  }
  /* my-orders */
  updateMyOrders(id :number , data: any){
    return this.backendService.put('order/'+ id, data);
  }
  registerMyOrders( data: any){
    return this.backendService.post('order_store_my_order', data);
  }
  /* miwigo-unlikend */
  getUser(id:number){
    return this.backendService.get('users/' + id );
  }
  updateLinked(userId:number, data: any ){
    return this.backendService.post('user/'+ userId + '/update_linked', data);
  }
  deleteLinked(userId:number ){
    return this.backendService.delete('user/'+ userId+ '/delete_linked');
  }

  updatePasswordUser(userId:number, data: any ){
    return this.backendService.put('users_linked_change_password/' + userId ,data);
  }

  //
  deliveryPointLinkList(data: any ){
    return this.backendService.post('delivery_point_link_list', {nif:data});
  }
  createDeliveryPonintLinked(userId:number ){
    return this.backendService.post('user/'+ userId + '/create_delivery_point_link');
  }

  // summary-orders
  getFranchiseList() {
    return this.backendService.get('company_franchise_list');
  }


  // update franchise
  getFranchise(id :number ){
    return this.backendService.get('company_franchise/'+ id);
  }

  // update franchise
  updateFranchise(id :number , data: any){
    return this.backendService.put('company_franchise/'+ id, data);
  }

  createFranchise( data: any ) {
    return this.backendService.post( 'company_franchise',  data );
  }
  //
  updateCompanyImage(data: any, companyImageId: number){
    return this.backendService.put('company_image/'+companyImageId, data);
  }
  //createCompanyImage
  createCompanyImage(data: any){
    return this.backendService.post('company_image', data);
  }

  deleteCompanyImage( id: number ) {
    return this.backendService.delete( 'company_image/' + id );
  }

  //create delivery schedule
  createServiceDeliveryschedule(data: any){
    return this.backendService.post( 'franchise',  data );
  }

  updateDeliveryschedule(PreferenceDeliveryScheduleId: number, data: any ){
    return this.backendService.put( 'franchise/' +PreferenceDeliveryScheduleId,  data );
  }
  deletePreferenceSchedule(idSchedule){
    return this.backendService.delete( `franchise/${ idSchedule }` );
}

  // createCompanyIMage
  createCompanyCategoryImage(data: any){
    return this.backendService.post('category_image', data);
  }
  updateCompanyCategoryImage(categoryId: number ,data: any){
    return this.backendService.put('category_image/' +categoryId, data);
  }

  //subcategoy
  getSubcategoryIndex(id: number){
    return this.backendService.get('sub_category/' +id);
  }
  updateSubCategory(id :number, data: any){
    return this.backendService.put('sub_category/'+ id, data);
  }
  registerSubCategory( data: any){
    return this.backendService.post('sub_category', data);
  }
  deleteSubCategory(subCategoryId:number ){
    return this.backendService.delete('sub_category/'+ subCategoryId);
  }
  deleteFilter(filterId:number ){
    return this.backendService.delete('filter/'+ filterId);
  }

  //FIlter

  getFilter(id :number){
    return this.backendService.get('filter/'+ id);
  }

  updateFilterSubCategory(id :number, data: any){
    return this.backendService.put('filter/'+ id, data);
  }
  updateDeliveryRates( data: any){
    return this.backendService.put('filter/', data);
  }
  registerFilterSubCategory( data: any){
    return this.backendService.post('filter', data);
  }
  deleteFilterSubCategory(subCategoryId:number ){
    return this.backendService.delete('filter/'+ subCategoryId);
  }
  
  //company associated
  updateCompanyAssociated(id :number, data: any){
    return this.backendService.put('company_associated/'+ id, data);
  }

  changeFavorite( id: number, data: { favorite: boolean } ) {
    return this.backendService.put(`integration_favorite/${ id }`, data );
  }

  //notificacion details
   // update franchise
   getNotification(id :number ){
    return this.backendService.get('company_notification/'+ id);
  }

  //novelty
   getnovelty(id : number){
    return this.backendService.get('novelty/'+ id);
  }

  updateNovelty(id: number, data: any) {
    return this.backendService.put('novelty/' + id , data);
  }

  createNovelty(data: any) {
    return this.backendService.post('novelty', data );
  }

  //partners

  getPartners(id : number){
    return this.backendService.get('partners/'+ id);
  }

  updatePartners(id: number, data: any) {
    return this.backendService.put('partners/' + id , data);
  }

  createTartners(data: any) {
    return this.backendService.post('partners', data );
  }

  // incident
  getIncidentAutocompleteCode(companyId:number){
    return this.backendService.get('autocomplete_code/company/' + companyId);
  }

  getAdminResumen(){
    return this.backendService.get('admin_subscription_resume');
  }

  getIncident(id : number){
    return this.backendService.get('company_incident/'+ id);
  }
  getRequestFrom(){
    return this.backendService.get('contact_type');
  }

  updateIncident(id: number, data: any) {
    return this.backendService.put('company_incident/' + id , data);
  }

  createIncident(data:any){
    return this.backendService.post('company_incident', data );
  }
 
  deleteImgIncident(incidentImageId:number){

    return this.backendService.delete('company_incident_image/'+ incidentImageId);
  }
  UpdateImgIncident(data:any, id:number){

    return this.backendService.put('company_incident_image/' + id, data);
  }
  createIncidentImg(data:any){
    return this.backendService.post('company_incident_image', data);
  }

  //invoice company
  getInvoiceCompany(){
    return this.backendService.get('company_parents_admin');
  }
  getdatatable(data: any){
    return data = 'list_admin_invoices',data;
  }

  // Vehicles service type

  getVehiclesServiceTypeAutoCompleteCode(){
    return this.backendService.get('vehicle_service_autocomplete_code');
  }

  //Get promotion code
  getPromotionTypeAutoCompleteCode(){
    return this.backendService.get('company_product_autocomplete_code');
  }

  getVehiclesServiceType(id: number){
    return this.backendService.get('company_vehicle_service_type/' + id);
  }


  createVehiclesServiceType(data:any){

    return this.backendService.post('company_vehicle_service_type', data);
  }

  UpdateVehiclesServiceType(id:number, data:any){

    return this.backendService.put('company_vehicle_service_type/' + id, data);
  }

  deleteVehiclesServiceType( id: number ) {
    return this.backendService.delete('company_vehicle_service_type/'+id);
  }

  //
  getVehiclesCompanyVehicleTypeService(id: number){
    return this.backendService.get('company_vehicle_type/' + id);
  }
    //company_vehicle_type
    createVehiclesCompanyVehicleTypeServiceType(data:any){

      return this.backendService.post('company_vehicle_type', data);
    }

    updateVehiclesCompanyVehicleTypeServiceType(id:number, data:any){

      return this.backendService.put('company_vehicle_type/' + id, data);
    }
  
    //update datatable vehiclestype
    UpdateVehiclesType(id:number, data:any){

      return this.backendService.put('company_vehicle_type/active/' + id, data);
    }

    //DELETE
    deleteVehiclesType( id: number ) {
      return this.backendService.delete('company_vehicle_type/'+id);
    }

  // Delivery zone specification


  getDeliveryZoneSpecificationTypeAutoCompleteCode(){
    return this.backendService.get('delivery_zone_specification_autocomplete_code');
  }

  getDeliveryZoneSpecificationType(id: number){
    return this.backendService.get('delivery_zone_specification_type/' + id);
  }


  createDeliveryZoneSpecificationType(data:any){

    return this.backendService.post('delivery_zone_specification_type', data);
  }

  UpdateDeliveryZoneSpecificationType(id:number, data:any){

    return this.backendService.put('delivery_zone_specification_type/' + id, data);
  }

  //cliente service type shedule
  getClientServiceTypeShedule(id: number){
    return this.backendService.get('company_time_zone/' + id);
  }
  createClientServiceTypeShedule(data:any){

    return this.backendService.post('company_time_zone', data);
  }
  UpdateClientServiceTypeShedule(id:number, data:any){

    return this.backendService.put('company_time_zone/' + id, data);
  }

  // cliente imagenes

    //Actualizar
    updateCompanyImageClient(data: any, companyImageId: number){
      return this.backendService.put('delivery_point_image/'+companyImageId, data);
    }
    //createCompanyImage
    createCompanyImageClient(data: any){
      return this.backendService.post('delivery_point_image', data);
    }
    //Eliminar
    deleteCompanyImageClient( id: number ) {
      return this.backendService.delete('delivery_point_image/'+id);
    }
    //Obtener
    getCompanyImagenClient(id: any){
      return this.backendService.get('delivery_point_image?deliveryPointId=' + id);
    }
  

  getClientServiceTypeAutoCompleteCode(){
    return this.backendService.get('company_time_zone_autocomplete_code');
  }

  // summary
  getMultiStoreOrderTotalSummary(url: any){
    return this.backendService.get(url);
  }
  getMultistoreOrderStatusList(){
    return this.backendService.get('multistore_order_status_list');
  } 
  //Vehicle maintenace
  getVehcileMaintenance(id: number){
    return this.backendService.get('maintenance/' +id);
  }

  //Update Status maintenance

  updateStatusMaintenance(id: number ,data: any){
    return this.backendService.put('maintenance/'+ id, data);
  }

  //for Vehicles maintence
  getMaintenanceDataFormReview(){
    return this.backendService.get('maintenance_data_form_review');
  }

  /// get maintenance_preference_review
  getMaintenancePreferenceReview(){
    return this.backendService.get('maintenance_preference_review');
  }

  /* driver */
  getDriver(userDriverId: number){
    return this.backendService.get('drivers?userDriverId=' + userDriverId);
  }

  getUserByCompany(){
    return this.backendService.get('user_list_by_company');
  }

  /* TYPE Update Clientes */
  getDeliveryPointUpdateType(){
    return this.backendService.get('delivery_point_update_type');
  }

  getDriverListCost(userDriverId: number){
    return this.backendService.get('drivers_list_cost?userDriverId=' + userDriverId);
  }

  /* user dock */
  getUserDock(){
    return this.backendService.get('users_dock');
  }

  getAllDriver(){
    return this.backendService.get('all_drivers');
  }

  getMaintenanceVehicleStateType(){
    return this.backendService.get('maintenance_vehicle_state_type');
  }

  getMaintenanceInformatice(data: any){
    return this.backendService.post('maintenance_informative_data', data);
  }

  getMaintenanceStatus(){
    return this.backendService.get('maintenance_status');
  }

  /* status driver */
  getStatusDriver(){
    return this.backendService.get('vehicle_status');
  }

  /* vehicle */
  getVehicle(){
    return this.backendService.get('vehicle');
  }

  /* Bills */
  getDeliveryPoint(){
    return this.backendService.get('delivery_point');
  }

  getBillPaymentStatus(){
    return this.backendService.get('bill_payment_status');
  }

  getBillPaymentType(){
    return this.backendService.get('bill_payment_type');
  }

  getBillChargeType(){
    return this.backendService.get('bill_charge_type');
  }

  getBill(id: number){
    return this.backendService.get('company_bill/' +id);
  }
  
  //descargar todos los pedidos de una ruta
  async getPdfRouteAssigneProduct(data:any ){
    await this.backendService.getPDFRouteAssigne('route_planning/route/print_deliveries_with_order', data)
  }

  async getPdfDEvolution(data:any){
    await this.backendService.getPDFDevolution('route_planning/print_devolution', data);
  }

  //DElivery zone
  getDeliveryZone(id: number){
    return this.backendService.get('delivery_zone/' + id);
  }

    
  /* Provider */
  getGroupTotalProviders(){
    return this.backendService.get('providers_total_grouped');
  }

  getAssigned(){
    return this.backendService.get('provider_assigment_type_active_list');
  }

  getProviderType(){
    return this.backendService.get('provider_type_active_list');
  }

  getProviders(id : number){
    return this.backendService.get('providers/'+ id);
  }

  addProvider(provider: any){
    return this.backendService.post('providers', provider);
  }

  editProvider(providerId:number, ProviderRequest: any){
    return this.backendService.put('providers/'+ providerId, ProviderRequest);
  }

}
