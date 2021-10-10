import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTournamentsComponent } from './module-tournaments.component';

describe('ModuleTournamentsComponent', () => {
  let component: ModuleTournamentsComponent;
  let fixture: ComponentFixture<ModuleTournamentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleTournamentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleTournamentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
