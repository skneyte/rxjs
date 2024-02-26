import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-siguiente',
  templateUrl: './siguiente.component.html',
  styleUrl: './siguiente.component.scss'
})
export class SiguienteComponent {

  constructor(private router: Router){

  }

  backPage(){
    this.router.navigate(['/registros/registro-padre'])
  }
}
