import {inject} from 'aurelia-framework';
import { ApplicantAPI } from './../api/agent';
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

@inject(ApplicantAPI)
export class ApplicantDetail {
  routeConfig;
  applicant: Applicant;
  originalApplicant: Applicant;

  constructor(private api: ApplicantAPI) { }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    return this.api.getApplicant(params.id).then(applicant => {
      this.applicant = <Applicant>applicant;
      this.routeConfig.navModel.setTitle(this.applicant.name);
      this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
    });
  }

  canDeactivate() {
    if (!areEqual(this.originalApplicant, this.applicant)) {
      return confirm('You have unsaved changes. Are you sure you wish to leave?');
    }

    return true;
  }
}
  

  