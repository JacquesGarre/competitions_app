import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleOrganizationsComponent } from './module-organizations.component';

describe('ModuleOrganizationsComponent', () => {
  let component: ModuleOrganizationsComponent;
  let fixture: ComponentFixture<ModuleOrganizationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleOrganizationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
