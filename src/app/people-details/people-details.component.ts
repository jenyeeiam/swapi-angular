import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { Observable, map, forkJoin, switchMap, Subscription } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { CachingService } from '../services/caching.service';
import { MatChipsModule } from '@angular/material/chips';
import { DetailedPerson, People, Film, FilmResponse, Response } from '../models';

@Component({
  selector: 'app-people-details',
  standalone: true,
  imports: [MatCardModule,
    MatDividerModule, CommonModule, RouterLink],
  templateUrl: './people-details.component.html',
  styleUrl: './people-details.component.scss'
})
export class PeopleDetailsComponent implements OnInit, OnDestroy {
  person$: Observable<DetailedPerson> = new Observable<DetailedPerson>();
  peopleMap: Map<string, People> = new Map<string, People>();
  filmsMap: Map<string, Film> = new Map<string, Film>();
  subscriptions: Subscription = new Subscription();

  constructor(private cachingService: CachingService, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.person$ = this.route.paramMap.pipe(switchMap(params => {
      const id = params.get('id');
      return this.cachingService.fetchData(`https://www.swapi.tech/api/people/${id}`).pipe(
        map((data: any) => data.result)
      );
    }))
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
