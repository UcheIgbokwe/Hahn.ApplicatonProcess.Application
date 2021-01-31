import {autoinject} from 'aurelia-dependency-injection';
import { observable } from "aurelia-framework";
import {EventAggregator} from 'aurelia-event-aggregator';
import {I18N} from 'aurelia-i18n';
import {ValidationControllerFactory, ValidationController, ValidateResult, ValidationRules, validateTrigger } from "aurelia-validation";
import Swal from 'sweetalert2';
import { ApplicantAPI } from './../api/agent';
import {ApplicantCreated} from './messages';
import { BootstrapFormRenderer } from './../bootstrap-form-renderer';


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

@autoinject
//@inject(ApplicantAPI, EventAggregator, ValidationRules, ValidationController, ValidationControllerFactory)
export class ApplicantDetail {
  routeConfig;
  applicant: Applicant;
  originalApplicant: Applicant;
  controller: ValidationController;
  public locales: { key: string; label: string }[];
  @observable
  public currentLocale: string;

  constructor(private api: ApplicantAPI, private ea: EventAggregator, private controllerFactory: ValidationControllerFactory, private i18n : I18N) { 
    this.controller = this.controllerFactory.createForCurrentScope();
    
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.controller.addObject(this);
    //this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.controller.reset({ object: this.applicant, propertyName: 'hired' });
  

    this.locales = [
      { key: "en-EN", label: "English" },
      { key: "de-DE", label: "German" }
    ];
    this.currentLocale = this.i18n.getLocale();
  }

  activate() {
    //this.canSave()
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

  create() {
    this.controller.validate()
    .then((validate) => {
      if(validate.valid) {
        return this.api.create(this.applicant).then(applicant => {
          console.log(applicant);
          this.applicant = <Applicant>applicant;
          this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
          this.ea.publish(new ApplicantCreated(this.applicant));
          window.location.reload();
        });
      } else {
        console.log('E no enter');
        
      }
    });
      
    
  }

  reset(){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reset it!'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    })
  }

  canSave() {
    this.controller.validate()
    .then((validate) => {
      if(validate.valid) {
        return true;
      } else {
        return false;
      }
    });
  }

  canReset(params) {
    if (params === undefined) {
      return !this.api.isRequesting;
    }
  }

  

}

ValidationRules
  .ensure('name').required()
  .withMessage('First Name must be provided.')
  .minLength(5)
  .withMessage('First Name must be atleast 5 characters.')
  .ensure('familyName').required()
  .withMessage('Last Name must be provided.')
  .minLength(5)
  .withMessage('Last Name must be atleast 5 characters.')
  .ensure('eMailAdress').required().email()
  .withMessage('Valid Email must be provided.')
  .ensure('address').required()
  .withMessage('Address must be provided.')
  .minLength(10)
  .withMessage('Address must be atleast 10 characters')
  .ensure('countryOfOrigin').required()
  .withMessage('Country must be provided.')
  .ensure('age').required()
  .withMessage('Age must be provided.')
  .between(20,60)
  .withMessage('Age must be between 20-60.')
  .on(ApplicantDetail);
  
  

  