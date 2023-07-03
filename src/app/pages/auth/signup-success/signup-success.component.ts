import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.component.html',
  styleUrls: ['./signup-success.component.scss'],
})
export class SignupSuccessComponent implements OnInit {
  verifyMessage: any;
  constructor(
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
  }
}
