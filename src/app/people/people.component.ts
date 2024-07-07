import { Component, OnInit } from '@angular/core';
import { CachingService } from '../services/caching.service';
import { Observable, map, tap } from 'rxjs';
import { People } from '../models'
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-people',
  standalone: true,
  imports: [RouterLink, MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent implements OnInit {
  people$: Observable<People[]> = new Observable<People[]>();

  constructor(private cachingService: CachingService) { }

  ngOnInit(): void {
    this.people$ = this.cachingService.fetchData('https://www.swapi.tech/api/people?page=1&limit=100').pipe(
      map((data: any) => data.results),
    );
  }
}