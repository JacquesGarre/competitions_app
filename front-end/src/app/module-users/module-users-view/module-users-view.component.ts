import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';
import { OrganizationService } from '../../module-organizations/organization.service';
import { faUsers, faTrashAlt, faPencilAlt, faPlus, faChevronRight, faSitemap, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Organization } from 'src/app/module-organizations/organization';

@Component({
    selector: 'app-module-users-view',
    templateUrl: './module-users-view.component.html',
    styleUrls: ['./module-users-view.component.css']
})
export class ModuleUsersViewComponent implements OnInit {

    faUsers = faUsers;
    faPencilAlt = faPencilAlt;
    faChevronRight = faChevronRight;
    faSitemap = faSitemap;
    faInfoCircle = faInfoCircle;

    organizations: Organization[];
    user: any = {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        organizations: [],
        createdAt: '',
        updatedAt: '',
    };
    untouchedUser: any;
    public isReadonly: boolean = true;

    form: any = {
        id: null,
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        organizations: [],
        createdAt: null,
        updatedAt: null,
    };

    constructor(
        public service: UserService,
        public organizationService: OrganizationService,
        private route: ActivatedRoute,
        private ngxLoader: NgxUiLoaderService
    ){
        this.ngxLoader.startLoader('page-loader');
        const id = this.route.snapshot.paramMap.get('id');
        this.organizations = [];
        this.service.getUser(id).subscribe((data: any) => {
            this.user = data;
            this.user.organizations = this.user.organizations.map((organization: string)=>{
                const id = organization.replace('/api/organizations/','');
                return id;
            });
            this.untouchedUser = data;
            this.form = this.user;
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
        this.service.getUser(id).subscribe((data: any) => {
            this.user = data;
            this.untouchedUser = data;
            this.form = this.user;
            this.ngxLoader.stopLoader('page-loader');
        })
    }

    onSubmit() {
        const firstName = this.form.firstName;
        this.service.updateUser(this.user.id, {
            email: this.form.email,
            firstName: this.form.firstName,
            lastName: this.form.lastName,
            password: this.form.password
        }).subscribe((data: any) => {
            this.user = data;
            this.form = data;
        })
        this.toggleForm()
    }

}
