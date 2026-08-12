/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RtihOutpostModelComponent } from './rtih-outpost-model.component';

describe('RtihOutpostModelComponent', () => {
  let component: RtihOutpostModelComponent;
  let fixture: ComponentFixture<RtihOutpostModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtihOutpostModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtihOutpostModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
