import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faUsers, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-add-modal-form',
    templateUrl: './add-modal-form.component.html',
    styleUrls: ['./add-modal-form.component.css']
})
export class AddModalFormComponent {

    faUsers = faUsers;

    name: string = '';
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
            )
        });
    }

    private createForm() {
        this.addForm = this.formBuilder.group({
            name: ''
        });
    }

    public submitForm() {
        this.activeModal.close(this.addForm.value);
    }

}
