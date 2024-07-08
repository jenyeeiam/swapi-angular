import { Component, OnInit } from '@angular/core';
import { CachingService } from '../services/caching.service';
import { Observable, map, tap } from 'rxjs';
import { Vehicle } from '../models'
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [RouterLink, MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent implements OnInit {
  vehicles$: Observable<Vehicle[]> = new Observable<Vehicle[]>();

  constructor(private cachingService: CachingService) { }

  ngOnInit(): void {
    this.vehicles$ = this.cachingService.fetchData('https://www.swapi.tech/api/vehicles?page=1&limit=100').pipe(
      map((data: any) => data.results),
    );
  }

  getAvatarUrl(id: number): string {
    return `https://robohash.org/${id}?set=set2&size=50x50`;
  }
}
