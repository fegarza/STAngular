import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.sass']
})
export class LayoutsComponent implements OnInit {

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
