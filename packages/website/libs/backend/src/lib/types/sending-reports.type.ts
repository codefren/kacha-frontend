import { reportCompanyPreference } from "./sending-report-company-preferences.type";

export interface SendingReportInterface {
    description?: string;
    id?: number;
    reportCompanyId?:number;
    isActive?: boolean;
    name?: string;
    reportCompanyPreference:reportCompanyPreference;
  }

  export class SendingReportInterface  implements SendingReportInterface  {
	constructor(){
        this.id = 0,
        this.reportCompanyId = 0,
        this.isActive = false,
        this.name = '',
        this.description = '',
        this.reportCompanyPreference = new reportCompanyPreference()

	}
}