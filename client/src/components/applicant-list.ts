import {EventAggregator} from 'aurelia-event-aggregator';
import { ApplicantAPI } from './../api/agent';
import {ApplicantUpdated,ApplicantViewed} from './messages';
import {inject} from 'aurelia-framework';
  
@inject(ApplicantAPI, EventAggregator)
export class ApplicantList {
  applicants;
  selectedId = 0;

  constructor(private api: ApplicantAPI, ea: EventAggregator) { 
    ea.subscribe(ApplicantViewed, msg => this.select(msg.applicant));
    ea.subscribe(ApplicantUpdated, msg => {
      let id = msg.applicant.id;
      let found = this.applicants.find(x => x.id == id);
      Object.assign(found, msg.applicant);
    })
  }

  created() {
    this.api.getApplicants().then(applicants => this.applicants = applicants);
  }

  select(applicant) {
    this.selectedId = applicant.id;
    return true;
  }
}
  

  