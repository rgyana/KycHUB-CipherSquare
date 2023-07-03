import { StoreService } from '@core/services/store.service';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
  Inject,
} from '@angular/core';
import { config } from '@core/interfaces/api_baseurl';
import { AuthService } from '@core/services/auth.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

declare var App: any;

@Component({
  selector: 'connect-banking-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
  activeOptionparent: any = -1;
  Subactive: any;
  sidemenuData: any;
  array: any;
  userInfo: any;
  currentPageUrl: any;
  environSetup: any;
  activeOptionsubchild: any;
  geturlPoints: any = {};
  @Output() pagetitle: EventEmitter<any> = new EventEmitter();

  originalOrder = (): number => {
    return 0;
  };
  childmenu: any;
  subchild: any;
  parentmenu: any;
  brandLogo: any;
  localLogo: any = 'assets/images/sprintverify-logo.png';
  constructor(
    private _auth: AuthService,
    private store: StoreService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this._auth.getEnvironment.subscribe((res: any) => {
      this.environSetup = res;
      const formdata = new FormData();
      formdata.append('app_env', this.store.get('env'));
      this._auth
        .postdata(formdata, config.sidemenu_live_sandbox.live)
        .subscribe((res: any) => {
          if (res.statuscode == 200) {
            this.sidemenuData = res.data.children;
            sessionStorage.removeItem('env');
            sessionStorage.setItem('env', res.user_env);
          }
        });
    });
  }

  ngOnInit(): void {
    let splits = this.router.url.split('/');
    this.geturl(splits);

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        // Hide progress spinner or progress bar
        splits = event.url.split('/');
        this.geturl(splits);
      }
    });
  }

  geturl(splits: any) {
    const filter = splits.filter((el: any) => {
      return el;
    });
    this.geturlPoints.mainmenu = filter[1]
      ?.toUpperCase()
      .replace('-', ' ')
      .replace('-', ' ');
    this.geturlPoints.menu = filter[2]
      ?.toUpperCase()
      .replace('-', ' ')
      .replace('-', ' ');
    this.geturlPoints.submenu = filter[3]
      ?.toUpperCase()
      .replace('-', ' ')
      .replace('-', ' ');
    const pagetitle = this.geturlPoints.submenu
      ? this.geturlPoints.submenu
      : this.geturlPoints.menu
      ? this.geturlPoints.menu
      : this.geturlPoints.mainmenu;
    setTimeout(() => {
      this.setpagetitle(pagetitle);
    }, 0);
  }

  showtoggle(value: any) {
    this.geturlPoints.mainmenu = value.toUpperCase().replace('-', ' ');
  }
  showdashboard(value: any) {
    this.geturlPoints.mainmenu = value.toUpperCase().replace('-', ' ');
    this.pagetitle.emit(value);
    this.menuremove();
  }
  isColles(val: any) {
    if (val.type == 'item') {
      return true;
    } else {
      return false;
    }
  }

  returnTitle(val: any) {
    return val.title;
  }

  returnurl(val: any) {
    return val.url;
  }

  start(url: any) {
    return url.startsWith('https');
  }

  menu(parent: any) {
    this.activeOptionparent = parent;
  }

  setsubmenu(e: any, submenu: any) {
    e.stopPropagation();

    this.geturlPoints.menu = submenu;
    this.pagetitle.emit(submenu);
  }

  returnChild(val: any) {
    return val.children;
  }

  setpagetitle(pagetitle: any, e?: any) {
    if (e) {
      e.stopPropagation();
    }
    this.geturlPoints.submenu = pagetitle;
    this.pagetitle.emit(pagetitle);
    this.menuremove();
  }
  menuremove() {
    this.document.body.classList.remove('dashboard-compact');
  }
}
