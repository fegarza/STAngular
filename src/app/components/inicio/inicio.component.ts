import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.sass']
})

export class InicioComponent implements OnInit {
 
  //Properties 
  Login: boolean = false;

  //Constructor
  constructor(){

  }
  Redirect(_url: string){
    window.location.href = _url;
  }
  //Methods
  ngOnInit() {
  }
  Mensaje(_tipo, _titulo:string ,_str:string, _footer:string){
    Swal.fire({
      type: _tipo,
      title: _titulo,
      text: _str,
      footer: _footer
    });
  }
  AbrirLogin(){
    this.Login ? this.Login = false : this.Login = true;  
  }
   
} 