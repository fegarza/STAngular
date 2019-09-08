import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanalizacionesComponent } from './canalizaciones.component';

describe('CanalizacionesComponent', () => {
  let component: CanalizacionesComponent;
  let fixture: ComponentFixture<CanalizacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanalizacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanalizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
