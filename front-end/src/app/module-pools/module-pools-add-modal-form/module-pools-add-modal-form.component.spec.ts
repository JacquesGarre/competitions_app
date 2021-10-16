import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulePoolsAddModalFormComponent } from './module-pools-add-modal-form.component';

describe('ModulePoolsAddModalFormComponent', () => {
  let component: ModulePoolsAddModalFormComponent;
  let fixture: ComponentFixture<ModulePoolsAddModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulePoolsAddModalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulePoolsAddModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
