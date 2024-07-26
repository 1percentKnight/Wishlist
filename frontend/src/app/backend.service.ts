import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  postFormData(formData: FormData) {
    console.log("In service");
    console.log(formData);
    return this.http.post(`${this.apiUrl}/api/items`, formData);
  }

  getFormData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/items`);
  }
}
