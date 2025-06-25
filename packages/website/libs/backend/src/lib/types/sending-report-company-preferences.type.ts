export interface reportCompanyPreference {
    id: number,
    companyId: number,
    reportCompanyId: number,
    reportBlokId: string,
    hourTime: number,
    scheduleShipping: string,
    scheduledDay: string,
    isActive: boolean,
    report_company_preference_email:[]
  }

  export class reportCompanyPreference  implements reportCompanyPreference  {
	constructor(){
        this.id = 0,
        this.companyId = 0,
        this.reportCompanyId = 0,
        this.reportBlokId = '',
        this.hourTime = 0,
        this.scheduleShipping = '',
        this.scheduledDay = '',
        this.isActive = false,
        this.report_company_preference_email =[];
	}
}