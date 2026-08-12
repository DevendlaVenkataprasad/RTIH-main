import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidbi } from './sidbi';

describe('Sidbi', () => {
  let component: Sidbi;
  let fixture: ComponentFixture<Sidbi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidbi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sidbi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
