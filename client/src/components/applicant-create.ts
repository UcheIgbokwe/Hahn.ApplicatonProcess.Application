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
      window.location.reload();
    });
  }

  canSave(params) {
    if (params === undefined) {
    }
    if (params !== undefined) {
      //return params
      if (params.name && params.familyName && params.address && params.age && params.countryOfOrigin && params.eMailAdress && !this.api.isRequesting) {
        console.log("It entered")
        return true;
      }
      

    }
  }

  canReset(params) {
    if (params === undefined) {
      return !this.api.isRequesting;
    }
  }

}
  

  