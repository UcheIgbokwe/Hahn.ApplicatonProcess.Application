import {Router, RouterConfiguration} from 'aurelia-router';
import {inject, PLATFORM} from 'aurelia-framework';

import { ApplicantAPI } from './../src/api/agent';

@inject(ApplicantAPI)
export class App {
  router: Router;

  constructor(public api: ApplicantAPI) {}

  configureRouter(config: RouterConfiguration, router: Router){
    config.title = 'Applicants';
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: '',                moduleId: PLATFORM.moduleName('./components/applicant-create'), title:'Applicants' },
      { route: 'applicants/:id',  moduleId: PLATFORM.moduleName('./components/applicant-detail'), name:'applicants' }
    ]);

    this.router = router;
  }
}
  

  