import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'; 
import { ArchivoService } from '../../services/archivo.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.sass']
})

export class InicioComponent implements OnInit {
 
  //Properties 
  Login: boolean = false;
  loading: boolean = false;
  public tab: string =  'home';
  
  //Constructor
  constructor(private archivoService: ArchivoService){
    
  }
  Redirect(_url: string){
    window.location.href = _url;
  }
  //Methods
  ngOnInit() {
  }

  changeTab(_new: string){
    this.tab =  _new;
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
  
  AbrirRegistro(){
    this.tab = "registro";
    this.Login = false;
  }
  ScrollTutorias(){
    try 
    { 
     window.scrollTo({ left: 0, top: 570, behavior: 'smooth' });
     } catch (e) {
      window.scrollTo(0, 570);
      }
  }

} 
