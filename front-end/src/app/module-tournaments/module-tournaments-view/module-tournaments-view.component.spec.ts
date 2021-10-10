import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTournamentsViewComponent } from './module-tournaments-view.component';

describe('ModuleTournamentsViewComponent', () => {
  let component: ModuleTournamentsViewComponent;
  let fixture: ComponentFixture<ModuleTournamentsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleTournamentsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleTournamentsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
