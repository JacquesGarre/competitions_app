import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleOrganizationsLinkModalFormComponent } from './module-organizations-link-modal-form.component';

describe('ModuleOrganizationsLinkModalFormComponent', () => {
  let component: ModuleOrganizationsLinkModalFormComponent;
  let fixture: ComponentFixture<ModuleOrganizationsLinkModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleOrganizationsLinkModalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleOrganizationsLinkModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
