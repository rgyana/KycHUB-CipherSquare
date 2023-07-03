import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-item-sidebar',
  templateUrl: './item-sidebar.component.html',
  styleUrls: ['./item-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemSidebarComponent implements OnInit {
  @Input() sidemenuData: any;
  @Input() hasParent: boolean = false;
  @ViewChild('itemLi') itemLi!: ElementRef
  environment=environment.frontend_url
  constructor(private _auth: AuthService) { }

  ngOnInit(): void {
    // setTimeout(() => {

    //   $(this.itemLi.nativeElement).on('click', (e: any) => {
    //     if ($('#accordionExample').find('> app-collaps-sidebar > li >a[aria-expanded="true"]').length > 1) {
    //       let cl = $('#accordionExample').find('> app-collaps-sidebar > li >a[aria-expanded="true"]')[1];
    //       cl.click();
    //     }
    //   })
    // }, 1);
  }

}
