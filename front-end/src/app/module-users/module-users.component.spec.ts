import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleUsersComponent } from './module-users.component';

describe('ModuleUsersComponent', () => {
  let component: ModuleUsersComponent;
  let fixture: ComponentFixture<ModuleUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
