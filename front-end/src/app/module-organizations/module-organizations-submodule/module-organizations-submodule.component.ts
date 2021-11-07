import { Component, ElementRef, Input, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Organization } from '../organization';
import { OrganizationService } from '../organization.service';
import { UserService } from '../../module-users/user.service';
import { Router } from '@angular/router';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faGem, faTimes} from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { ModuleOrganizationsAddModalFormComponent } from '../module-organizations-add-modal-form/module-organizations-add-modal-form.component';
import { ModuleOrganizationsLinkModalFormComponent } from '../module-organizations-link-modal-form/module-organizations-link-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'app-module-organizations-submodule',
    templateUrl: './module-organizations-submodule.component.html',
    styleUrls: ['./module-organizations-submodule.component.css'],
    providers: [DatePipe]
})
export class ModuleOrganizationsSubmoduleComponent implements OnChanges {

    faTimes = faTimes;
    faGem = faGem;
    faUser = faUser;
    faTrashAlt = faTrashAlt;
    faPencilAlt = faPencilAlt;
    faTrash = faTrash;
    faPen = faPen;
    faEye = faEye;
    faPlus = faPlus;
    organizations: any = [];
    organizationForm: any;
    allOrganizationDetails: any;
    forms: any = [];

    @Input() parent: any;
    @Input() parentModule: any;

    constructor(
        public service: OrganizationService,
        public userService: UserService,
        private modalService: NgbModal,
        private router: Router,
        private datePipe: DatePipe,
        private ngxLoader: NgxUiLoaderService,
        private formBuilder: FormBuilder
    ) {
        this.organizationForm = this.formBuilder.group({
            organizationDetails: this.formBuilder.array([])
        });
    }

    ngOnChanges(): void {
        this.initOrganizations();
    }

    initOrganizations() {
        this.ngxLoader.startLoader('submodule-loader');
        // Organizations as submodule in user
        if(this.parent.id && this.parentModule == 'users'){
            this.service.getOrganizationsByUser(this.parent.id).subscribe((data: any) => {
                if (data.length) {
                    this.organizations = data;
                    this.organizationForm = this.formBuilder.group({
                        organizationDetails: this.formBuilder.array(
                            this.organizations.map((x: any) => 
                                this.formBuilder.group({
                                    id: [x.id, [Validators.required, Validators.minLength(2)]],
                                    name: [x.name, [Validators.required, Validators.minLength(2)]],
                                    subdomain: [x.subdomain, [Validators.required, Validators.minLength(2)]],
                                    createdAt: [x.createdAt, [Validators.required, Validators.minLength(2)]],
                                    updatedAt: x.updatedAt, 
                                    isReadonly: true
                                })
                            )
                        )
                    })
                } else {
                    this.organizations = [];
                }
                this.ngxLoader.stopLoader('submodule-loader');
            })
        }
    }

    // Add orga to parent module
    linkOrganization() {
        const modalRef = this.modalService.open(ModuleOrganizationsLinkModalFormComponent, { centered: true });
        modalRef.componentInstance.parentOrganizationIDS = this.parent.organizations.map((url: any) => {return url.replace('/api/organizations/', '')})
        modalRef.result.then((result) => {
            if (result == 'save') {
                this.ngxLoader.startLoader('submodule-loader');
                let values = modalRef.componentInstance.addForm.value;
                switch(this.parentModule){
                    case 'users':
                        this.service.getOrganization(values.organizationId).subscribe((organization: any) => {
                            console.log(this.parent.organizations);
                            if (!organization.users.includes(this.parent.id)) {
                                organization.users.push('/api/users/'+this.parent.id);
                                this.service.updateOrganization(organization.id, organization).subscribe((data: any) => {
                                    this.initOrganizations();
                                })
                            }
                        })
                    break;
                }
            }
        });
    }

    // Remove organization from parent module
    removeOrganization(organization: any) {
        switch(this.parentModule){
            case 'users':
                const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
                modalRef.componentInstance.title = 'Removing user from organization';
                modalRef.componentInstance.content = 'Are you sure you want to remove <i>' + this.parent.firstName + ' ' + this.parent.lastName + '</i> from <i>' + organization.name + '</i>?';
                modalRef.componentInstance.confirmBtn = 'Confirm';
                modalRef.result.then((result) => {
                    if (result == 'confirm') {
                        this.ngxLoader.startLoader('submodule-loader');
                        const index: number = organization.users.indexOf('/api/users/'+this.parent.id);
                        if (index !== -1) {
                            organization.users.splice(index, 1);
                            this.service.updateOrganization(organization.id, organization).subscribe((data: any) => {
                                this.initOrganizations();
                                this.ngxLoader.stopLoader('submodule-loader');
                            })
                        }                
                    }
                });
            break;
        }
    }


    // Delete organization
    deleteOrganization(organization: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Deleting an organization';
        modalRef.componentInstance.content = 'Are you sure you want to delete <i>' + organization.name + '</i> ?';
        modalRef.componentInstance.confirmBtn = 'Confirm';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
                this.ngxLoader.startLoader('submodule-loader');
                this.service.deleteOrganization(organization.id).subscribe(data => {
                    this.initOrganizations();
                    this.ngxLoader.stopLoader('submodule-loader');
                })
            }
        });
    }

    // Shows details
    showOrganization(organization: any) {
        this.router.navigate(['/admin/organizations/' + organization.id])
    }

    // On submit inline edit form
    onSubmit(organization: any) {
        const name = organization.name;
        this.service.updateOrganization(organization.id, {
            name
        }).subscribe((data: any) => {
            organization = data;
        })
        this.toggleForm(organization)
    }

    toggleForm(organization: any) {
        organization.isReadonly = !organization.isReadonly
    }

}
