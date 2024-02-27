import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, Subscription, interval, of, take, takeUntil, tap } from "rxjs";

@Injectable()
export class RegistroPadrePresenter implements OnDestroy{
  public form: FormGroup;
  public formExtra: FormGroup;  
  public subscribeIsPeruvian: Subscription;


  private listSubscribers: Array<Subscription> = [];
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

  // Caso 1: problema que complete() termina el observable(Subject)
  // Solucion: quitarle el this.unsubscribe.complete() en subsribeExtraValues()
  // Caso 2: problema que this.unsubscribe next() termina todos los subscribes
  // solucion quitarle takeuntil al susbscribeTiempoTotal()
  //          agregar subscricion a la lista de subscribe y esta se desubscribe en el ngOnDestroy()
  private subsribeExtraValues(): void {
    this.formExtra.get('extraValues').valueChanges.pipe(
      tap( val => console.log('extraValues', val)),
    ).subscribe(hasExtraValues => {
      if(hasExtraValues) {
        this.enableExtraValuesControls();
        this.enableExtraNameControls();
        this.subsribeIsPeruvian();
        // this.susbscribeTiempoCheck();
      } else {
        this.unsubscribe.next();
        this.unsubscribe.complete(); // caso 1
        // this.subscribeIsPeruvian.unsubscribe(); // caso 3
        this.resetExtraValuesControls();
        this.disableExtraValuesControls();
        this.resetExtraNameControls();
        this.disableExtraNameControls();
        // this.unsubscribe = new Subject(); // bonus
      }
    });
  }

  private subsribeIsPeruvian(): void {

    this.subscribeIsPeruvian = this.formExtra.get('extraName').valueChanges.pipe(
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

      

      const subsTiempoTotal: Subscription = intervalo$.pipe(
        takeUntil(this.unsubscribe) // caso 2
      ).subscribe( num => console.log( 'tiempo total en la pagina', num));

      this.listSubscribers.push(subsTiempoTotal); // caso 2
     
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

      const subsTiempoCheck: Subscription = intervalo$.pipe(
        takeUntil(this.unsubscribe)
      ).subscribe( num => console.log( 'tiempo desde que le dio el check', num));

      this.listSubscribers.push(subsTiempoCheck);
     
  }
  
}