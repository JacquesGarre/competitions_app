import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulePoolsSubmoduleComponent } from './module-pools-submodule.component';

describe('ModulePoolsSubmoduleComponent', () => {
  let component: ModulePoolsSubmoduleComponent;
  let fixture: ComponentFixture<ModulePoolsSubmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulePoolsSubmoduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulePoolsSubmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
