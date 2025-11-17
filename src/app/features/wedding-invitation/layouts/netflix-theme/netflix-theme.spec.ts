import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetflixTheme } from './netflix-theme';

describe('NetflixTheme', () => {
  let component: NetflixTheme;
  let fixture: ComponentFixture<NetflixTheme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetflixTheme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetflixTheme);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
