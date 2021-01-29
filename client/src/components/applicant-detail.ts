import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import { ApplicantAPI } from './../api/agent';
import {ApplicantUpdated,ApplicantViewed} from './messages';
import {areEqual} from '../utility';

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
  newApplicant: Applicant;

  constructor(private api: ApplicantAPI, private ea: EventAggregator) { }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    return this.api.getApplicant(params.id).then(applicant => {
      this.applicant = <Applicant>applicant;
      this.routeConfig.navModel.setTitle(this.applicant.name);
      this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
      this.ea.publish(new ApplicantViewed(this.applicant));
    });
  }

  get canSave() {
    return this.applicant.name && this.applicant.familyName && this.applicant.address && this.applicant.age && this.applicant.countryOfOrigin && this.applicant.eMailAdress && !this.api.isRequesting;
  }

  get canUpdate() {
    return 
  }

  update(params) {
    if (!areEqual(params, this.originalApplicant)) {
      return this.api.update(params).then(newApplicant => {
        this.newApplicant = <Applicant>newApplicant;
        this.ea.publish(new ApplicantUpdated(this.newApplicant));
      });
      
    }else{
      
      console.log(`There are no new changes`)
    }
    
  }

  delete(params) {
    if (params !== undefined) {
      return this.api.delete(params.id).then(responseMessage => {
      });
      
    }else{
      console.log(`The fields are empty.`)
    }
    
  }

  canDeactivate() {
    if (!areEqual(this.originalApplicant, this.applicant)) {
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

      if (!result) {
        this.ea.publish(new ApplicantViewed(this.applicant));
      }
      return result;
    }

    return true;
  }
}
  

  