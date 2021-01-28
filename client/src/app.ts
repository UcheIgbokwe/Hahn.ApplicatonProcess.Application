import {Router, RouterConfiguration} from 'aurelia-router';
  import {PLATFORM} from 'aurelia-pal';
  
  export class App {
    router: Router;
  
    configureRouter(config: RouterConfiguration, router: Router){
      config.title = 'Contacts';
      config.options.pushState = true;
      config.options.root = '/';
      config.map([
        { route: '',              moduleId: PLATFORM.moduleName('./components/no-selection'),   title: 'Select' },
        { route: 'contacts/:id',  moduleId: PLATFORM.moduleName('./components/contact-detail'), name:'contacts' }
      ]);
  
      this.router = router;
    }
  }
  

  