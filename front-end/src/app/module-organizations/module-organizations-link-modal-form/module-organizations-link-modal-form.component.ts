import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faSitemap, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-module-organizations-link-modal-form',
    templateUrl: './module-organizations-link-modal-form.component.html',
    styleUrls: ['./module-organizations-link-modal-form.component.css']
})
export class ModuleOrganizationsLinkModalFormComponent {

    faSitemap = faSitemap;
    organizationId: number = 0;
    addForm = new FormGroup({});

    constructor(
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder
    ) { 
        this.addForm = new FormGroup({
            organizationId: new FormControl(
                this.organizationId, 
                [
                    Validators.required
                ]
            )
        });
    }

    private createForm() {
        this.addForm = this.formBuilder.group({
            organizationId: 0
        });
    }

    public submitForm() {
        this.activeModal.close(this.addForm.value);
    }

}
