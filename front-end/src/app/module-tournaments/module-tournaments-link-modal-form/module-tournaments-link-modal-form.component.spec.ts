import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTournamentsLinkModalFormComponent } from './module-tournaments-link-modal-form.component';

describe('ModuleTournamentsLinkModalFormComponent', () => {
  let component: ModuleTournamentsLinkModalFormComponent;
  let fixture: ComponentFixture<ModuleTournamentsLinkModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleTournamentsLinkModalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleTournamentsLinkModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
