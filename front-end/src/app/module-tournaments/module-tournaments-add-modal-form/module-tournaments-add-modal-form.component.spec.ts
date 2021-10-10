import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTournamentsAddModalFormComponent } from './module-tournaments-add-modal-form.component';

describe('ModuleTournamentsAddModalFormComponent', () => {
  let component: ModuleTournamentsAddModalFormComponent;
  let fixture: ComponentFixture<ModuleTournamentsAddModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleTournamentsAddModalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleTournamentsAddModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
