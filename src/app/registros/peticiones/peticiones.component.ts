import { Component, OnInit } from '@angular/core';
import { AsyncSubject, BehaviorSubject, Observable, Subject, concat, from, fromEvent, interval, of, range, zip, lastValueFrom, throwError, firstValueFrom, ReplaySubject  } from 'rxjs';
import { catchError, concatMap, delay, filter, map, mergeMap, retry, share, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Character } from '../commons/interfaces/character.interface';
import { CharacterAnidado, CharacterAnidadoPersonalizado } from '../commons/interfaces/character-anidado.interface';
import { Origen } from '../commons/interfaces/origen.interface';
import { Characters } from '../commons/interfaces/characters.interface';

@Component({
  selector: 'app-peticiones',
  templateUrl: './peticiones.component.html',
  styleUrl: './peticiones.component.scss'
})
export class PeticionesComponent implements OnInit {
  
  public valoresIniciales;
  public valorFinal: CharacterAnidadoPersonalizado;

  private unsubscribe: Subject<void> = new Subject();

  private dataCache: Subject<Origen> = new Subject();
  private dataCacheBehaviorSubject : BehaviorSubject <Origen>;
  private dataCacheBehaviorAsyncSubject : AsyncSubject <Origen>;
  private dataCacheReplaySubject: ReplaySubject <Origen>;

  private replaySubject: ReplaySubject <number>;

  constructor(
    private http: HttpClient 
    ){
      
      // documentacion
      // const clicks = fromEvent(document, 'click');
      // const result = clicks.pipe(switchMap(() => interval(1000)));
      // result.subscribe(x => console.log(x));

      //console.log('existo?', this.dataCache)
      // const dataCache = this.dataCache.asObservable();
      // dataCache.subscribe( val => console.log('dataCache', val))

      // this.dataCache.subscribe( val => console.log(`%cthis dataCache ${val.dimension}`, 'color: orange; font-weight: bold;'));

      const defaultDataCahe = {
        id:        null,
        name:      null,
        type:      null,
        dimension: null,
        residents: null,
        url:       null,
        created:   null,
      };
  
      // this.dataCacheBehaviorSubject = new BehaviorSubject(defaultDataCahe);
      // this.dataCacheBehaviorAsyncSubject = new AsyncSubject();

      // this.dataCacheBehaviorAsyncSubject.subscribe(
      //   val => console.log(`%c ${val.dimension}`, 'color: green; font-weight: bold;')
      // )

     // this.replaySubject = new Subject();
    
    }


