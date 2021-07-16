import { Component, Input, OnInit } from '@angular/core';

import { Organization } from './organization';
import { OrganizationService } from '../_services/organization.service';

import { faUsers, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { AddModalFormComponent } from './add-modal-form/add-modal-form.component';


@Component({
    selector: 'app-module-organizations',
    templateUrl: './module-organizations.component.html',
    styleUrls: ['./module-organizations.component.css']
})
export class ModuleOrganizationsComponent implements OnInit {

    faUsers = faUsers;
    faTrashAlt = faTrashAlt;
    faPencilAlt = faPencilAlt;
    faPlus = faPlus;
    organizations: any = [];

    constructor(
        public service: OrganizationService,
        private modalService: NgbModal,
    ) { }


    ngOnInit(): void {
        this.loadOrganizations()
    }

    // Get Organizations list
    loadOrganizations() {
        return this.service.getOrganizations().subscribe((data: {}) => {
            this.organizations = data;
        })
    }

    // Delete Organization
    deleteOrganization(id: any, name: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true } );
        modalRef.componentInstance.title = 'Deleting an organization';
        modalRef.componentInstance.content = 'Are you sure you want to delete <i>' + name + '</i> ?';
        modalRef.componentInstance.confirmBtn = 'Confirm';
        modalRef.result.then((result) => {
            if(result == 'confirm'){
                this.service.deleteOrganization(id).subscribe(data => {
                    this.loadOrganizations()
                })
            }
        });
    }

    // Create organization
    createOrganization() {
        const modalRef = this.modalService.open(AddModalFormComponent, { centered: true } );
        modalRef.result.then((result) => {
            if(result == 'save'){
                let values = modalRef.componentInstance.addForm.value;
                let organization: any = {
                    name: values.name
                }
                this.service.createOrganization(organization).subscribe(data => {
                    this.loadOrganizations()
                })
            }
        });
    }


}
