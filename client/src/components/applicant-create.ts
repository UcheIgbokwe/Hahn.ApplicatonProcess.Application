import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import { ApplicantAPI } from './../api/agent';
import {ApplicantCreated} from './messages';

interface Applicant {
  id: number;
  name: string;
  familyName: string;
  eMailAdress: string;
  address: string;
  countryOfOrigin: string;
  age: number;
  hired: boolean;
}

@inject(ApplicantAPI, EventAggregator)
export class ApplicantDetail {
  routeConfig;
  applicant: Applicant;
  originalApplicant: Applicant;

  constructor(private api: ApplicantAPI, private ea: EventAggregator) { }

  create(params) {

    return this.api.create(params).then(applicant => {
      this.applicant = <Applicant>applicant;
      this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
      this.ea.publish(new ApplicantCreated(this.applicant));
      this.refresh();
    });
  }

  canSave(params) {
    if (params === undefined) {
      console.log('params');
    }
    if (params !== undefined) {
      console.log('defined');
    }
    console.log(params);
    return params;
    //return this.applicant.name && this.applicant.familyName && this.applicant.address && this.applicant.age && this.applicant.countryOfOrigin && this.applicant.eMailAdress && !this.api.isRequesting;
  }

  refresh() {
    this.applicant = null;
    return this.applicant;
  }
  
}
  

  