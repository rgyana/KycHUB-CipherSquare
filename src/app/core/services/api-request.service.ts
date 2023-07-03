import { environment } from 'src/environments/environment';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {

  constructor(private http: HttpClient) {
  }

  // function to perform post operation using formData type payload and header
  postdata(payload: any, path: any): Observable<any> {
    let headers = new HttpHeaders()
    if (payload?.form) {
      headers = headers.set('from', payload.form);
    }

    return this.http
      .post<any>(environment.baseurl + path['url'], payload?.payload ?? payload, { headers })
      .pipe(retry(0), catchError(this.errorHandl));
  };

  postdataAdmin(payload: any, path: any): Observable<any> {
    return this.http
      .post<any>(environment.baseurl + path['url'], payload)
      .pipe(retry(0), catchError(this.errorHandl));
  };


  // Function for get Api
  getdata(path: any): Observable<any> {
    return this.http
      .get<any>(environment.baseurl + path['url'])
      .pipe(retry(0), catchError(this.errorHandl));
  };

  // function to perform post operation using formData type payload and with no header
  postdataWithoutHeader(payload: any, path: any): Observable<any> {
    let headers = new HttpHeaders()
    if (payload?.form) {
      headers = headers.set('from', payload.form);
    }
    return this.http
      .post<any>(environment.baseurl + path['url'], payload?.payload ?? payload, { headers })
      .pipe(retry(0), catchError(this.errorHandl));
  };

  postAdminData(payload: any, path: any): Observable<any> {
    return this.http
      .post<any>(environment.baseurl + path, payload)
      .pipe(retry(0), catchError(this.errorHandl));
  };

  // function to perform post operation using formData type payload and with no header
  postdataForImageUrl(payload: any): Observable<any> {
    return this.http
      .post<any>(environment.baseurl, payload)
      .pipe(retry(0), catchError(this.errorHandl));
  };

  // handling error
  errorHandl(err: any) {
    //console.log(err);

    let error: any = '';
    if (err.error instanceof ErrorEvent) {
      error = err.error.message;
    } else {
      error = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    return throwError(() => error)
  }


}
