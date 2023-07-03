import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  BehaviorSubject,
  retry,
  catchError,
  throwError,
  Subject,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoreService } from './store.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { config } from '@core/interfaces/api_baseurl';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private environmentApi = new BehaviorSubject<number>(this.store.get('env'));
  public getEnvironment = this.environmentApi.asObservable();
  domainColorConfig: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private subject = new Subject<any>();
  serviceToken: any;
  public setmobileApi = new BehaviorSubject<any>('');
  public getmobileApi = this.setmobileApi.asObservable();

  sendMessage(message: string) {
    this.subject.next(message);
  }

  setEnvironment(val: number) {
    this.environmentApi.next(val);
  }

  //If we want send data with message and obj at same time ;

  sendMessagewithObj(message: string, obj: any) {
    this.subject.next({ text: message, data: obj });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  clearMessages() {
    this.subject.next({});
  }

  sidebarColps: boolean = false;
  private cols = new BehaviorSubject<boolean>(this.sidebarColps);
  updateCols = this.cols.asObservable();

  constructor(
    private http: HttpClient,
    private store: StoreService,
    private router: Router
  ) {

  }


  toggleCols(value: boolean) {
    this.cols.next(value);
  }

  getAuthStatus(): boolean {
    return this.store.has('details');
  }

  //post method with payload
  postdata(payload: any, path: string): Observable<any> {
    return this.http
      .post<any>(environment.baseurl + path, payload)
      .pipe(retry(0), catchError(this.errorHandler));
  }

  // post methode bank list


  //post method without payload
  postHeaderwithoutpayload(path: any): Observable<any> {
    return this.http
      .post(environment.baseurl + path, null)
      .pipe(retry(0), catchError(this.errorHandler));
  }

  //get method

  getData(path: any): Observable<any> {
    return this.http
      .get(environment.baseurl + path)
      .pipe(retry(0), catchError(this.errorHandler));
  }

  errorHandler(err: any) {
    let error: any = '';
    if (err.error instanceof ErrorEvent) {
      error = err.error.message;
    } else {
      error = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    return throwError(() => error);
  }

  logout() {
    this.router.navigate(['/auth/login']);
    return this.store.clearSessionStorage();
  }

  public exportExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_Connect_Banking_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
