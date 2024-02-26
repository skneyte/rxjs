import { Character } from "./character.interface";
import { Origen } from "./origen.interface";

export interface CharacterAnidado {
    id:         number;
    name:       string;
    status?:    string;
    species?:   string;
    type:       string;
    gender?:    string;
    origin?:    Location;
    location?:  Location;
    image?:     string;
    episode?:   string[];
    url:        string;
    created:    Date;
    dimension?: string;
    residents?: string[];
}

export interface Location {
    name: string;
    url:  string;
}


export interface CharacterAnidadoPersonalizado {
    caracter: Character;
    origen:   Origen;
}
