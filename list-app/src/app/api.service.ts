import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiBaseUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  getFlareData(startDate?: string, endDate?: string): Observable<any[]> {
    // Default to 30 days prior to current UTC date
    const today = new Date();
    const end = endDate || today.toISOString().split('T')[0];

    const start = startDate || new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))
      .toISOString()
      .split('T')[0];



    // Set up query parameters
    const params = new HttpParams()
      .set('startDate', start)
      .set('endDate', end)
      .set('api_key', this.apiKey);

    return this.http.get<any[]>(this.apiUrl, { params });
  }

}

