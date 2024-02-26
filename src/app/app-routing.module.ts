import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'registros',
    loadChildren: () => import('./registros/registros.module').then( m => m.RegistrosModule ),
  },
  {
    path: '**',
    redirectTo: 'registros',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
