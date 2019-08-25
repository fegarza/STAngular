import { NgModule } from '@angular/core';
 
import {
  MatDatepickerModule,
  MatInputModule,
  MatButtonModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatSelectModule,
  MatRadioModule,
  MatDividerModule,
  MatTabsModule,
  MatSliderModule
} from '@angular/material';  
 
const Componentes =  [
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatRadioModule,
  MatSliderModule,
  MatDividerModule,
  MatTabsModule
];


@NgModule({
  imports: [
    Componentes
  ],
  exports: [
    Componentes
  ] 
 
})
export class MaterialModule { }
