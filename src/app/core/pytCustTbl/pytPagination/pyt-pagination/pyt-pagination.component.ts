import { Component, Input, OnInit } from '@angular/core';
import {
  pytCustTblOptions,
  PytCustTblService,
} from '../../pyt-cust-tbl.service';

@Component({
  selector: 'app-pyt-pagination',
  templateUrl: './pyt-pagination.component.html',
  styleUrls: ['./pyt-pagination.component.css'],
})
export class PytPaginationComponent implements OnInit {
  @Input() tableOptions!: pytCustTblOptions;
  @Input() tableOptionsCopy!: pytCustTblOptions;
  constructor(public _PytCustTblService: PytCustTblService) {}

  ngOnInit(): void {}
}
