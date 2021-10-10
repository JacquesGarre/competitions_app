import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faUsers, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-module-tournaments-add-modal-form',
    templateUrl: './module-tournaments-add-modal-form.component.html',
    styleUrls: ['./module-tournaments-add-modal-form.component.css']
})
export class ModuleTournamentsAddModalFormComponent {

    faUsers = faUsers;

    name: string = '';
    organization: string = '';
    startDate: Date = new Date();
    endDate: Date = new Date();
    addForm = new FormGroup({});

    constructor(
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder
    ) { 
        this.addForm = new FormGroup({
            name: new FormControl(
                this.name, 
                [
                    Validators.required,
                    Validators.minLength(4)
                ]
            ),
            organization: new FormControl(
                this.organization, 
                [
                    Validators.required
                ]
            ),
            startDate: new FormControl(
                this.startDate, 
                []
            ),
            endDate: new FormControl(
                this.endDate, 
                []
            )
        });
    }

    private createForm() {
        this.addForm = this.formBuilder.group({
            name: '',
            organization: '',
            startDate: new Date(),
            endDate: new Date()
        });
    }

    public submitForm() {
        this.activeModal.close(this.addForm.value);
    }

}
