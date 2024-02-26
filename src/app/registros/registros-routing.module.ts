import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroPadreComponent } from './padre-registro/registro-padre.component';
import { RegistroComponent } from './registro/registro.component';
import { SiguienteComponent } from './siguiente/siguiente.component';
import { PeticionesComponent } from './peticiones/peticiones.component';


const routes: Routes = [
    {
      path: '',
      children: [
        { path: 'registro-padre', component: RegistroPadreComponent },
        { path: 'registro', component: RegistroComponent },
        { path: 'siguiente', component: SiguienteComponent },
        { path: 'peticiones', component: PeticionesComponent },
        { path: '**', redirectTo: 'basic' },
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrosRoutingModule { }
