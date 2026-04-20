import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ListingsService {
  private api = 'http://172.20.10.4:8000'

  constructor(private http: HttpClient) {}

  getListings() {
    console.log('ListingsService: Fetching from', `${this.api}/ads/`);
    return this.http.get<any[]>(`${this.api}/ads/`).pipe(
      tap(data => console.log('ListingsService: Received', data.length, 'listings')),
      catchError(err => {
        console.error('ListingsService: HTTP Error', err);
        throw err;
      })
    );
  }

  getListing(id: number) {
    return this.http.get<any>(`${this.api}/ads/${id}/`)
  }

  createListing(data: any) {
    return this.http.post(`${this.api}/ads/`, data)
  }

  getMyListings() {
    console.log('ListingsService: Fetching user listings from', `${this.api}/my-listings/`);
    return this.http.get<any[]>(`${this.api}/my-listings/`).pipe(
      tap(data => console.log('ListingsService: Received', data.length, 'user listings')),
      catchError(err => {
        console.error('ListingsService: HTTP Error', err);
        throw err;
      })
    );
  }

  deleteListings(id: number) {
    return this.http.delete(`${this.api}/ads/${id}/`);
  }
}