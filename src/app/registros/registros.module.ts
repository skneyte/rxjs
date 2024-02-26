import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro/registro.component';
import { RegistroObservableComponent } from './registro-observable/registro-observable.component';
import { RegistroPadreComponent } from './padre-registro/registro-padre.component';
import { SiguienteComponent } from './siguiente/siguiente.component';
import { RegistrosRoutingModule } from './registros-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PeticionesComponent } from './peticiones/peticiones.component';



@NgModule({
  declarations: [
    RegistroComponent,
    RegistroObservableComponent,
    RegistroPadreComponent,
    SiguienteComponent,
    PeticionesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RegistrosRoutingModule,
    HttpClientModule
  ]
})
export class RegistrosModule { }
