import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleOrganizationsSubmoduleComponent } from './module-organizations-submodule.component';

describe('ModuleOrganizationsSubmoduleComponent', () => {
  let component: ModuleOrganizationsSubmoduleComponent;
  let fixture: ComponentFixture<ModuleOrganizationsSubmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleOrganizationsSubmoduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleOrganizationsSubmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
