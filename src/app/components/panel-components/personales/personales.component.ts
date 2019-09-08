import { Component, OnInit, ViewChild } from '@angular/core';
import { Personal } from 'src/app/models/models';
import { PersonalService } from 'src/app/services/personal.service';
import { refCount } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-personales',
  templateUrl: './personales.component.html',
  styleUrls: ['./personales.component.sass']
})
export class PersonalesComponent implements OnInit {


  personales: Array<Personal> = new Array<Personal>();
  dataSource = new MatTableDataSource(this.personales);
  displayedColumns: string[] = ['nombre', 'cargo', 'tutorados', 'ver'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(private personalService: PersonalService) 
  {
    
  }
  ngOnInit(){
    this.personalService.showAll().subscribe(
      r => { 
        if(r.code == 200){
          this.personales  = r.data as Array<Personal>;
          this.dataSource = new MatTableDataSource(this.personales);
          console.log("PERSONALES:");
          console.log(this.personales);
        }else{
          console.log("Error: \n");
          console.log(r.data);
        }
      }
   );
  }

}
