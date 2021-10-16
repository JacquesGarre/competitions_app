import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulePoolsLinkModalFormComponent } from './module-pools-link-modal-form.component';

describe('ModulePoolsLinkModalFormComponent', () => {
  let component: ModulePoolsLinkModalFormComponent;
  let fixture: ComponentFixture<ModulePoolsLinkModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulePoolsLinkModalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulePoolsLinkModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
