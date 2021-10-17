import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleRegistrationsLinkModalFormComponent } from './module-registrations-link-modal-form.component';

describe('ModuleRegistrationsLinkModalFormComponent', () => {
  let component: ModuleRegistrationsLinkModalFormComponent;
  let fixture: ComponentFixture<ModuleRegistrationsLinkModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleRegistrationsLinkModalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleRegistrationsLinkModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
