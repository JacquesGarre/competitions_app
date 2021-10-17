import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleRegistrationsAddModalFormComponent } from './module-registrations-add-modal-form.component';

describe('ModuleRegistrationsAddModalFormComponent', () => {
  let component: ModuleRegistrationsAddModalFormComponent;
  let fixture: ComponentFixture<ModuleRegistrationsAddModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleRegistrationsAddModalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleRegistrationsAddModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
