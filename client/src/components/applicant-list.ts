import {EventAggregator} from 'aurelia-event-aggregator';
import * as toastr from 'toastr';
import { ApplicantAPI } from './../api/agent';
import {ApplicantUpdated,ApplicantViewed} from './messages';
import {observable} from 'aurelia-framework';
import {autoinject} from 'aurelia-dependency-injection';
import {I18N} from 'aurelia-i18n';
  
@autoinject
export class ApplicantList {
  applicants;
  selectedId = 0;
  public locales: { key: string; label: string }[];
  @observable
  public currentLocale: string;

  constructor(private api: ApplicantAPI, ea: EventAggregator, private i18n : I18N) { 
    ea.subscribe(ApplicantViewed, msg => this.select(msg.applicant));
    ea.subscribe(ApplicantUpdated, msg => {
      let id = msg.applicant.id;
      let found = this.applicants.find(x => x.id == id);
      Object.assign(found, msg.applicant);
    });

    this.locales = [
      { key: "en-EN", label: "English" },
      { key: "de-DE", label: "German" }
    ];
    this.currentLocale = this.i18n.getLocale();
  }

  public currentLocaleChanged(newValue: string, oldValue: string): void {
    if (newValue) {
      if (newValue !== this.i18n.getLocale()) {
        this.setLocale(newValue);
      }
    }
  }

  private setLocale(locale: string): void {
    this.i18n.setLocale(locale).then(() => {
      console.log(`Locale has been set to ${locale}`);
    });
  }

  created() {
    this.api.getApplicants().then(applicants => {
      this.applicants = applicants;
      //console.log(applicants);
      //toastr.error('I do not think that word means what you think it means.', 'Inconceivable!')
    });
  }

  select(applicant) {
    this.selectedId = applicant.id;
    return true;
  }
}
  

  