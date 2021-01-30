import {autoinject} from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ValidationControllerFactory, ValidationController, ValidateResult, ValidationRules } from "aurelia-validation";
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
  errors: ValidateResult[];

  constructor(private api: ApplicantAPI, private ea: EventAggregator, private controllerFactory: ValidationControllerFactory) { 
    this.controller = this.controllerFactory.createForCurrentScope();
    
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.controller.addObject(this);
    //this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.controller.reset({ object: this.applicant, propertyName: 'hired' });
  

   

  }


  create() {
    this.controller.validate()
    .then((validate) => {
      this.errors = validate.results;
      if(this.errors.length <= 0) {
        return this.api.create(this.applicant).then(applicant => {
          console.log(applicant);
          this.applicant = <Applicant>applicant;
          this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
          this.ea.publish(new ApplicantCreated(this.applicant));
          window.location.reload();
        });
      } else {
        console.log('E no enter')
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

ValidationRules
  .ensure('name').required()
  .withMessage('First Name must be provided.')
  .ensure('familyName').required()
  .withMessage('Last Name must be provided.')
  .ensure('eMailAdress').email()
  .withMessage('Valid Email must be provided.')
  .ensure('address').required()
  .withMessage('Address must be provided.')
  .ensure('countryOfOrigin').required()
  .withMessage('Country must be provided.')
  .ensure('age').required()
  .withMessage('Age must be provided.')
  .on(ApplicantDetail);
  
  

  