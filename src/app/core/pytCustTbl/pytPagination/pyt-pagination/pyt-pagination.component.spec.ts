import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PytPaginationComponent } from './pyt-pagination.component';

describe('PytPaginationComponent', () => {
  let component: PytPaginationComponent;
  let fixture: ComponentFixture<PytPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PytPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PytPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
