import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalAngpao } from './digital-angpao';

describe('DigitalAngpao', () => {
  let component: DigitalAngpao;
  let fixture: ComponentFixture<DigitalAngpao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalAngpao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalAngpao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
