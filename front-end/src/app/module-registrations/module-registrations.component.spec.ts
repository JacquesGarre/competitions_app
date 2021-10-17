import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleRegistrationsComponent } from './module-registrations.component';

describe('ModuleRegistrationsComponent', () => {
  let component: ModuleRegistrationsComponent;
  let fixture: ComponentFixture<ModuleRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleRegistrationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
