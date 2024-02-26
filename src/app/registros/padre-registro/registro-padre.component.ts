import { Component } from '@angular/core';
import { RegistroPadrePresenter } from './registro-padre.presenter';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro-padre',
  templateUrl: './registro-padre.component.html',
  styleUrl: './registro-padre.component.scss',
  providers: [RegistroPadrePresenter]
})
export class RegistroPadreComponent {

  public formularioHijo: FormGroup;
  public seccondForm: boolean = false;

  constructor( 
    public registroPadrePresenter: RegistroPadrePresenter, 
    private router: Router,
    ) {
    this.formularioHijo = registroPadrePresenter.formExtra;
    console.log('constructor RegistroPadreComponent')
  }

  getFieldError( field: string ): string | null { 
    if ( !this.registroPadrePresenter.form.controls[field] ) return null;

    const errors = this.registroPadrePresenter.form.controls[field].errors || {};

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
    return this.registroPadrePresenter.form.controls[field].errors
      && this.registroPadrePresenter.form.controls[field].touched;
  }

  nextPage(): void {
    console.log('me presionaste')
    this.seccondForm = true;
    this.router.navigate(['/registros/siguiente'])
    
  }

  onSubmit():void {

    if ( this.registroPadrePresenter.form.invalid || this.registroPadrePresenter.formExtra.invalid) {
      this.registroPadrePresenter.form.markAllAsTouched();
      this.registroPadrePresenter.formExtra.markAllAsTouched();
      return;
    }

    console.log(this.registroPadrePresenter.form.value);
    console.log(this.registroPadrePresenter.formExtra.value);
    this.registroPadrePresenter.form.reset({codeId: '', name: 'a' });
    this.registroPadrePresenter.formExtra.reset({ extraValues: false, lastname: '', mothername: '', extraName: false, nacionality: ''});


  }

}