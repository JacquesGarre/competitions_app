import { Component, OnInit } from '@angular/core';

import { Organization } from './organization';
import { OrganizationService } from '../_services/organization.service';

import { faUsers, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';


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

    constructor(public service: OrganizationService) { }

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
    deleteOrganization(id: any) {

        /*
        if (window.confirm('Are you sure, you want to delete?')){
            this.service.deleteOrganization(id).subscribe(data => {
                this.loadOrganizations()
            })
        }
        */
    }  

    // Create organization
    createOrganization(){
        // let content = "Formulaire de creation";
        // this.modal.open(content)
    }


}
