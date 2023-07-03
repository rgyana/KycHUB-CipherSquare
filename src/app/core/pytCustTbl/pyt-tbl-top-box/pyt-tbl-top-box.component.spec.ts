import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PytTblTopBoxComponent } from './pyt-tbl-top-box.component';

describe('PytTblTopBoxComponent', () => {
  let component: PytTblTopBoxComponent;
  let fixture: ComponentFixture<PytTblTopBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PytTblTopBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PytTblTopBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
