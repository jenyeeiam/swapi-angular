import { Component, OnInit, OnDestroy } from '@angular/core';
import { CachingService } from '../services/caching.service';
import { RouterLink } from '@angular/router';
import { Observable, map, forkJoin, tap, Subscription } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { People, Film, Vehicle, FilmResponse, Response } from '../models'
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-films',
  standalone: true,
  imports: [MatChipsModule, MatCardModule, MatDividerModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './films.component.html',
  styleUrl: './films.component.scss'
})
export class FilmsComponent implements OnInit, OnDestroy {
  films$: Observable<Film[]> = new Observable<Film[]>();
  vehicles$: Observable<Vehicle[]> = new Observable<Vehicle[]>();
  people$: Observable<People[]> = new Observable<People[]>();
  vehiclesMap: Map<string, Vehicle> = new Map<string, Vehicle>();
  peopleMap: Map<string, People> = new Map<string, People>();
  subscriptions = new Subscription();

  constructor(private cachingService: CachingService) { }

  ngOnInit() {
    this.subscriptions.add(this.loadVehiclesAndPeople().subscribe(() => {
      this.loadFilms();
    }));
  }

  loadVehiclesAndPeople(): Observable<[Vehicle[], People[]]> {
    const vehiclesUrl = 'https://www.swapi.tech/api/vehicles?page=1&limit=100';
    const peopleUrl = 'https://www.swapi.tech/api/people?page=1&limit=100';

    const vehicles$ = this.cachingService.fetchData(vehiclesUrl).pipe(
      map((data: Response) => data.results),
      tap(vehicles => console.log({ vehicles })),
    );

    const people$ = this.cachingService.fetchData(peopleUrl).pipe(
      map((data: Response) => data.results),
      tap(people => console.log({ people })),
    );

    return forkJoin([vehicles$, people$]).pipe(
      map(([vehicles, people]) => {
        this.vehiclesMap = new Map(vehicles.map(vehicle => [vehicle.url, vehicle]));
        this.peopleMap = new Map(people.map(person => [person.url, person]));
        return [vehicles, people];
      })
    );
  }

  loadFilms(): void {
    const url = 'https://swapi.tech/api/films/';
    this.films$ = this.cachingService.fetchData(url).pipe(
      map((data: FilmResponse) => data.result),
      tap(films => console.log({ films })),
      map(films => films.map(film => this.mapFilmCharactersAndVehicles(film)))
    );
  }

  mapFilmCharactersAndVehicles(film: any): Film {
    const newFilm = {
      ...film,
      properties: {
        characters: film.properties.characters.map((url: string) => this.peopleMap.get(url) as People),
        vehicles: film.properties.vehicles.map((url: string) => this.vehiclesMap.get(url) as Vehicle)
      }
    };
    return newFilm as Film;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
