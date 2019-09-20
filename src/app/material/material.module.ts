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
  MatSliderModule,
  MatSortModule,
  MatTableModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatCheckboxModule
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
  MatTabsModule,
  MatSortModule,
  MatTableModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatCheckboxModule
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
