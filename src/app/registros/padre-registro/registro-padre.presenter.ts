import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, interval, of, take, takeUntil, tap } from "rxjs";

@Injectable()
export class RegistroPadrePresenter implements OnDestroy{
  public form: FormGroup;
  public formExtra: FormGroup;  
  public subscribeExtraName;


  private listSubscribers = [];
  private unsubscribe: Subject<void>;
  private countCheck: Subject<number>;
  private count: number = 0;
  
  constructor(private fb: FormBuilder) {
    this.unsubscribe = new Subject();
    this.countCheck = new Subject();
    this.initForm();
    this.disableExtraValuesControls();
    this.disableExtraNameControls();
    this.subsribeExtraValues();

    this.susbscribeTiempoTotal();
    
    this.countCheck.subscribe(
      val => console.log('valor del contador', val)
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();

    

    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  initForm() {
      this.form = this.fb.group({
          codeId: ['', [Validators.required, Validators.minLength(3)]],
          name: ['', [ Validators.required, Validators.minLength(3) ]]
        });
      this.formExtra = this.fb.group({
        extraValues: [false, [Validators.required]],
        extraName: [false, [Validators.required]],
        lastname: ['', [ Validators.required, Validators.minLength(3) ]],
        mothername: ['', [ Validators.required, Validators.minLength(3) ]],
        nacionality: ['', [ Validators.required, Validators.minLength(3) ]],
        countryStopover: ['', [ Validators.required, Validators.minLength(3) ]],
      })
  }

  public enableExtraValuesControls() {
    this.formExtra.get('lastname').enable();
    this.formExtra.get('mothername').enable();
    this.formExtra.get('extraName').enable();
  }
  public disableExtraValuesControls() {
    this.formExtra.get('lastname').disable();
    this.formExtra.get('mothername').disable();
    this.formExtra.get('extraName').disable();
  }  
  public resetExtraValuesControls() {
    this.formExtra.get('lastname').reset('');
    this.formExtra.get('mothername').reset('');
    this.formExtra.get('extraName').reset(false);
  }

  public enableExtraNameControls() {
    this.formExtra.get('nacionality').enable();
    this.formExtra.get('countryStopover').enable();
  }
  public disableExtraNameControls() {
    this.formExtra.get('nacionality').disable();
    this.formExtra.get('countryStopover').disable();
  }  
  public resetExtraNameControls() {
    this.formExtra.get('nacionality').reset('');
    this.formExtra.get('countryStopover').reset('');
  }
    
  // *************************************************

  // Caso 1: problema que complete() termina el observable
  // Solucion: quitarle el this.unsubscribe.complete() en subsribeExtraValues()
  // Caso 2: problema que this.unsubscribe next() termina todos los subscribes
  // solucion quitarle takeuntil al susbscribeTiempoTotal()
  //          agregar subscricion a la lista de subscribe y esta se desubscribe en el ngOnDestroy()
  // private subsribeExtraValues(): void {
  //   this.formExtra.get('extraValues').valueChanges.pipe(
  //     tap( val => console.log('extraValues', val)),
  //   ).subscribe(hasExtraValues => {
  //     if(hasExtraValues) {
  //       this.enableExtraValuesControls();
  //       this.enableExtraNameControls();
  //       this.subsribeExtraName();
  //       this.susbscribeTiempoCheck();
  //     } else {
  //       this.unsubscribe.next();
  //       this.unsubscribe.complete(); // caso 1
  //       this.resetExtraValuesControls();
  //       this.disableExtraValuesControls();
  //       this.resetExtraNameControls();
  //       this.disableExtraNameControls();
  //       this.unsubscribe = new Subject(); // bonus
  //     }
  //   });
  // }

  // private subsribeExtraName(): void {
  //   this.subscribeExtraName = this.formExtra.get('extraName').valueChanges.pipe(
  //     tap( val => console.log('extraName',val)),
  //     takeUntil(this.unsubscribe)
  //   ).subscribe(hasExtraName => {
  //     if(hasExtraName) {;
  //       this.formExtra.get('nacionality').setValue('Peruana');
  //       this.formExtra.get('countryStopover').reset();
  //       this.disableExtraNameControls();
  //     } else {
  //       this.formExtra.get('nacionality').reset();
  //       this.enableExtraNameControls();
  //     }
  //   });
    
  // }

  // private susbscribeTiempoTotal() {

  //   const intervalo$ = new Observable<number>(
  //     subscriber => {
  //       let count = 0;

  //       setInterval( () => {
  //         count++;
  //         subscriber.next( count );
  //       }, 1000);
  //     });

      

  //     const subsTiempoTotal = intervalo$.pipe(
  //       takeUntil(this.unsubscribe) // caso 2
  //     ).subscribe( num => console.log( 'tiempo total en la pagina', num));

  //     this.listSubscribers.push(subsTiempoTotal); // caso 2
     
  // }

  // private susbscribeTiempoCheck() {

  //   const intervalo$ = new Observable<number>(
  //     subscriber => {
  //       let count = 0;

  //       setInterval( () => {
  //         count++;
  //         subscriber.next( count );
  //       }, 1000);
  //     });

  //     const subsTiempoCheck = intervalo$.pipe(
  //       takeUntil(this.unsubscribe)
  //     ).subscribe( num => console.log( 'tiempo desde que le dio el check', num));
     
  // }
    

  // *********************************************************

  //Caso 3: Crear un observable usando operadores
  //Solucion: implementar interval()
  private subsribeExtraValues(): void {
    this.formExtra.get('extraValues').valueChanges.pipe(
      tap( val => console.log('extraValues', val)),
    ).subscribe(hasExtraValues => {
      this.countCheck.next(this.count = this.count + 1);
      if(hasExtraValues) {
        this.enableExtraValuesControls();
        this.enableExtraNameControls();
        this.subsribeExtraName();
        this.susbscribeTiempoCheck();
      } else {
        this.unsubscribe.next();

        this.resetExtraValuesControls();
        this.disableExtraValuesControls();
        this.resetExtraNameControls();
        this.disableExtraNameControls();
      }
    });
  }

  private subsribeExtraName(): void {
    this.subscribeExtraName = this.formExtra.get('extraName').valueChanges.pipe(
      tap( val => console.log('extraName',val)),
      takeUntil(this.unsubscribe)
    ).subscribe(hasExtraName => {
      if(hasExtraName) {;
        this.formExtra.get('nacionality').setValue('Peruana');
        this.formExtra.get('countryStopover').reset();
        this.disableExtraNameControls();
      } else {
        this.formExtra.get('nacionality').reset();
        this.enableExtraNameControls();
      }
    });    
  }

  private susbscribeTiempoTotal() {

    const intervalo$ = new Observable<number>(
      subscriber => {
        let count = 0;

        setInterval( () => {
          count++;
          subscriber.next( count );
        }, 1000);
      });

    // const intervalo$ = interval(1000); // case 3
      

      const subsTiempoTotal = intervalo$.pipe(
        // takeUntil(this.unsubscribe)
      ).subscribe( num => console.log( 'tiempo total en la pagina', num));

      this.listSubscribers.push(subsTiempoTotal);
     
  }

  private susbscribeTiempoCheck() {

    const intervalo$ = new Observable<number>(
      subscriber => {
        let count = 0;

        setInterval( () => {
          count++;
          subscriber.next( count );
        }, 1000);
      });

      const subsTiempoCheck = intervalo$.pipe(
        takeUntil(this.unsubscribe)
      ).subscribe( num => console.log( 'tiempo desde que le dio el check', num));
     
  }

}