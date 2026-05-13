import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaGlobal } from './agenda-global';

describe('AgendaGlobal', () => {
  let component: AgendaGlobal;
  let fixture: ComponentFixture<AgendaGlobal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaGlobal],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaGlobal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
