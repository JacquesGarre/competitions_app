import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Organization } from './organization';
import { OrganizationService } from './organization.service';
import { Router } from '@angular/router';

import { faUsers, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModuleOrganizationsAddModalFormComponent } from './module-organizations-add-modal-form/module-organizations-add-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'app-module-organizations',
    templateUrl: './module-organizations.component.html',
    styleUrls: ['./module-organizations.component.css'],
    providers: [DatePipe]
})
export class ModuleOrganizationsComponent implements OnInit {

    faUsers = faUsers;
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

    constructor(
        public service: OrganizationService,
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

    ngOnInit(): void {
        this.ngxLoader.startLoader('page-loader');
        this.initOrganizations();
    }

    initOrganizations() {
        this.service.getOrganizations().subscribe((data: any) => {
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
            }
            this.ngxLoader.stopLoader('page-loader');
        })
    }

    // Create organization
    createOrganization() {
        const modalRef = this.modalService.open(ModuleOrganizationsAddModalFormComponent, { centered: true });
        modalRef.result.then((result) => {
            if (result == 'save') {
                this.ngxLoader.startLoader('page-loader');
                let values = modalRef.componentInstance.addForm.value;
                let organization: any = {
                    name: values.name,
                    subdomain: values.subdomain
                }
                this.service.createOrganization(organization).subscribe(data => {
                    this.initOrganizations();
                })
            }
        });
    }

    // Delete organization
    deleteOrganization(organization: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Deleting an organization';
        modalRef.componentInstance.content = 'Are you sure you want to delete <i>' + organization.name + '</i> ?';
        modalRef.componentInstance.confirmBtn = 'Confirm';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
                this.service.deleteOrganization(organization.id).subscribe(data => {
                    this.initOrganizations();
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
