import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, forkJoin, switchMap, Subscription } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { CachingService } from '../services/caching.service';
import { MatChipsModule } from '@angular/material/chips';
import { Vehicle, People, DetailedFilm, Response } from '../models';

@Component({
  selector: 'app-film-details',
  standalone: true,
  imports: [MatCardModule,
    MatDividerModule,
    MatExpansionModule, MatIconModule, MatChipsModule, CommonModule, RouterLink],
  templateUrl: './film-details.component.html',
  styleUrl: '../people-details/people-details.component.scss'
})
export class FilmDetailsComponent implements OnInit {
  film$: Observable<DetailedFilm> = new Observable<DetailedFilm>();
  peopleMap: Map<string, People> = new Map<string, People>();
  vehiclesMap: Map<string, Vehicle> = new Map<string, Vehicle>();
  subscriptions: Subscription = new Subscription();

  constructor(private cachingService: CachingService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.loadPeopleAndVehicles().subscribe(() => {
        this.loadFilmDetails();
      })
    )
  }

  loadFilmDetails(): void {
    this.film$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.cachingService.fetchData(`https://www.swapi.tech/api/films/${id}`).pipe(
          map((data: any) => data.result),
          map((film: DetailedFilm) => {
            const newFilm = {
              description: film.description,
              uid: film.uid,
              properties: {
                ...film.properties,
                vehicles: film.properties.vehicles.map((url: any) => this.vehiclesMap.get(url) as Vehicle),
                characters: film.properties.characters.map((url: any) => this.peopleMap.get(url) as People)
              }
            }
            return newFilm;
          })
        );
      })
    )
  }

  loadPeopleAndVehicles(): Observable<[People[], Vehicle[]]> {
    const vehiclesUrl = 'https://www.swapi.tech/api/vehicles?page=1&limit=100';
    const peopleUrl = 'https://www.swapi.tech/api/people?page=1&limit=100';

    const vehicles$ = this.cachingService.fetchData(vehiclesUrl).pipe(
      map((data: Response) => data.results),
    );

    const people$ = this.cachingService.fetchData(peopleUrl).pipe(
      map((data: Response) => data.results),
    );

    return forkJoin([vehicles$, people$]).pipe(
      map(([vehicles, people]) => {
        this.vehiclesMap = new Map(vehicles.map(vehicle => [vehicle.url, vehicle]));
        this.peopleMap = new Map(people.map(person => [person.url, person]));
        return [vehicles, people];
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
