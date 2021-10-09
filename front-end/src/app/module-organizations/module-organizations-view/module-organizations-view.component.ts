import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Organization } from '../organization';
import { OrganizationService } from '../organization.service';
import { UserService } from '../../module-users/user.service';
import { faUsers, faTrashAlt, faPencilAlt, faPlus, faChevronRight, faInfoCircle, faSitemap } from '@fortawesome/free-solid-svg-icons';
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
    faChevronRight = faChevronRight;
    faInfoCircle = faInfoCircle;
    faSitemap = faSitemap;

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
        this.userService.getUsersByOrganization(this.organization.id).subscribe((data: any) => {
            // if (data.length) {
            //     this.users = data;
            //     this.userForm = this.formBuilder.group({
            //         userDetails: this.formBuilder.array(
            //             this.users.map((x: any) => {
            //                 return this.formBuilder.group({
            //                     id: [x.id, [Validators.required, Validators.minLength(2)]],
            //                     email: [x.email, [Validators.required, Validators.minLength(2)]],
            //                     firstName: [x.firstName, [Validators.required, Validators.minLength(2)]],
            //                     lastName: [x.lastName, [Validators.required, Validators.minLength(2)]],
            //                     organizations: [x.organizations.map((organization: string)=>{
            //                         const id = organization.replace('/api/organizations/','');
            //                         return id;
            //                     }), [Validators.required, Validators.minLength(2)]],
            //                     createdAt: [x.createdAt, [Validators.required, Validators.minLength(2)]],
            //                     updatedAt: x.updatedAt, 
            //                     isReadonly: true
            //                 })
            //             })
            //         )
            //     })
            // }
            // this.ngxLoader.stopLoader('page-loader');
        })
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
