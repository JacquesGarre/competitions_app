import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleRegistrationsSubmoduleComponent } from './module-registrations-submodule.component';

describe('ModuleRegistrationsSubmoduleComponent', () => {
  let component: ModuleRegistrationsSubmoduleComponent;
  let fixture: ComponentFixture<ModuleRegistrationsSubmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleRegistrationsSubmoduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleRegistrationsSubmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
