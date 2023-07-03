import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { config } from '@core/interfaces/api_baseurl';
import { AuthService } from '@core/services/auth.service';
import { StoreService } from '@core/services/store.service';
import { SwalService } from '@core/services/swal.service';
import Swal from 'sweetalert2';
import { RiCustomMdlService } from '@core/custom-otp-modal/ri-custom-mdl/ri-custom-mdl.service';
import { ToasterService } from '@core/services/toaster.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  isEnv: boolean = false;
  valEnv: boolean = false;
  isShown: boolean = false;
  localload: boolean = false;
  userType: any;
  userInfo: any;
  userData: any;
  firstLetter: any;
  balance: any;
  envUser: any;
  currentRoute: any;
  expression: boolean = false;
  isLogo: boolean = false;
  logo: any;
  url: any;
  envval: any;
  mdlId: any = 'livemdl';
  usertype: any;
  userEnv: any;
  kycApproval: any;
  @Input() pagetitle: any = '';
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private auth: AuthService,
    private store: StoreService,
    private router: Router,
    private _RiCustomMdlService: RiCustomMdlService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

  }

  getbalance() {
    this.localload = true;
    this.auth
      .postHeaderwithoutpayload(config.header.getbalance)
      .subscribe((res: any) => {
        this.localload = false;
        if (res.statuscode == 200) {
          this.balance = res.data;
        }
      });
  }

  menuadd() {
    this.document.body.classList.toggle('dashboard-compact');
  }
  menuremove() {
    this.document.body.classList.remove('dashboard-compact');
  }
  showhide() {
    if (!this.isShown) {
      this.isShown = true;
      this.document.body.classList.add('sidebar-noneoverflow');
      this.auth.toggleCols(true);
    } else {
      this.isShown = false;
      this.document.body.classList.remove('sidebar-noneoverflow');
      this.auth.toggleCols(false);
    }
  }

  logout() {
    this.auth.postHeaderwithoutpayload(config.auth.logout).subscribe({
      next: (res: any) => {
        if (res.statuscode == 200) {
          this.store.clearSessionStorage();
          localStorage.clear();
          location.reload();
          this.router.navigate(['/auth/login']);
        }
      },
    });
  }

  config(id: any) {
    this.router.navigate(['/dashboard/config', { id: btoa(id.toString()) }]);
  }

  getUserData(url: any) {
    this.userData = this.store.get('details');
    this.userInfo = this.userData.userdata;
    this.firstLetter = this.userInfo?.name.charAt(0);
    if (this.userInfo != undefined) {
      this.userType = this.userInfo.usertype;
      if (this.userType != 1 && this.userType != 0) {
        this.getbalance();
      }
    }

  const env = this.store.get('env');
    if (env == 2) {
      this.valEnv = true;
    } else {
      this.valEnv = false;
    }
  }
  createVpa() {
    const formdata = new FormData();
    this.auth
      .postdata(formdata, config.sidemenu_live_sandbox.createva)
      .subscribe((res: any) => {
        // does not do anything
      });
  }

  // openModel(){
  //   this._RiCustomMdlService.open(this.mdlId);
  // }
  convertUppercase(val: any) {
    return val?.toUpperCase();
  }

  changeEnv(val: any) {
    if (val == false) {
      this.valEnv = !this.valEnv;
      this.envval = 2;
    }
    if (val == true) {
      this.valEnv = !this.valEnv;
      this.envval = 1;
      // this.auth.setEnvironment(this.envval);
    }
    try {
      const formdata = new FormData();
      formdata.append('app_env', this.envval);
      this.auth
        .postdata(formdata, config.sidemenu_live_sandbox.live)
        .subscribe((res: any) => {
          sessionStorage.removeItem('env');
          sessionStorage.setItem('env', res.user_env);

          if (this.envval == 2 && this.userData.userdata.is_kyc == 0) {
            this.createVpa();
            this._RiCustomMdlService.open(this.mdlId);
          }
          if (this.envval == 2 && this.userData.userdata.is_kyc == 1) {
            this.createVpa();
            console.log(this.userData.userdata.is_kyc);

            setTimeout(() => {
              location.reload();
            }, 800);
          }
          if (this.envval == 1) {
            this.router.navigate(['/dashboard/dashboard']);
            setTimeout(() => {
              location.reload();
            }, 800);
          }
        });
    } catch (error) {
      Swal.fire(`${error}`);
    }
  }

  click_now() {
    this.router.navigate(['/dashboard/company-bank/kyc-process']);
    this._RiCustomMdlService.close(this.mdlId);
  }
  leter() {
    this._RiCustomMdlService.close(this.mdlId);
  }
}
