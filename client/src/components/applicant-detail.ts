import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import { ApplicantAPI } from './../api/agent';
import {ApplicantUpdated,ApplicantViewed} from './messages';
import {areEqual} from '../utility';

interface Applicant {
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

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    return this.api.getApplicant(params.id).then(applicant => {
      this.applicant = <Applicant>applicant;
      this.routeConfig.navModel.setTitle(this.applicant.name);
      this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
      this.ea.publish(new ApplicantViewed(this.applicant));
    });
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
  

  