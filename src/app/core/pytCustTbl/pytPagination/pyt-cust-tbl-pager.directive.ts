import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { PytCustTblService } from '../pyt-cust-tbl.service';

export interface ReportConfig {
  url: any,
  formData: any | Function,
  fileName: string
}

export const pytCustTblConfig = {
  showSort: true,
  search: '',
  sortBy: '', //columns name || ''
  sortDirection: 'asc', //asc || desc
  itmeLengthStartFrom: 0,
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  totalItmePerPage: 100, // number
  pagger: ['All', 10, 50, 100, 200, 500],
  fromRec: 0,
  toRec: 0,
  // maxSize: 10,
  // showSelectCheckbox: true,
  // showSelectAll: true,
  // clientSort: true,
  // clientPaging: true,
  // //displayPager: true,
  // //displayPageSize: true,
  // stickyHeader: true,
  // stickyHeaderOffset: 0,
  // stickyContainer: '.table1-container'
};

export interface pytCustTblInterface {
  showSort: boolean;
  downloadReports: ReportConfig | null;
  reloadTable: boolean;
  rotateIt: boolean;
  searchType?: 'local' | 'server';
  serverSearchVal: string;
  localFilterVal: string;
  sortBy: string;
  sortDirection: string;
  itmeLengthStartFrom: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  totalItmePerPage: number;
  pagger: (string | number)[];
  fromRec: number;
  toRec: number;
}

export interface pytCustTblAnyInterface {
  showSort?: boolean;
  downloadReports?: ReportConfig | null;
  reloadTable?: boolean;
  rotateIt?: boolean;
  searchType?: 'local' | 'server' | null;
  serverSearchVal?: string;
  localFilterVal?: string;
  sortBy?: string;
  sortDirection?: string;
  itmeLengthStartFrom?: number;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  totalItmePerPage?: number;
  pagger?: (string | number)[];
  fromRec?: number;
  toRec?: number;
}


export class pytCustTblCnfg {
  showSort: boolean;
  downloadReports: ReportConfig | null;
  reloadTable: boolean;
  rotateIt: boolean;
  serverSearchVal: string;
  searchType: 'local' | 'server';
  localFilterVal: string;
  sortBy: string; //columns name || ''
  sortDirection: string; //asc || desc
  itmeLengthStartFrom: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  totalItmePerPage: number;
  pagger: (string | number)[];
  fromRec: number;
  toRec: number;

  constructor() {
    this.showSort = true;
    this.downloadReports = null;
    this.reloadTable = true;
    this.rotateIt = true;
    this.searchType = 'server';
    this.serverSearchVal = '';
    this.localFilterVal = '';
    this.sortBy = '';
    this.sortDirection = 'asc';
    this.itmeLengthStartFrom = 0;
    this.totalCount = 0;
    this.currentPage = 1;
    this.totalPages = 0;
    this.totalItmePerPage = 10;
    this.pagger = ['All', 10, 50, 100, 200, 500];

    this.fromRec = 0;
    this.toRec = 0;
  }

  pytCustTblDynCnfg(keys: pytCustTblAnyInterface): pytCustTblInterface {
    // let testMdl = new pytCustTblCnfg();

    //   testMdl.pytCustTblDynCnfg({ currentPage: 2, pagger: [...testMdl.pagger,700,1000] })
    // );

    let keysObj: any = keys;
    let obj: any = {
      showSort: this.showSort,
      downloadReports: this.downloadReports,
      reloadTable: this.reloadTable,
      rotateIt: this.rotateIt,
      searchType: this.searchType,
      serverSearchVal: this.serverSearchVal,
      localFilterVal: this.localFilterVal,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      itmeLengthStartFrom: this.itmeLengthStartFrom,
      totalCount: this.totalCount,
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      totalItmePerPage: this.totalItmePerPage,
      pagger: this.pagger,
      fromRec: this.fromRec,
      toRec: this.toRec,
    };

    for (const key in keysObj) {
      if (Object.prototype.hasOwnProperty.call(keysObj, key)) {
        const element = keysObj[key];
        obj[key] = element;
      }
    }
    return obj;
  }
}

export class EmployeeClass {
  constructor(
    private id: number = 0,
    private firstName: string,
    private lastName?: string,
    private salary?: number
  ) { }

  getName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getYearlySalary(): any {
    if (this.salary) {
      return 12 * this.salary;
    }
    return null;
  }
}
export interface EmployeeClassInter {
  firstName: string;
  id?: number;
  lastName?: string;
  salary?: number;
}
export class EmployeeClass1 implements EmployeeClassInter {
  constructor(public firstName: string, public id?: number) {
    // if (id) {
    //   this.id = id;
    // }
  }
}

