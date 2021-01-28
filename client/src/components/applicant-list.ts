import { ApplicantAPI } from './../api/agent';
import {inject} from 'aurelia-framework';
  
@inject(ApplicantAPI)
export class ApplicantList {
  applicants;
  selectedId = 0;

  constructor(private api: ApplicantAPI) { }

  created() {
    this.api.getApplicants().then(applicants => this.applicants = applicants);
  }

  select(applicant) {
    this.selectedId = applicant.id;
    return true;
  }
}
  

  