import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { User } from './user';
import { UserService } from './user.service';
import { Organization } from '../module-organizations/organization';
import { OrganizationService } from '../module-organizations/organization.service';
import { Router } from '@angular/router';
import { Env } from '../_globals/env';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModuleUsersAddModalFormComponent } from './module-users-add-modal-form/module-users-add-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
    selector: 'app-module-users',
    templateUrl: './module-users.component.html',
    styleUrls: ['./module-users.component.css'],
    providers: [DatePipe]
})
export class ModuleUsersComponent implements OnInit {

    currentPage = 1;
    currentFilteredPage = 1;
    filteredPagination = false;
    pages = Array.from({length: 3}, (_, i) => i + 1);
    filteredPages = Array.from({length: 3}, (_, i) => i + 1);
    totalItems = 0;

    faUser = faUser;
    faTrashAlt = faTrashAlt;
    faPencilAlt = faPencilAlt;
    faTrash = faTrash;
    faPen = faPen;
    faEye = faEye;
    faPlus = faPlus;
    faSitemap = faSitemap;
    faSearch = faSearch;
    faTimes = faTimes;

    users: any = [];
    userForm: any;
    allUserDetails: any;
    forms: any = [];

    emailFilter: any = '';
    firstNameFilter: any = '';
    lastNameFilter: any = '';
    licenceNumberFilter: any = '';

    constructor(
        public service: UserService,
        public organizationService: OrganizationService,
        private modalService: NgbModal,
        private router: Router,
        private datePipe: DatePipe,
        private ngxLoader: NgxUiLoaderService,
        private formBuilder: FormBuilder
    ) {
        this.userForm = this.formBuilder.group({
            userDetails: this.formBuilder.array([])
        });
    }

    ngOnInit(): void {
        this.filteredPagination = false;
        this.emailFilter = (<HTMLInputElement>document.getElementById("emailFilter")).value = '';
        this.firstNameFilter = (<HTMLInputElement>document.getElementById("firstNameFilter")).value = '';
        this.lastNameFilter = (<HTMLInputElement>document.getElementById("lastNameFilter")).value = '';
        this.licenceNumberFilter = (<HTMLInputElement>document.getElementById("licenceNumberFilter")).value = '';
        this.ngxLoader.startLoader('page-loader');
        this.initUsers();
    }

    goToFilteredPage(page: any): void {
        this.ngxLoader.startLoader('page-loader');
        this.currentFilteredPage = page;
        this.filter(this.currentFilteredPage)
    }

    filter(page:any = this.currentFilteredPage) {
        this.emailFilter = (<HTMLInputElement>document.getElementById("emailFilter")).value;
        this.firstNameFilter = (<HTMLInputElement>document.getElementById("firstNameFilter")).value;
        this.lastNameFilter = (<HTMLInputElement>document.getElementById("lastNameFilter")).value;
        this.licenceNumberFilter = (<HTMLInputElement>document.getElementById("licenceNumberFilter")).value;

        if(this.emailFilter.length < 1){
            this.emailFilter = false;
        }
        if(this.firstNameFilter.length < 1){
            this.firstNameFilter = false;
        }
        if(this.lastNameFilter.length < 1){
            this.lastNameFilter = false;
        }
        if(this.licenceNumberFilter.length < 1){
            this.licenceNumberFilter = false;
        }

        this.filteredPagination = true;
        this.ngxLoader.startLoader('page-loader');
        this.service.getFilteredUsers(this.currentFilteredPage, this.emailFilter, this.firstNameFilter, this.lastNameFilter, this.licenceNumberFilter).subscribe((data: any) => {
            this.users = data['hydra:member'];
            this.totalItems = data['hydra:totalItems'];
            this.filteredPages = Array.from({length: Math.floor(this.totalItems / Env.ITEMS_PER_PAGE)+1 }, (_, i) => i + 1);

            this.userForm = this.formBuilder.group({
                userDetails: this.formBuilder.array(
                    this.users.map((x: any) => {
                        return this.formBuilder.group({
                            id: [x.id, [Validators.required, Validators.minLength(2)]],
                            email: [x.email, [Validators.required, Validators.minLength(2)]],
                            firstName: [x.firstName, [Validators.required, Validators.minLength(2)]],
                            lastName: [x.lastName, [Validators.required, Validators.minLength(2)]],
                            roles: [x.roles],
                            organizations: [x.organizations, [Validators.required, Validators.minLength(2)]],
                            createdAt: [x.createdAt, [Validators.required, Validators.minLength(2)]],
                            updatedAt: [x.updatedAt], 
                            licenceNumber: [x.licenceNumber], 
                            points: [x.points], 
                            club: [x.club],
                            genre: [x.genre],
                            isReadonly: true
                        })
                    })
                )
            })
            this.ngxLoader.stopLoader('page-loader');
        })
    }

