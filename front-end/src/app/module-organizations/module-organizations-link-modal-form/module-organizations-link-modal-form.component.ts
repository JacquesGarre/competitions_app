import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faSitemap, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { OrganizationService } from '../organization.service';
@Component({
    selector: 'app-module-organizations-link-modal-form',
    templateUrl: './module-organizations-link-modal-form.component.html',
    styleUrls: ['./module-organizations-link-modal-form.component.css']
})
export class ModuleOrganizationsLinkModalFormComponent {

    faSitemap = faSitemap;
    organizationId: any = 0;
    addForm = new FormGroup({});
    organizations: any = [];

    @Input() parentOrganizationIDS: any;

    constructor(
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        public service: OrganizationService
    ) { 
        this.addForm = new FormGroup({
            organizationId: new FormControl(
                this.organizationId, 
                [
                    Validators.required
                ]
            )
        });

        this.service.getOrganizations().subscribe((data: any) => {
            if (data.length) {
                this.organizations = data.filter((organization: any) => !this.parentOrganizationIDS.includes(organization.id.toString()));
            }
        })

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
