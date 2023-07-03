import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoaderService } from '@core/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoaderComponent implements OnInit {
  expression: boolean = false;
  constructor(private loader:LoaderService) {
    this.loader.isLoading.subscribe((res:any)=>{
      this.expression = res
      // console.log(this.expression)
    })
  }

  ngOnInit(): void {}
}
