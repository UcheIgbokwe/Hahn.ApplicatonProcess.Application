import {Aurelia} from 'aurelia-framework';
import * as environment from '../config/environment.json';
import {PLATFORM} from 'aurelia-pal';
import {I18N, TCustomAttribute, Backend} from 'aurelia-i18n';
//import Backend from 'i18next-xhr-backend';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

export function configure(aurelia: Aurelia): void {

  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .plugin(PLATFORM.moduleName('aurelia-validation'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
    let aliases = ['t', 'i18n'];
    // add aliases for 't' attribute
    TCustomAttribute.configureAliases(aliases);
    
    // register backend plugin
    instance.i18next.use(Backend.with(aurelia.loader)); 

    // adapt options to your needs (see http://i18next.com/docs/options/)
    // make sure to return the promise of the setup method, in order to guarantee proper loading
    return instance.setup({
      backend: {                                  // <-- configure backend settings
        loadPath: 'locales/{{lng}}/{{ns}}.json', // <-- XHR settings for where to get the files from 
      },
      attributes: aliases,
      lng : 'en-EN',
      fallbackLng: 'de-DE',
      load: "currentOnly",
      returnObjects: false,
      debug : false
    });
  });

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
