import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubAjout } from './club-ajout';

describe('ClubAjout', () => {
  let component: ClubAjout;
  let fixture: ComponentFixture<ClubAjout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubAjout],
    }).compileComponents();

    fixture = TestBed.createComponent(ClubAjout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
