import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faUsers, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-module-users-add-modal-form',
    templateUrl: './module-users-add-modal-form.component.html',
    styleUrls: ['./module-users-add-modal-form.component.css']
})
export class ModuleUsersAddModalFormComponent {

    faUsers = faUsers;

    email: string = '';
    firstName: string = '';
    lastName: string = '';
    password: string = '';
    addForm = new FormGroup({});

    constructor(
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder
    ) { 
        this.addForm = new FormGroup({
            email: new FormControl(
                this.email, 
                [
                    Validators.required,
                    Validators.minLength(4)
                ]
            ),
            firstName: new FormControl(
                this.firstName, 
                [
                    Validators.required,
                    Validators.minLength(4)
                ]
            ),
            lastName: new FormControl(
                this.lastName, 
                [
                    Validators.required,
                    Validators.minLength(4)
                ]
            ),
            password: new FormControl(
                this.password, 
                [
                    Validators.required,
                    Validators.minLength(4)
                ]
            )
        });
    }

    private createForm() {
        this.addForm = this.formBuilder.group({
            email: '',
            firstName: '',
            lastName: '',
            password: ''
        });
    }

    public submitForm() {
        this.activeModal.close(this.addForm.value);
    }

}
