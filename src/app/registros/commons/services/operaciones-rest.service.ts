import { Injectable } from "@angular/core";
import { Character } from "../interfaces/characters.interface";
import { Observable, catchError, delay, lastValueFrom, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class OperacionesRest {

    constructor( private http: HttpClient) {}
    

    initValues(): Promise<Character> {

        const url = 'https://rickandmortyapi.com/api'
    
        const peticionRest: Observable<Character> = this.http.get<Character>(`${url}/character`);
    
        console.log('peticionRest', peticionRest)
    
        return lastValueFrom(peticionRest.pipe(
          catchError(error => {
            console.warn('Error en la petición HTTP:', error);
            return throwError(() => error);
          }),
          delay(2000)
          ) ) // caso promesa
        // return peticionRest; // caso observable
    
      }

}