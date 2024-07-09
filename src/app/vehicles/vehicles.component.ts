import { Component, OnInit, OnDestroy } from '@angular/core';
import { CachingService } from '../services/caching.service';
import { map, tap, BehaviorSubject, Subscription } from 'rxjs';
import { VehicleJson, FilmResponse } from '../models'
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import detailedVehicleData from '../data/detailed_vehicles.json';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [RouterLink, MatCardModule, CommonModule, MatButtonModule, MatChipsModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent implements OnInit, OnDestroy {
  detailedVehicles$ = new BehaviorSubject<VehicleJson[]>(detailedVehicleData);
  subscriptions: Subscription = new Subscription();

  constructor(private cachingService: CachingService) { }

  ngOnInit(): void {
    this.loadFilms();
  }

  loadFilms(): void {
    const url = 'https://swapi.tech/api/films/';

    this.subscriptions.add(
      this.cachingService.fetchData(url).pipe(
        map((data: FilmResponse) => data.result),
        tap(films => {
          const updatedDetailedVehicles = this.detailedVehicles$.value.map(vehicle => {
            const vehicleUrl = vehicle.properties.url;
            const updatedFilms = films.filter(film =>
              (film.properties.vehicles as string[]).includes(vehicleUrl)
            ).map(film => ({
              name: film.properties.title,
              uid: film.uid.toString()
            }));

            return {
              ...vehicle,
              filmsMetaData: [...(vehicle.filmsMetaData || []), ...updatedFilms]
            };
          });

          this.detailedVehicles$.next(updatedDetailedVehicles);
        })
      ).subscribe()
    );
  }

  getAvatarUrl(id: string): string {
    return `https://robohash.org/${id}?set=set2&size=50x50`;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
