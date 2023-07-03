import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-collaps-sidebar',
  templateUrl: './collaps-sidebar.component.html',
  styleUrls: ['./collaps-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollapsSidebarComponent implements OnInit {
  @Input() sidemenuData: any;
  @Input() dataParent!: string;
  @Input() dataIntex!: number;
  environment=environment.frontend_url
  currentroute: any;
  originalOrder = (): number => {
    return 0;
  };
  constructor(private router: Router) {
    this.currentroute = router.url
  }

  ngOnInit(): void {

    for (var i = 0; i < this.sidemenuData.children.length; i++) {
      var testroute = '/' + this.sidemenuData.children[i]?.url
      if (testroute === this.currentroute) {
        var log: any = this.sidemenuData?.id
        setTimeout(() => {
          document.getElementById(log)?.click()
        }, 100);

      } else {

      }
    }
  }

  start(url:any){
    return url.startsWith("https")
  }

  isColles(val: any) {
    // console.log(val)
    if (val.type == 'item') {
      return true;
    } else {
      return false;
    }
  }

  // returnChild(val:any){
  //   returnval
  // }


}
