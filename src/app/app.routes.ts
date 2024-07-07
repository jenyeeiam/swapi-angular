import { Routes } from '@angular/router';
import { FilmsComponent } from './films/films.component';
import { FilmDetailsComponent } from './film-details/film-details.component';
import { PeopleComponent } from './people/people.component';
import { PeopleDetailsComponent } from './people-details/people-details.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details.component';

export const routes: Routes = [
    { path: '', redirectTo: '/films', pathMatch: 'full' },
    { path: 'films', component: FilmsComponent },
    { path: 'films/:id', component: FilmDetailsComponent },
    { path: 'people', component: PeopleComponent },
    { path: 'people/:id', component: PeopleDetailsComponent },
    { path: 'vehicles', component: VehiclesComponent },
    { path: 'vehicles/:id', component: VehicleDetailsComponent },
    { path: '**', redirectTo: '/films' }
];
