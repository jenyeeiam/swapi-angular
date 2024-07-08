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
import { DetailedVehicle, People, Film, FilmResponse, Response } from '../models';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [MatCardModule,
    MatListModule,
    MatDividerModule,
    MatExpansionModule, MatChipsModule, CommonModule, RouterLink],
  templateUrl: './vehicle-details.component.html',
  styleUrl: '../people-details/people-details.component.scss'
})
export class VehicleDetailsComponent implements OnInit, OnDestroy {
  vehicle$: Observable<DetailedVehicle> = new Observable<DetailedVehicle>();
  peopleMap: Map<string, People> = new Map<string, People>();
  filmsMap: Map<string, Film> = new Map<string, Film>();
  subscriptions: Subscription = new Subscription();


  constructor(private cachingService: CachingService, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.loadFilmsAndPeople().subscribe(() => {
        this.loadVehicle();
      })
    )
  }

  loadFilmsAndPeople(): Observable<[Film[], People[]]> {
    const filmsUrl = 'https://www.swapi.tech/api/films/';
    const peopleUrl = 'https://www.swapi.tech/api/people?page=1&limit=100';

    const films$ = this.cachingService.fetchData(filmsUrl).pipe(
      map((data: FilmResponse) => data.result),
    );

    const people$ = this.cachingService.fetchData(peopleUrl).pipe(
      map((data: Response) => data.results),
    );

    return forkJoin([films$, people$]).pipe(
      map(([films, people]) => {
        this.filmsMap = new Map(films.map(film => [film.properties.url, film]));
        this.peopleMap = new Map(people.map(person => [person.url, person]));
        return [films, people];
      })
    );
  }

  loadVehicle(): void {
    this.vehicle$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.cachingService.fetchData(`https://www.swapi.tech/api/vehicles/${id}`);
      }),
      map((data: any) => data.result),
      map((vehicle: DetailedVehicle) => {
        const newVehicle = {
          description: vehicle.description,
          uid: vehicle.uid,
          properties: {
            ...vehicle.properties,
            pilots: vehicle.properties.pilots.map((url: any) => this.peopleMap.get(url) as People),
            films: vehicle.properties.films.map((url: any) => this.filmsMap.get(url) as Film),
          }
        }
        return newVehicle
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
