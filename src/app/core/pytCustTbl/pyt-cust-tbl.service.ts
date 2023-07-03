import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { pytCustTblInterface } from './pytPagination/pyt-cust-tbl-pager.directive';

export interface pytCustTblOptions {
  records: any[];
  columns: pytCustTblColunm[];
  config: pytCustTblInterface;
  dtUpdateFnCallBack: Function;
  dtRefresh: Function;
}

export interface pytCustTblColunm {
  is_show: '1' | '0' | 0 | 1;
  issort: '1' | '0' | 0 | 1;
  name: any;
  value: any;
}

@Injectable({
  providedIn: 'root',
})
export class PytCustTblService {
  // issort = Default = true; false;   add this if hide from perticular col
  // isDate: ''; isDate: false; isDate: true; isDate: 'MMM d, y';
  // Default isnumeric: false; isnumeric: true;

  constructor(private _CommonService: CommonService) { }

  dtGetCellValue(row: any, column: any) {
    let ds = column.name.split('.').reduce((prev: any, curr: string) => {
      return prev[curr];
    }, row);
    if (column.isDate) {
      return this._CommonService.getTransformDate(ds, column.isDate);
    }
    return ds;
  }

  dtSortHeaderClick(item: any, diTableOptions: pytCustTblOptions) {
    if (diTableOptions.config.sortBy === item.name) {
      diTableOptions.config.sortDirection =
        diTableOptions.config.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    diTableOptions.config.sortBy = item.name;
    var column: any = diTableOptions.columns.filter(
      (column: any) => column.name === diTableOptions.config.sortBy
    )[0];
    var isNumeric: boolean = column.isnumeric ? true : false;
    if (
      diTableOptions.dtUpdateFnCallBack &&
      typeof diTableOptions.dtUpdateFnCallBack == 'function'
    ) {
      diTableOptions.dtUpdateFnCallBack();
    }
  }

  dtIsSort(item: any, dtTableOptions: any) {
    return (
      (item.issort || item.issort == undefined) &&
      dtTableOptions.config.sortBy !== item.name &&
      item.name !== ''
    );
  }

  dtIsSortAsc(item: any, diTableOptions: pytCustTblOptions) {
    var isSortAsc: boolean =
      (item.issort || item.issort == undefined) &&
      diTableOptions.config.sortBy === item.name &&
      diTableOptions.config.sortDirection === 'asc';
    return isSortAsc;
  }

  dtIsSortDesc(item: any, diTableOptions: pytCustTblOptions) {
    var isSortDesc: boolean =
      (item.issort || item.issort == undefined) &&
      diTableOptions.config.sortBy === item.name &&
      diTableOptions.config.sortDirection === 'desc';
    return isSortDesc;
  }

  dtSearchBy(val: any, diTableOptions: pytCustTblOptions) {
    let input = val.value ?? val.target.value;
    input.toUpperCase();

    if (
      diTableOptions.config.searchType == 'server' &&
      diTableOptions.dtUpdateFnCallBack &&
      typeof diTableOptions.dtUpdateFnCallBack == 'function'
    ) {
      diTableOptions.config.serverSearchVal = input;
      diTableOptions.config.itmeLengthStartFrom = 0;
      diTableOptions.config.currentPage = 1;
      diTableOptions.dtUpdateFnCallBack();
    } else if (diTableOptions.config.searchType == 'local') {
      diTableOptions.config.localFilterVal = input;
    }
  }

  dtUpdateByPageLength(item: any, diTableOptions: pytCustTblOptions) {
    diTableOptions.config.totalItmePerPage = item.target.value;
    diTableOptions.config.itmeLengthStartFrom = 0;
    diTableOptions.config.currentPage = 1;
    if (
      diTableOptions.dtUpdateFnCallBack &&
      typeof diTableOptions.dtUpdateFnCallBack == 'function'
    ) {
      diTableOptions.dtUpdateFnCallBack();
    }
  }

  dtUpdateByPagination(val: any, diTableOptions: pytCustTblOptions) {
    if (val == 'back') {
      diTableOptions.config.currentPage = diTableOptions.config.currentPage - 1;
    } else if (val == 'next') {
      diTableOptions.config.currentPage = diTableOptions.config.currentPage + 1;
    } else if (val == 'first') {
      diTableOptions.config.currentPage = 1;
    } else if (val == 'last') {
      diTableOptions.config.currentPage = diTableOptions.config.totalPages;
    } else if (typeof val == 'number') {
      diTableOptions.config.currentPage = val;
    }

    diTableOptions.config.itmeLengthStartFrom =
      (diTableOptions.config.currentPage - 1) *
      diTableOptions.config.totalItmePerPage;
    if (
      diTableOptions.dtUpdateFnCallBack &&
      typeof diTableOptions.dtUpdateFnCallBack == 'function'
    ) {
      diTableOptions.dtUpdateFnCallBack();
    }
  }

  dtRefresh(tableOptions: any, obj: any) {
    tableOptions.records = obj.data || [];
    let header: any = [];
    if (obj.header) {
      obj.header.map((val: any) => {
        // if (val.is_show && typeof val.is_show === 'number') {
        //   val.is_show = String(val.is_show);
        // }
        header.push(val);
      });
    } else {
      if (obj.data) {
        let keyObj = obj.data[0];
        for (const key in keyObj) {
          const element = keyObj[key];
          let obja = {
            name: key,
            value: key.toUpperCase(),
            is_show: 1,
            issort: 1,
          };
          header.push(obja);
        }
      }
    }

    tableOptions.columns = header;

    let totalRecords = obj.recordsTotal ?? obj.recordscount;
    +totalRecords;
    tableOptions.config.totalCount = totalRecords;

    if (tableOptions.config.totalItmePerPage == 'All') {
      tableOptions.config.toRec = totalRecords;
      tableOptions.config.currentPage = 1;
      tableOptions.config.fromRec = 1;
      tableOptions.config.totalPages = null;
    } else {
      tableOptions.config.totalPages = Math.ceil(
        tableOptions.config.totalCount / tableOptions.config.totalItmePerPage
      );

      tableOptions.config.totalPages = tableOptions.config.totalPages
        ? tableOptions.config.totalPages
        : 0;

      tableOptions.config.fromRec = totalRecords
        ? tableOptions.config.itmeLengthStartFrom + 1
        : 0;
      tableOptions.config.toRec =
        tableOptions.config.currentPage * tableOptions.config.totalItmePerPage;

      tableOptions.config.toRec =
        tableOptions.config.toRec > tableOptions.config.totalCount
          ? tableOptions.config.totalCount
          : tableOptions.config.toRec;
    }
  }
}
