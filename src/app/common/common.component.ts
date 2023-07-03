import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export class CommonComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  pagetitle: any;
  constructor(private auth: AuthService,) {  this._unsubscribeAll = new Subject();}

  ngOnInit(): void {
    this.auth.updateCols
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((config: any) => {
      // console.log(config)
      if (config) {
        const result = document.getElementsByClassName("main-container");
        // console.log('sidebar-closed add')
        result[0].classList.add('sidebar-closed')
        result[0].classList.remove('sbar-open')
      } else {
        const result = document.getElementsByClassName("main-container");
        result[0].classList.remove('sidebar-closed')
        result[0].classList.add('sbar-open')
        // console.log('sidebar-closed remove')
      }

    });
  }

  setpagetitle(pagetitle:any)
  {
   // console.log(pagetitle);

    this.pagetitle = pagetitle;
  }
  // setmenutitle(menutitle:any){
  //   this.pagetitle = menutitle
  // }
  // setmainmenutitle(mainmenu:any){
  //   this.pagetitle = mainmenu
  // }

}
