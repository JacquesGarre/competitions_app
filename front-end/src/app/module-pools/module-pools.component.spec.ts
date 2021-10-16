import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulePoolsComponent } from './module-pools.component';

describe('ModulePoolsComponent', () => {
  let component: ModulePoolsComponent;
  let fixture: ComponentFixture<ModulePoolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulePoolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulePoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
