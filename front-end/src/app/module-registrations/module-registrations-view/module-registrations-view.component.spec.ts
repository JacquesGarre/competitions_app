import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleRegistrationsViewComponent } from './module-registrations-view.component';

describe('ModuleRegistrationsViewComponent', () => {
  let component: ModuleRegistrationsViewComponent;
  let fixture: ComponentFixture<ModuleRegistrationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleRegistrationsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleRegistrationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
