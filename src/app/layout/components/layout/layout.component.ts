import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.sass']
})
export class LayoutComponent implements OnInit {

  public bg = "red";
  public value =  15;

  onInputChange(event: MatSliderChange) {
    console.log("This is emitted as the thumb slides");
    console.log(event.value);
    this.value = event.value;
    
  }
  constructor() { }

  ngOnInit() {
  }

}
