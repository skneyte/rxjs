import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Injectable()
export class RegistroPresenter {
    public form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.initForm();
    }

    initForm() {
        this.form = this.fb.group({
            name: ['', [ Validators.required, Validators.minLength(3) ]],
            lastname: ['', [ Validators.required, Validators.minLength(3) ]],
            mothername: ['', [ Validators.required, Validators.minLength(3) ]],
            extraValues: [false, [Validators.required]]
          });
    }

    public enableExtraValuesControls() {
        this.form.get('lastname').enable();
        this.form.get('mothername').enable();
      }
      public disableExtraValuesControls() {
        this.form.get('lastname').disable();
        this.form.get('mothername').disable();
      }  
      public resetExtraValuesControls() {
        this.form.get('lastname').reset('');
        this.form.get('mothername').reset('');
      }
    

}