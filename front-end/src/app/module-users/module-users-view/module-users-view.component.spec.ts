import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleUsersViewComponent } from './module-users-view.component';

describe('ModuleUsersViewComponent', () => {
  let component: ModuleUsersViewComponent;
  let fixture: ComponentFixture<ModuleUsersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleUsersViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleUsersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
