import { Component } from '@angular/core';
import { RegistroPresenter } from './registro.presenter';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
  providers: [RegistroPresenter]
})
export class RegistroComponent {

  constructor( public registroPresenter: RegistroPresenter ) {}

  getFieldError( field: string ): string | null {

    if ( !this.registroPresenter.form.controls[field] ) return null;

    const errors = this.registroPresenter.form.controls[field].errors || {};

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
    return this.registroPresenter.form.controls[field].errors
      && this.registroPresenter.form.controls[field].touched;
  }

  isCheck(value) {
    console.log(value.target.checked)

    if(value.target.checked){
      this.registroPresenter.enableExtraValuesControls()
    } else {
      this.registroPresenter.resetExtraValuesControls()
      this.registroPresenter.disableExtraValuesControls()
    }
  }

  onSubmit():void {

    if ( this.registroPresenter.form.invalid ) {
      this.registroPresenter.form.markAllAsTouched();
      return;
    }

    console.log(this.registroPresenter.form.value);
    // (this.registroPresenter.form.controls['favoriteGames'] as FormArray ) = this.fb.array([]);
    this.registroPresenter.form.reset({name: 'a', extraValues: false, lastname: '', mothername: '' });


  }

}
