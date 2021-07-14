import { Component, OnInit } from '@angular/core';

import { Organization } from './organization';
import { OrganizationService } from '../_services/organization.service';

import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-module-organizations',
    templateUrl: './module-organizations.component.html',
    styleUrls: ['./module-organizations.component.css']
})
export class ModuleOrganizationsComponent implements OnInit {

    faUsers = faUsers;
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

    /*
        // Delete employee
        deleteEmployee(id) {
            if (window.confirm('Are you sure, you want to delete?')){
            this.restApi.deleteEmployee(id).subscribe(data => {
                this.loadEmployees()
            })
            }
        }  
    */


}