    initUsers() {
        this.service.getUsers(this.currentPage).subscribe((data: any) => {

            this.users = data['hydra:member'];
            this.totalItems = data['hydra:totalItems'];
            this.pages = Array.from({length: Math.round(this.totalItems / Env.ITEMS_PER_PAGE)+1 }, (_, i) => i + 1);

            this.userForm = this.formBuilder.group({
                userDetails: this.formBuilder.array(
                    this.users.map((x: any) => {
                        return this.formBuilder.group({
                            id: [x.id, [Validators.required, Validators.minLength(2)]],
                            email: [x.email, [Validators.required, Validators.minLength(2)]],
                            firstName: [x.firstName, [Validators.required, Validators.minLength(2)]],
                            lastName: [x.lastName, [Validators.required, Validators.minLength(2)]],
                            roles: [x.roles],
                            organizations: [x.organizations, [Validators.required, Validators.minLength(2)]],
                            createdAt: [x.createdAt, [Validators.required, Validators.minLength(2)]],
                            updatedAt: [x.updatedAt], 
                            licenceNumber: [x.licenceNumber], 
                            points: [x.points], 
                            club: [x.club],
                            genre: [x.genre],
                            isReadonly: true
                        })
                    })
                )
            })
            this.ngxLoader.stopLoader('page-loader');
        })
    }

    // Create user
    createUser() {
        const modalRef = this.modalService.open(ModuleUsersAddModalFormComponent, { centered: true });
        modalRef.result.then((result) => {
            if (result == 'save') {
                this.ngxLoader.startLoader('task-loader');
                let values = modalRef.componentInstance.addForm.value;
                let user: any = {
                    email: values.email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    password: values.password
                }
                this.service.createUser(user).subscribe(() => {
                    this.initUsers();
                    this.ngxLoader.stopLoader('task-loader');
                })
            }
        });
    }

    // Delete user
    deleteUser(user: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Suppression d\'un utilisateur';
        modalRef.componentInstance.content = 'Êtes-vous sûr de vouloir supprimer <i>' + user.firstName + ' ' + user.lastName + '</i> ?';
        modalRef.componentInstance.confirmBtn = 'Confirmer';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
                this.ngxLoader.startLoader('task-loader');
                this.service.deleteUser(user.id).subscribe(() => {
                    this.initUsers();
                    this.ngxLoader.stopLoader('task-loader');
                })
            }
        });
    }

    goToPage(page: any): void {
        this.ngxLoader.startLoader('page-loader');
        this.currentPage = page;
        this.initUsers();
    }

    // Shows details
    showUser(user: any) {
        this.router.navigate(['/admin/users/' + user.id])
    }

    // On submit inline edit form 
    onSubmit(user: any) {
        const name = user.name;
        this.service.updateUser(user.id, {
            name
        }).subscribe((data: any) => {
            user = data;
        })
        this.toggleForm(user)
    }

    toggleForm(user: any) {
        user.isReadonly = !user.isReadonly
    }

}
