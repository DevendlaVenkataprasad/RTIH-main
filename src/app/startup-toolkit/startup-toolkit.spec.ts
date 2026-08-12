import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupToolkit } from './startup-toolkit';

describe('StartupToolkit', () => {
  let component: StartupToolkit;
  let fixture: ComponentFixture<StartupToolkit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartupToolkit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartupToolkit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
