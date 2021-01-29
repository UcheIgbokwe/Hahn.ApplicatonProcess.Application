import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import Swal from 'sweetalert2';
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
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!areEqual(params, this.originalApplicant)) {
          return this.api.update(params).then(newApplicant => {
            this.newApplicant = <Applicant>newApplicant;
            this.ea.publish(new ApplicantUpdated(this.newApplicant));
            Swal.fire(
              'Updated!',
              'Your record has been updated.',
              'success'
            )
            setTimeout(function(){location.replace("/")}, 3000);
          });
        }else{
          Swal.fire(
            'Warning',
            'There are no new changes',
            'warning',
          );
        }
        
      }
    })
  }

  delete(params) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (params !== undefined) {
          return this.api.delete(params.id).then(responseMessage => {
            Swal.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            )
            setTimeout(function(){location.replace("/")}, 3000);
          });
          
          
        }else{
          Swal.fire(
            'Warning',
            'The fields are empty!',
            'warning',
          );
        }
        
      }
    })
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
  

  