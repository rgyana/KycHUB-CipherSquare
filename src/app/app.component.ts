import { async } from '@angular/core/testing';

import {
  Component,
  OnInit,
  EventEmitter,
  OnDestroy,
  Input,
  Output,
} from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { config } from '@core/interfaces/api_baseurl';
import { Title } from '@angular/platform-browser';
declare let $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = '';

  constructor(
    private auth: AuthService,
    private titleService: Title
  ) {

  }

  // title: any;
  type: number = 0;
  ngOnInit(): void {

  }
}
