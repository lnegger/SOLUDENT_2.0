import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteCitas } from './paciente-citas';

describe('PacienteCitas', () => {
  let component: PacienteCitas;
  let fixture: ComponentFixture<PacienteCitas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteCitas],
    }).compileComponents();

    fixture = TestBed.createComponent(PacienteCitas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
