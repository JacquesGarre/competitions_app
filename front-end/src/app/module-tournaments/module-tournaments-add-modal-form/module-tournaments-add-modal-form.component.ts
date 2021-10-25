import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl, FormsModule } from '@angular/forms';
import { faGem, faTrashAlt, faPencilAlt, faPlus, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { OrganizationService } from 'src/app/module-organizations/organization.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/module-users/user.service';

@Component({
    selector: 'app-module-tournaments-add-modal-form',
    templateUrl: './module-tournaments-add-modal-form.component.html',
    styleUrls: ['./module-tournaments-add-modal-form.component.css']
})
export class ModuleTournamentsAddModalFormComponent {

    faSitemap = faSitemap;

    name: string = '';
    organization: string = '';
    startDate: Date = new Date();
    endDate: Date = new Date();
    uri: any;
    addForm = new FormGroup({});
    currentUser: any;
    organizations: any;

    constructor(
        public activeModal: NgbActiveModal,
        private formBuilder: FormBuilder,
        public organizationService: OrganizationService,
        public token: TokenStorageService,
        public userService: UserService
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
            ),
            uri: new FormControl(
                this.uri, 
                [
                    Validators.required
                ]
            )
        });
        this.userService.getCurrentUser().subscribe((data: any) => {
            this.currentUser = data[0];
            if(this.currentUser.roles.includes('ROLE_ADMIN')){
                this.organizationService.getOrganizations().subscribe((data: any) => {
                    this.organizations = data;
                })
            } else {
                this.organizationService.getOrganizationsByUser(this.currentUser.id).subscribe((data: any) => {
                    this.organizations = data;
                })
            }
        })
    }

    private createForm() {
        this.addForm = this.formBuilder.group({
            name: '',
            organization: '',
            startDate: new Date(),
            endDate: new Date(),
            uri: '',
        });
    }

    public submitForm() {
        this.activeModal.close(this.addForm.value);
    }

}
