import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Pool } from '../pool';
import { PoolService } from '../pool.service';
import { UserService } from '../../module-users/user.service';
import { faUser, faTrashAlt, faPencilAlt, faPlus, faChevronRight, faInfoCircle, faSitemap, faAlignLeft, faCog } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrganizationService } from 'src/app/module-organizations/organization.service';

@Component({
    selector: 'app-module-pools-view',
    templateUrl: './module-pools-view.component.html',
    styleUrls: ['./module-pools-view.component.css']
})
export class ModulePoolsViewComponent implements OnInit {

    faUser = faUser;
    faPencilAlt = faPencilAlt;
    faChevronRight = faChevronRight;
    faInfoCircle = faInfoCircle;
    faSitemap = faSitemap;
    faAlignLeft = faAlignLeft;
    faCog = faCog;

    pool: any = {
        id: '',
        name: '',
        organization: '',
        registrationFormOpen: '',
        creator: '',
        startDate: '',
        endDate: '',
        createdAt: '',
        updatedAt: '',
        description: ''
    };
    untouchedPool: any;
    public isReadonly: boolean = true;
    users: any;
    currentUser: any;
    organizations: any;
    startDate: any;
    endDate: any;

    form: any = {
        id: null,
        name: null,
        organization: null,
        registrationFormOpen: null,
        creator: null,
        endDate: null,
        createdAt: null,
        updatedAt: null,
        description: ''
    };

    constructor(
        public service: PoolService,
        public userService: UserService,
        public organizationService: OrganizationService,
        private route: ActivatedRoute,
        private ngxLoader: NgxUiLoaderService
    ){
        this.ngxLoader.startLoader('page-loader');
        this.startDate = new Date();
        this.endDate = new Date();
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.service.getPool(id).subscribe((data: any) => {
            this.pool = data;

            this.startDate = this.pool.startDate;
            this.endDate = this.pool.endDate;

            this.untouchedPool = this.pool;
            this.form = this.pool;
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
                this.userService.getUsers().subscribe((data: any) => {
                    this.users = data;
                    this.ngxLoader.stopLoader('page-loader');
                })
            })
        })
    }

    toggleForm(){
        this.isReadonly = !this.isReadonly
    }

    resetForm(){
        this.ngxLoader.startLoader('page-loader');
        const id = this.route.snapshot.paramMap.get('id');
        this.service.getPool(id).subscribe((data: any) => {
            this.pool = data;
            this.untouchedPool = data;
            this.form = this.pool;
            this.ngxLoader.stopLoader('page-loader');
        })
    }

    onSubmit() {
        const updatedPool = {
            name: this.form.name,
            organization: this.form.organization,
            address: this.form.address,
            city: this.form.city,
            postalCode: this.form.postalCode,
            country: this.form.country,
            startDate: new Date(Date.parse(this.startDate)+3600*1000).toUTCString(),
            endDate: new Date(Date.parse(this.endDate)+3600*1000).toUTCString(),
            registrationFormOpen: this.form.registrationFormOpen && this.form.registrationFormOpen !== 'false',
            description: this.form.description,
        }
        this.service.updatePool(this.pool.id, updatedPool).subscribe((data: any) => {
            this.pool = data;
            this.form = data;
        })
        this.toggleForm()
    }

}
