import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleUsersLinkModalFormComponent } from './module-users-link-modal-form.component';

describe('ModuleUsersLinkModalFormComponent', () => {
  let component: ModuleUsersLinkModalFormComponent;
  let fixture: ComponentFixture<ModuleUsersLinkModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleUsersLinkModalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleUsersLinkModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
