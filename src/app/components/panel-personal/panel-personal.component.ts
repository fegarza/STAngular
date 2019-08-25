import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-panel-personal',
  templateUrl: './panel-personal.component.html',
  styleUrls: ['./panel-personal.component.sass']
})
export class PanelPersonalComponent implements OnInit {
  public id: number;
  private sub: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];  
    });
  }

}
