import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://localhost:3000/api/items';

  constructor(private http: HttpClient) { }

  getFormData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  postFormData(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
