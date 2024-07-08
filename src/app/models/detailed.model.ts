import { Film, People, Vehicle } from './film.model';

export interface DetailedPerson {
    properties: {
        height: string;
        mass: string;
        hair_color: string;
        skin_color: string;
        eye_color: string;
        birth_year: string;
        gender: string;
        name: string;
        homeworld: string;
    },
    description: string;
    uid: number;
}

export interface DetailedVehicle {
    properties: {
        model: string;
        vehicle_class: string;
        manufacturer: string;
        cost_in_credits: string;
        length: string;
        crew: string;
        passengers: string;
        max_atmosphering_speed: string;
        cargo_capacity: string;
        consumables: string;
        films: Film[];
        pilots: People[];
        created: string;
        edited: string;
        name: string;
        url: string;
    },
    description: string;
    uid: number;
}

export interface DetailedFilm {
    properties: {
        characters: People[];
        planets: string[];
        starships: string[];
        vehicles: Vehicle[];
        species: string[];
        created: string;
        edited: string;
        producer: string;
        title: string;
        episode_id: number;
        director: string;
        release_date: string;
        opening_crawl: string;
        url: string;
    }
    description: string;
    uid: number;
}
