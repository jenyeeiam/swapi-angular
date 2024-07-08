import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, retry, mergeMap, delay, take, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CachingService {
  private cache = new Map<string, any>();

  constructor(private http: HttpClient) { }

  fetchData(url: string): Observable<any> {
    if (this.cache.has(url)) {
      // Return cached data if available
      return of(this.cache.get(url));
    } else {
      // Fetch data from API and cache it
      return this.http.get<any>(url).pipe(
        debounceTime(300), // Waits 300ms after each request trigger
        distinctUntilChanged(), // Only proceeds if the URL is different from the last request
        tap(data => this.cache.set(url, data)),
        retry({
          count: 5, // Number of retry attempts
          delay: (error, retryCount) => {
            // Exponential backoff: delay increases with each retry attempt
            return of(error).pipe(delay(1000 * Math.pow(2, retryCount)));
          }
        }),
        mergeMap(response => response ? of(response) : throwError('Failed to fetch data after retries'))
      );
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}
