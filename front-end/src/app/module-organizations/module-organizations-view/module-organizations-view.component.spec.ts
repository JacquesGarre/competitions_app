import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleOrganizationsViewComponent } from './module-organizations-view.component';

describe('ModuleOrganizationsViewComponent', () => {
  let component: ModuleOrganizationsViewComponent;
  let fixture: ComponentFixture<ModuleOrganizationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleOrganizationsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleOrganizationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