@Directive({
  selector: '[appPytCustTblPager]',
})
export class PytCustTblPagerDirective implements OnChanges {
  @Input() tableOptions: any;
  @Input() totalPages: any;
  @Input() currentPage: any;
  $pagination: any;
  $adjacents: any = 3;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private _PytCustTblService: PytCustTblService
  ) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.setPager();
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.setPager();
  }

  setPager() {
    let divEle = this.elRef.nativeElement;
    const childElements = this.elRef.nativeElement.children;
    for (let child of childElements) {
      this.renderer.removeChild(this.elRef.nativeElement, child);
    }

    let $lastpage = this.totalPages;
    let $page = this.currentPage;
    this.$pagination = '';

    if ($lastpage > 1) {
      if ($lastpage < 7 + this.$adjacents * 2) {
        for (let $counter = 1; $counter <= $lastpage; $counter++) {
          if ($counter == $page) {
            this.setCurrent($counter, divEle);
          } else this.setCounter($counter, divEle);
        }
      } else if ($lastpage > 5 + this.$adjacents * 2) {
        if ($page < 1 + this.$adjacents * 2) {
          for (
            let $counter = 1;
            $counter < 4 + this.$adjacents * 2;
            $counter++
          ) {
            if ($counter == $page) {
              this.setCurrent($counter, divEle);
            } else this.setCounter($counter, divEle);
          }
          this.setLastPage($lastpage, divEle);
        } else if (
          $lastpage - this.$adjacents * 2 > $page &&
          $page > this.$adjacents * 2
        ) {
          this.setFirstPage(divEle);
          for (
            let $counter = $page - this.$adjacents;
            $counter <= $page + this.$adjacents;
            $counter++
          ) {
            if ($counter == $page) {
              this.setCurrent($counter, divEle);
            } else this.setCounter($counter, divEle);
          }
          this.setLastPage($lastpage, divEle);
        } else {
          this.setFirstPage(divEle);
          for (
            let $counter = $lastpage - (2 + this.$adjacents * 2);
            $counter <= $lastpage;
            $counter++
          ) {
            if ($counter == $page) {
              this.setCurrent($counter, divEle);
            } else this.setCounter($counter, divEle);
          }
        }
      }
    }
  }

  setFirstPage(divEle: any) {
    const aTag1 = this.renderer.createElement('a');
    const aTagText = this.renderer.createText('1...');
    this.renderer.appendChild(aTag1, aTagText);
    this.renderer.appendChild(divEle, aTag1);
    this.renderer.listen(aTag1, 'click', (e) => {
      e.stopPropagation();
      this._PytCustTblService.dtUpdateByPagination(1, this.tableOptions);
    });
  }

  setCounter($counter: any, divEle: any) {
    const aTag2 = this.renderer.createElement('a');
    const aTagText = this.renderer.createText($counter.toString());
    this.renderer.addClass(aTag2, 'click');
    this.renderer.appendChild(aTag2, aTagText);
    this.renderer.appendChild(divEle, aTag2);
    this.renderer.listen(aTag2, 'click', (e) => {
      e.stopPropagation();
      this._PytCustTblService.dtUpdateByPagination($counter, this.tableOptions);
    });
  }

  setCurrent($counter: any, divEle: any) {
    this.$pagination += '<span>' + $counter + '</span>';
    const span = this.renderer.createElement('span');
    const spanText = this.renderer.createText($counter.toString());
    this.renderer.addClass(span, 'active');
    this.renderer.appendChild(span, spanText);
    this.renderer.appendChild(divEle, span);
  }

  setLastPage($lastpage: any, divEle: any) {
    const aTag3 = this.renderer.createElement('a');
    const aTagText = this.renderer.createText('...' + $lastpage);
    this.renderer.appendChild(aTag3, aTagText);
    this.renderer.listen(aTag3, 'click', (e) => {
      e.stopPropagation();
      this._PytCustTblService.dtUpdateByPagination(
        +$lastpage,
        this.tableOptions
      );
    });
    this.renderer.appendChild(divEle, aTag3);
  }
}

// ----------------------------OLD CODE------------------------------

// config: {
//   showSort: true,
//   search: '',
//   sortBy: '',               //columns name || ''
//   sortDirection: "asc",     //asc || desc
//   itmeLengthStartFrom: 0,
//   totalCount: 0,
//   currentPage: 1,
//   totalPages: 0,
//   totalItmePerPage: 100,      // number
//   pagger: [
//     5, 10, 20, 25, 30, 100, 200
//   ],
//   fromRec: 0,
//   toRec: 0,
// },
// dtUpdateFnCallBack: async function () {

//   let data: any = await that.recordsearchFn();
//   if (data.statuscode == 200) {
//     that.tableOptions.dtRefresh(data);
//   }
// },
// dtRefresh: function (obj: any) {

//   that.tableOptions.records = obj.data;
//   let header: any = [];
//   if (obj.isheader) {
//     obj.isheader.map((val: any) => {
//       // if (val.is_show == '1') {
//       header.push(val);
//       // }
//     });
//   } else {
//     if (obj.data) {
//       let keyObj = obj.data[0];
//       for (const key in keyObj) {
//         const element = keyObj[key];
//         let obja = {
//           "name": element,
//           "value": element.toUpperCase(),
//           "is_show": 1,
//           "issort": 1
//         }
//         header.push(obja);
//       }
//     }
//   }

//   that.tableOptions.columns = header;

//   that.tableOptions.config.totalCount = +obj.recordsTotal;

//   that.tableOptions.config.totalPages = Math.ceil(that.tableOptions.config.totalCount / that.tableOptions.config.totalItmePerPage);

//   that.tableOptions.config.totalPages = that.tableOptions.config.totalPages ? that.tableOptions.config.totalPages : 0;

//   that.tableOptions.config.fromRec = obj.recordsTotal ? that.tableOptions.config.itmeLengthStartFrom + 1 : 0;

//   that.tableOptions.config.toRec = that.tableOptions.config.currentPage * that.tableOptions.config.totalItmePerPage;

//   that.tableOptions.config.toRec = that.tableOptions.config.toRec > that.tableOptions.config.totalCount ? that.tableOptions.config.totalCount : that.tableOptions.config.toRec;
//   that.tableOptionsCopy = that.tableOptions
// }
