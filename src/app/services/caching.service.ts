import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CachingService {
  private cache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  fetchData(url: string): Observable<any> {
    if (this.cache.has(url)) {
      // Return cached data if available
      return of(this.cache.get(url));
    } else {
      // Fetch data from API and cache it
      return this.http.get<any>(url).pipe(
        tap(data => this.cache.set(url, data))
      );
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}
