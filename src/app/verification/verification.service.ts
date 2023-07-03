import { Inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private _configSubject = new BehaviorSubject(null);
  private readonly _defaultConfig: any;
  constructor() {
    // Set the default config from the user provided config (from forRoot)
    // this._defaultConfig = _config;
    this._configSubject = new BehaviorSubject(null);
  }

  // Set and get the config
  set config(value: any) {
    // Get the value from the behavior subject
    let config = this._configSubject.getValue();

    // Merge the new config
    config = _.merge({}, config, value);

    // Notify the observers
    this._configSubject.next(config);
  }

  get config(): any | Observable<any> {
    return this._configSubject.asObservable();
  }
/**
 * Reset to the default config
 */
 resetToDefaults(): void
 {
     // Set the config from the default config
     this._configSubject.next(_.cloneDeep(this._defaultConfig));
 }

}
