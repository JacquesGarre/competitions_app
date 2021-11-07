import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Organization } from '../organization';
import { OrganizationService } from '../organization.service';
import { UserService } from '../../module-users/user.service';
import { faUser, faTrashAlt, faPencilAlt, faPlus, faChevronRight, faInfoCircle, faGem } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-module-organizations-view',
    templateUrl: './module-organizations-view.component.html',
    styleUrls: ['./module-organizations-view.component.css']
})
export class ModuleOrganizationsViewComponent implements OnInit {

    faUser = faUser;
    faPencilAlt = faPencilAlt;
    faChevronRight = faChevronRight;
    faInfoCircle = faInfoCircle;
    faGem = faGem;

    organization: any = {
        id: '',
        name: '',
        subdomain: '',
        createdAt: '',
        updatedAt: '',
    };
    untouchedOrganization: any;
    public isReadonly: boolean = true;
    users: any = [];

    form: any = {
        id: null,
        name: null,
        subdomain: null,
        createdAt: null,
        updatedAt: null,
    };

    constructor(
        public service: OrganizationService,
        public userService: UserService,
        private route: ActivatedRoute,
        private ngxLoader: NgxUiLoaderService
    ){
        this.ngxLoader.startLoader('page-loader');
        const id = this.route.snapshot.paramMap.get('id');
        this.service.getOrganization(id).subscribe((data: any) => {
            this.organization = data;
            this.untouchedOrganization = data;
            this.form = this.organization;
            this.ngxLoader.stopLoader('page-loader');
        })
    }

    ngOnInit(): void {
    }

    toggleForm(){
        this.isReadonly = !this.isReadonly
    }

    resetForm(){
        this.ngxLoader.startLoader('page-loader');
        const id = this.route.snapshot.paramMap.get('id');
        this.service.getOrganization(id).subscribe((data: any) => {
            this.organization = data;
            this.untouchedOrganization = data;
            this.form = this.organization;
            this.ngxLoader.stopLoader('page-loader');
        })
    }

    onSubmit() {
        this.ngxLoader.startLoader('task-loader');
        const name = this.form.name;
        this.service.updateOrganization(this.organization.id, {
            name: this.form.name,
            subdomain: this.form.subdomain
        }).subscribe((data: any) => {
            this.organization = data;
            this.form = data;
            this.ngxLoader.stopLoader('task-loader');
        })
        this.toggleForm()
    }

}
