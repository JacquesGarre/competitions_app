import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { User } from './user';
import { UserService } from './user.service';
import { Organization } from '../module-organizations/organization';
import { OrganizationService } from '../module-organizations/organization.service';
import { Router } from '@angular/router';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModuleUsersAddModalFormComponent } from './module-users-add-modal-form/module-users-add-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'app-module-users',
    templateUrl: './module-users.component.html',
    styleUrls: ['./module-users.component.css'],
    providers: [DatePipe]
})
export class ModuleUsersComponent implements OnInit {

    faUser = faUser;
    faTrashAlt = faTrashAlt;
    faPencilAlt = faPencilAlt;
    faTrash = faTrash;
    faPen = faPen;
    faEye = faEye;
    faPlus = faPlus;
    faSitemap = faSitemap;
    users: any = [];
    userForm: any;
    allUserDetails: any;
    forms: any = [];

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
        this.ngxLoader.startLoader('page-loader');
        this.initUsers();
    }

    initUsers() {
        this.service.getUsers().subscribe((data: any) => {
            if (data.length) {
                this.users = data;
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
            }
            this.ngxLoader.stopLoader('page-loader');
        })
    }

    // Create user
    createUser() {
        const modalRef = this.modalService.open(ModuleUsersAddModalFormComponent, { centered: true });
        modalRef.result.then((result) => {
            if (result == 'save') {
                this.ngxLoader.startLoader('page-loader');
                let values = modalRef.componentInstance.addForm.value;
                let user: any = {
                    email: values.email,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    password: values.password
                }
                this.service.createUser(user).subscribe(() => {
                    this.initUsers();
                })
            }
        });
    }

    // Delete user
    deleteUser(user: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Deleting a user';
        modalRef.componentInstance.content = 'Are you sure you want to delete <i>' + user.firstName + ' ' + user.lastName + '</i> ?';
        modalRef.componentInstance.confirmBtn = 'Confirm';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
                this.service.deleteUser(user.id).subscribe(() => {
                    this.initUsers();
                })
            }
        });
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
