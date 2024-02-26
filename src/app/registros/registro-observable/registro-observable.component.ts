import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registro-observable',
  templateUrl: './registro-observable.component.html',
  styleUrl: './registro-observable.component.scss'
})
export class RegistroObservableComponent implements OnInit {
  
  @Input() public registroForm: FormGroup;
  @Input() public valoresIniciales: Array<string>;
  @Input() public loading: boolean;

  constructor() {
    console.log('constructor RegistroObservableComponent')
  }

  ngOnInit(): void {
    console.log('oninit RegistroObservableComponent')
  }

  getFieldError( field: string ): string | null {

    if ( !this.registroForm.controls[field] ) return null;

    const errors = this.registroForm.controls[field].errors || {};

    for (const key of Object.keys(errors) ) {
      switch( key ) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo ${ errors['minlength'].requiredLength } caracters.`;
      }
    }

    return null;
  }

  isValidField( field: string ): boolean | null {
    return this.registroForm.controls[field].errors
      && this.registroForm.controls[field].touched;
  }

  // isCheck(value) {
  //   console.log(value.target.checked)

  //   if(value.target.checked){
  //     this.registroForm.enableExtraValuesControls()
  //   } else {
  //     this.registroForm.resetExtraValuesControls()
  //     this.registroForm.disableExtraValuesControls()
  //   }
  // }

  onSubmit():void {

    if ( this.registroForm.invalid ) {
      this.registroForm.markAllAsTouched();
      return;
    }

    console.log(this.registroForm.value);
    // (this.registroForm.controls['favoriteGames'] as FormArray ) = this.fb.array([]);
    this.registroForm.reset({name: 'a', extraValues: false, lastname: '', mothername: '' });


  }

}
