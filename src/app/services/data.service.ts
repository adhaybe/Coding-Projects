import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Content } from '../models/Content';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public data: Content[] = [];

  constructor(private http: HttpClient) {}

  getData(): Observable<Content[]> {
    return this.http.get<Content[]>('../../assets/data.json');
  }

}
