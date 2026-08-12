import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Innotribe } from './innotribe';

describe('Innotribe', () => {
  let component: Innotribe;
  let fixture: ComponentFixture<Innotribe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Innotribe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Innotribe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
