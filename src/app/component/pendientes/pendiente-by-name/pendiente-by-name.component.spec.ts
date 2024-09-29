import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendienteByNameComponent } from './pendiente-by-name.component';

describe('PendienteByNameComponent', () => {
  let component: PendienteByNameComponent;
  let fixture: ComponentFixture<PendienteByNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendienteByNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendienteByNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
