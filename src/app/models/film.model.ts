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
    uid: number;
    description: string;
    properties: {
        characterUrls: string[];
        vehicleUrls: string[];
        people: People[];
        vehicles: Vehicle[];
        title: string;
        episode_id: number;
        opening_crawl: string;
        director: string;
        producer: string;
        release_date: string;
        url: string;
    }
}

export interface FilmResponse {
    message: string;
    result: Film[];
}