  async ngOnInit() {
    console.log('oninit RegistroPadreComponent')



    // // caso switchmap y mergemap
    // //const intervalo$ = interval(10000).pipe(startWith(0)); caso starWith emite 0 0 1 2 3 4 5...
    // //const intervalo$ = concat(of(1), interval(1000)); //caso concat emite 1 0 1 2 3 4...
    // const intervalo$ = interval(10000).pipe(
    //   startWith(-1),
    //   map( val => val + 2)
    //   ); // 1 2 3 4 5 6 ...

    // intervalo$.pipe(
    //   takeUntil(this.unsubscribe),
    //   tap( val => console.log(`%cvalor interval 1: ${val}`, 'color: orange; font-weight: bold;')),
    //   take(3),
    //   switchMap( ( _ ) => {
 
    //       return interval(4000).pipe(
    //         map( val => val + 3),
    //         tap( val => console.log(`%cvalor interval 2: ${val}`, 'color: green; font-weight: bold;')),
    //         takeUntil(this.unsubscribe),
    //         take(3),
    //         switchMap( ( characterNumber ) => {
    //           return this.restRickyAndMorty(characterNumber).pipe(
    //             takeUntil(this.unsubscribe),
    //             tap( resp => console.log('antes del switchMap', resp)),
    //             delay(1000),
          
    //             switchMap( resp => { 
    //               // let getOrigen: Observable<Origen> | string;
    //               // if(resp.origin.url !== '') {
    //               //   getOrigen = this.http.get<Origen>(resp.origin.url).pipe(
    //               //     tap( resp => this.dataCache.next(resp)),
    //               //   )
    //               // } else {
    //               //   getOrigen = ''
    //               // }

    //               const getOrigen = this.http.get<Origen>(resp.origin.url).pipe(

    //                 catchError(error => {
    //                       console.warn('Error en la petición HTTP:', error);
    //                       return of({
    //                         id:        null,
    //                         name:      null,
    //                         type:      null,
    //                         dimension: null,
    //                         residents: null,
    //                         url:       null,
    //                         created:   null,
    //                         notFoundOrigin: true
    //                       });
    //                     }),

    //                 filter( resp => !resp.notFoundOrigin),

    //                 tap( resp => this.dataCache.next(resp)), // subject
    //                 // tap( resp => this.dataCacheBehaviorSubject.next(resp)), // behaviorSubject
    //                 // tap( resp => this.dataCacheBehaviorAsyncSubject.next(resp)), // AsyncSubject
    //               )

    //               return getOrigen
    //               })
    //             )},
    //         ))
            
    //   })
    // ).subscribe(
    //   val => {
    //     console.log('salida del subscribe', val)
    //   })    
  

      // caso observable
      this.restRickyAndMorty(1).pipe(
        tap( resp => console.log('antes del switchmap', resp)),
        delay(1000),
        //case especifico del switchmap
        // switchMap( resp => interval(1000).pipe(
        //   take(3)
        // ))
  
        switchMap( resp =>  this.http.get<Origen>(resp.origin.url) ),
  
        // caso: triple anidado
        tap( resp => console.log('antes del 2do switchmap', resp)),
        delay(1000),
        switchMap( resp => zip ( of(resp) ,this.http.get<any>(resp.residents[resp.residents.length -1])) ) ,
  
        // caso: map
        tap( resp => console.log('antes del map', resp) ),
        // delay(1000),
        map( ([caracter, origen]) => ({caracter, origen}) )
  
        ).subscribe(
        val => {
          console.log('salida del subscribe', val)
  
          // this.valorFinal = val;
  
        })  




    // caso promesa lastValueFrom
    // const restRickyAndMorty = await this.restRickyAndMortyAll();
    // console.log('peticionRest', restRickyAndMorty)
    // this.valoresIniciales = restRickyAndMorty.results.map( val => val.name )
    
    // console.log('peticionRest', this.valoresIniciales)

  }

  boton() {
    // console.log(this.valorFinal.filter( val => val.species)); //caso sin map

    //console.log(this.valorFinal ); // caso con map

    this.unsubscribe.next()

    // this.dataCacheBehaviorSubject.subscribe(
    //   val => console.log(val)
    // )


    // this.dataCache.subscribe(
    //   val => console.warn(val)
    // )
    // this.dataCache.subscribe(
    //   val => console.error(val)
    // )

   
  }

  boton2() {
    const defaultDataCahe = {
      id:        null,
      name:      null,
      type:      null,
      dimension: null,
      residents: null,
      url:       null,
      created:   null,
    };

    // this.dataCache.next(defaultDataCahe);
    // this.dataCacheBehaviorAsyncSubject.complete();
  }

  // Observer
  restRickyAndMorty(characterNumber): Observable<Character> {

    const url = 'https://rickandmortyapi.com/api';

    const peticionRest$: Observable<Character> = this.http.get<Character>(`${url}/character/${characterNumber}`);

    return peticionRest$; // caso observable

  }

  // Promesa
  restRickyAndMortyAll(): Promise<Characters> {

    const url = 'https://rickandmortyapi.com/api';

    // const intervalo$ = interval(1000).pipe(
    //   map( val => val + 1)
    // ); 

    // const peticionRest$: Observable<Characters> = intervalo$.pipe(
    //   delay(1000),
    //   switchMap( counter => this.http.get<Characters>(`${url}/character/${counter}`)),
    //   take(3)
    // )
    
    const peticionRest$: Observable<Characters> = this.http.get<Characters>(`${url}/character`)

    
    // return lastValueFrom(peticionRest$.pipe(
    //   catchError(error => {
    //     console.warn('Error en la petición HTTP:', error);
    //     return throwError(() => error);
    //   }),
    //   tap( ( resp ) => console.log(resp) ),
    //   delay(2000)
    //   ) ) // caso promesa

    return peticionRest$.pipe(
      delay(1000)
    ).toPromise();

  }
}
