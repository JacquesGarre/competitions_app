import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleUsersSubmoduleComponent } from './module-users-submodule.component';

describe('ModuleUsersSubmoduleComponent', () => {
  let component: ModuleUsersSubmoduleComponent;
  let fixture: ComponentFixture<ModuleUsersSubmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleUsersSubmoduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleUsersSubmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
