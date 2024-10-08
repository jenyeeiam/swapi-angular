import { Component, OnDestroy, OnInit } from '@angular/core';
import { CachingService } from '../services/caching.service';
import { Observable, map, tap, Subscription, BehaviorSubject } from 'rxjs';
import { People, DetailedPerson, FilmResponse, Film } from '../models'
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import detailedPeopleData from '../data/detailed_people.json'

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [RouterLink, MatCardModule, CommonModule, MatButtonModule, MatChipsModule],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent implements OnInit, OnDestroy {
  people$: Observable<People[]> = new Observable<People[]>();
  detailedPeople$: BehaviorSubject<DetailedPerson[]> = new BehaviorSubject<DetailedPerson[]>(detailedPeopleData);
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
        map((films: any[]) => {
          return films.map(film => {
            const characterUrls = [...film.properties.characters];
            const vehicleUrls = [...film.properties.vehicles];
            //Create a proper Film Object
            return {
              ...film,
              properties: {
                ...film.properties,
                vehicleUrls,
                characterUrls,
                people: [],
                vehicles: []
              }
            }
          });
        }),
        tap((films: Film[]) => {
          const updatedDetailedPeople = this.detailedPeople$.value.map(character => {
            // Find the films the character is in
            const characterUrl = character.properties.url;
            const filmsCharacterIsIn = films.filter(film =>
              (film.properties.characterUrls).includes(characterUrl)
            ).map(film => ({
              name: film.properties.title,
              uid: film.uid.toString()
            }));

            return {
              ...character,
              films: [...(character.films || []), ...filmsCharacterIsIn]
            };
          });

          this.detailedPeople$.next(updatedDetailedPeople);
        })
      ).subscribe()
    );
  }

  getAvatarUrl(id: string | number): string {
    return `https://robohash.org/${id}?set=set2&size=50x50`;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}