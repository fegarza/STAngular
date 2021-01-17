import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { Personal, Count } from 'src/app/models/models';
import { PersonalService } from 'src/app/services/personal.service';

@Component({
  selector: 'app-personales',
  templateUrl: './personales.component.html',
  styleUrls: ['./personales.component.sass']
})
export class PersonalesComponent implements OnInit {

  personales: Array<Personal> = new Array<Personal>();
  dataSource = new MatTableDataSource(this.personales);
  displayedColumns: string[] = ['nombre', 'cargo', 'tutorados', 'departamento'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
 // MatPaginator Inputs
 length = 100;
 pageSize = 10;
 pageSizeOptions: number[] = [10,20,30,40,50];

 // MatPaginator Output
 pageEvent: PageEvent;
 
  constructor(private personalService: PersonalService) 
  {
    
  }
  ngOnInit(){
    this.personalService.count().subscribe(r=>{
      if(r.code == 200){
        var c = r.data as Count;
        this.length = c.count;
        
      }
    });
    this.personalService.showAll().subscribe(
      r => { 
        if(r.code == 200){
          this.personales  = r.data as Array<Personal>;
          
          this.dataSource = new MatTableDataSource(this.personales);
          this.dataSource.sort = this.sort

         
        }else{
          console.log("Error: \n");
          console.log(r.data);
        }
      }
   );
  }
  mostrarPersonales( event?:PageEvent ){
    this.personalService.getPage(event.pageSize, (event.pageIndex+1)).subscribe(r=>{
      if(r.code == 200){
        this.personales = r.data as Array<Personal>;
        this.dataSource = new MatTableDataSource(this.personales);
        this.dataSource.sort = this.sort;
      }
    });
    return event;
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}