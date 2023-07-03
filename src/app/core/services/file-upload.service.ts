import { lowerFirst } from 'lodash';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';
import { StoreService } from '@core/services/store.service';
import {environment } from '../../../environments/environment'
import { config } from '@core/interfaces/api_baseurl';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {


  serviceToken: any;

  // API url
  baseApiUrl = environment.baseurl
  // baseApiUrl = 'https://kyc.vsts.net.in/server/public/index.php/api/uploadVideo_kyc';

  constructor(private http: HttpClient, private store: StoreService) {

  }


  // Returns an observable
  upload(file: any): Observable<any> {
    console.log('file',file);

    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", file, file.name);

    // Make http post request over api
    // with formData as req
    return this.http.post(this.baseApiUrl + config.fileUpload.upload, formData)
  }

  videoupload(file: any): Observable<any> {

    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", file, file.type);

    // Make http post request over api
    // with formData as req
    return this.http.post(this.baseApiUrl + config.fileUpload.upload, formData)
  }
}
