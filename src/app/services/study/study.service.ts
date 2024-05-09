import { Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable, timer } from 'rxjs';
import { mergeMap, scan, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export const TIME_DELAY = 5000;

@Injectable({
  providedIn: 'root',
})
export class StudyService {
  private pageSize = 10;
  private pageToken: string | null = null;
  public loading$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  getItems(): Observable<Study[]> {
    // Fetch initial 10 items
    const initialItems$ = this.fetchItems(this.pageSize, this.pageToken).pipe(
      map(response => {
        return response.studies;
      })
    );

    // Emit a new item every 5 seconds after the initial 10 items
    const additionalItems$ = timer(TIME_DELAY, TIME_DELAY).pipe(
      mergeMap(() => this.fetchItems(1, this.pageToken)),
      map(response => [response.studies?.[0]])
    );

    return merge(initialItems$, additionalItems$).pipe(
      scan((acc: Study[], curr: Study[]) => {
        if (acc.length >= 10) {
          acc.pop();
        }
        return [...curr, ...acc];
      }, [])
    );
  }

  fetchItems(pageSize: number, pageToken: string | null): Observable<Root> {
    const url = 'https://clinicaltrials.gov/api/v2/studies';
    const params = {
      pageSize: pageSize.toString(),
      fields: 'BriefTitle|OfficialTitle|StudyFirstSubmitDate',
      ...(pageToken ? { pageToken: pageToken || undefined } : {}),
    };

    this.loading$.next(true);
    return this.http.get<Root>(url, { params }).pipe(
      tap(res => {
        this.loading$.next(false);
        this.pageToken = res.nextPageToken;
      })
    );
  }
}
