import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Organization } from '../organization';
import { OrganizationService } from '../organization.service';
import { faUsers, faTrashAlt, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-module-organizations-view',
    templateUrl: './module-organizations-view.component.html',
    styleUrls: ['./module-organizations-view.component.css']
})
export class ModuleOrganizationsViewComponent implements OnInit {

    faUsers = faUsers;
    faPencilAlt = faPencilAlt;

    organization: any;
    untouchedOrganization: any;
    public isReadonly: boolean = true;

    form: any = {
        id: null,
        name: null,
        createdAt: null,
        updatedAt: null,
    };

    constructor(
        public service: OrganizationService,
        private route: ActivatedRoute,
        private router: Router,
        private ngxLoader: NgxUiLoaderService
    ){}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.service.getOrganization(id).subscribe((data: any) => {
            this.organization = data;
            this.form = this.organization;
        })
    }

    toggleForm(){
        this.isReadonly = !this.isReadonly
    }

    onSubmit() {
        const name = this.form.name;
        this.service.updateOrganization(this.organization.id, {
            name
        }).subscribe((data: any) => {
            this.organization = data;
            this.form = data;
        })
        this.toggleForm()
    }

}
