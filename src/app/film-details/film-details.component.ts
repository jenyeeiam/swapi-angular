import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map, tap } from 'rxjs';
import { CachingService } from '../services/caching.service';

interface Film {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  description: string;
  producer: string;
  release_date: string;
  url: string;

}

@Component({
  selector: 'app-film-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './film-details.component.html',
  styleUrl: './film-details.component.scss'
})
export class FilmDetailsComponent implements OnInit {
  film$: Observable<Film> = new Observable<Film>();

  constructor(private cachingService: CachingService) { }

  ngOnInit(): void {
  }

  loadFilmDetails(): void {
    const url = 'https://swapi.dev/api/films/';
  }

}
