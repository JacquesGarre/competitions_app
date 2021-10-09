import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleUsersAddModalFormComponent } from './module-users-add-modal-form.component';

describe('ModuleUsersAddModalFormComponent', () => {
  let component: ModuleUsersAddModalFormComponent;
  let fixture: ComponentFixture<ModuleUsersAddModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleUsersAddModalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleUsersAddModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
