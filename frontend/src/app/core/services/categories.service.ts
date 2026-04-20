import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Category {
  id: number
  name: string
  path?: string
  children: Category[]
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private api = 'http://172.20.10.4:8000'

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Category[]>(`${this.api}/categories/`)
  }
}