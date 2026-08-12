/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IihComponent } from './iih.component';

describe('IihComponent', () => {
  let component: IihComponent;
  let fixture: ComponentFixture<IihComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IihComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IihComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
