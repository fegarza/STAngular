import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.sass']
})
export class InicioComponent implements OnInit {

  constructor() { }
 
  ngOnInit() {
  }
  Redireccionar(_url:string) {
    document.location.href = _url;
  }
  Mensaje(_tipo, _titulo:string ,_str:string, _footer:string) {
    Swal.fire({
      type: _tipo,
      title: _titulo,
      text: _str,
      footer: _footer
    }); 
    //  Swal.fire({
    //   type: 'error',
    //   title: 'Oops...',
    //   text: 'Something went wrong!',
    //   footer: '<a href>Why do I have this issue?</a>'
    // }); 
  } 
}
