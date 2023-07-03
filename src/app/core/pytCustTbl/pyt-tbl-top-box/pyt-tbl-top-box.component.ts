import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { pytCustTblOptions, PytCustTblService } from '../pyt-cust-tbl.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-pyt-tbl-top-box',
  templateUrl: './pyt-tbl-top-box.component.html',
  styleUrls: ['./pyt-tbl-top-box.component.css'],
})
export class PytTblTopBoxComponent implements OnInit {
  @Input() tableOptions!: pytCustTblOptions;

  @Input() rotateIt: boolean = false;
  @Output() reloadTbl = new EventEmitter<void>();

  @Input() isReportCanDownload: boolean = false;
  @Output() downloadReport = new EventEmitter<void>();
  @Input() download_reports: boolean = false;
  @Input() download_data: any = [];
  constructor(
    public _PytCustTblService: PytCustTblService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {}

  download1() {
    let formdata = this.tableOptions.config.downloadReports?.formData();
    this.auth
      .postdata(formdata, this.tableOptions.config.downloadReports?.url)
      .subscribe((res: any) => {
        if (res.statuscode == 200) {
          const fileName =
            this.tableOptions.config.downloadReports?.fileName + '.xlsx';
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res['data']);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(
            wb,
            ws,
            this.tableOptions.config.downloadReports?.fileName
          );
          XLSX.writeFile(wb, fileName);
        } else {
          Swal.fire({
            icon: 'error',
            title: res.message,
          });
        }
      });
  }

  download() {
    var data = [];
    var arrayvalue: any = [];
    var headerarray: any = [];
    var finalArr: any = [];
    if (this.download_data.data) {
      data = this.download_data.data;
    }
    var slr = 1;
    data.forEach((item: any) => {
      // debugger
      var minarray = [];
      for (const key in item) {
        let vt = this.download_data.header.filter(
          (t: any) => t.name === key
        )[0];
        if (vt?.is_show == 1) {
          if (typeof item[key] == 'object') {
            minarray.push(JSON.stringify(item[key]));
          } else {
            minarray.push(item[key]);
          }
          if (slr == 1) {
            headerarray.push(vt?.value);
          }
        }
      }
      arrayvalue.push(minarray);
      slr++;
    });
    // console.log(...arrayvalue);
    finalArr.push(headerarray);
    finalArr.push(...arrayvalue);
    console.log(finalArr)

    this.auth.exportExcel(finalArr, 'List');
  }
}
