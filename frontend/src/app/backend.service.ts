import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private apiUrl = "http://localhost:3000";

  constructor() { }
  http = inject(HttpClient)

  postData(formData: FormGroup): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/items`, formData);
  } 

  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/items`);
  }
}
