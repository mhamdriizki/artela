import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingInvitation } from './wedding-invitation';

describe('WeddingInvitation', () => {
  let component: WeddingInvitation;
  let fixture: ComponentFixture<WeddingInvitation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeddingInvitation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeddingInvitation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
