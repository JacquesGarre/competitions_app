import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTournamentsSubmoduleComponent } from './module-tournaments-submodule.component';

describe('ModuleTournamentsSubmoduleComponent', () => {
  let component: ModuleTournamentsSubmoduleComponent;
  let fixture: ComponentFixture<ModuleTournamentsSubmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleTournamentsSubmoduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleTournamentsSubmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
