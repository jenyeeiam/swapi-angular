export interface People {
    uid: number;
    name: string;
    url: string;
}

export interface Vehicle {
    uid: number;
    name: string;
    url: string;
}

export interface Film {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    description: string;
    producer: string;
    release_date: string;
    url: string;
    properties: {
        characters: People[];
        vehicles: Vehicle[];
    }
}

export interface FilmResponse {
    message: string;
    result: Film[];
}