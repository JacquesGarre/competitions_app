import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulePoolsViewComponent } from './module-pools-view.component';

describe('ModulePoolsViewComponent', () => {
  let component: ModulePoolsViewComponent;
  let fixture: ComponentFixture<ModulePoolsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulePoolsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulePoolsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
