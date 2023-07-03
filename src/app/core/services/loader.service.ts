import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isLoading = new BehaviorSubject(false);
  loaderEvent = new EventEmitter();

  constructor() { }

  show(){
    this.isLoading.next(true);
  }

  hide(){
    this.isLoading.next(false);
  }
}
