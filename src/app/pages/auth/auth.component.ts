import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  currentUrl: any;
  mobile: any;
  brandLogo: any;
  loginText: any;
  constructor(
    private route: Router,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUrl = window.location.hash;
    this.mobile = this.currentUrl.split('/')[3];
  }
}
