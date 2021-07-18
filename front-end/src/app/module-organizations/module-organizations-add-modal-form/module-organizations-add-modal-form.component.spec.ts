import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleOrganizationsAddModalFormComponent } from './module-organizations-add-modal-form.component';

describe('ModuleOrganizationsAddModalFormComponent', () => {
  let component: ModuleOrganizationsAddModalFormComponent;
  let fixture: ComponentFixture<ModuleOrganizationsAddModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleOrganizationsAddModalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleOrganizationsAddModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
