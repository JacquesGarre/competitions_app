import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faGem, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-module-organizations-add-modal-form',
    templateUrl: './module-organizations-add-modal-form.component.html',
    styleUrls: ['./module-organizations-add-modal-form.component.css']
})
export class ModuleOrganizationsAddModalFormComponent {

    faGem = faGem;

    name: string = '';
    subdomain: string = '';
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
            subdomain: new FormControl(
                this.subdomain, 
                [
                    Validators.required,
                    Validators.minLength(4)
                ]
            )
        });
    }

    private createForm() {
        this.addForm = this.formBuilder.group({
            name: '',
            subdomain: ''
        });
    }

    public submitForm() {
        this.activeModal.close(this.addForm.value);
    }

}
