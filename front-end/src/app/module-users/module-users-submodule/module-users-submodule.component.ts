import { Component, ElementRef, Input, OnDestroy, ViewChild, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { User } from '../user';
import { UserService } from '../user.service';
import { Organization } from '../../module-organizations/organization';
import { OrganizationService } from '../../module-organizations/organization.service';
import { Router } from '@angular/router';

import { faUsers, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap, faTimes } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { ModuleUsersAddModalFormComponent } from '../module-users-add-modal-form/module-users-add-modal-form.component';
import { ModuleUsersLinkModalFormComponent } from '../module-users-link-modal-form/module-users-link-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'app-module-users-submodule',
    templateUrl: './module-users-submodule.component.html',
    styleUrls: ['./module-users-submodule.component.css'],
    providers: [DatePipe]
})
export class ModuleUsersSubmoduleComponent implements OnChanges {

    faTimes = faTimes;
    faUsers = faUsers;
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

    @Input() parent: any;
    @Input() parentModule: any;

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

    ngOnChanges(): void {
        this.initUsers();
    }

    initUsers() {
        // Users as submodule in organization
        if(this.parent.id && this.parentModule == 'organizations'){
            this.service.getUsersByOrganization(this.parent.id).subscribe((data: any) => {
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
                                    organizations: [x.organizations, [Validators.required, Validators.minLength(2)]],
                                    createdAt: [x.createdAt, [Validators.required, Validators.minLength(2)]],
                                    updatedAt: x.updatedAt, 
                                    isReadonly: true
                                })
                            })
                        )
                    })
                } else {
                    this.users = [];
                }
            })
        }


    }

    // Add user to parent module
    linkUser() {
        const modalRef = this.modalService.open(ModuleUsersLinkModalFormComponent, { centered: true });
        modalRef.result.then((result) => {
            if (result == 'save') {
                let values = modalRef.componentInstance.addForm.value;
                switch(this.parentModule){
                    case 'organizations':
                        this.service.getUser(values.userId).subscribe((user: any) => {
                            if (!this.parent.users.includes('/api/users/'+user.id)) {
                                this.parent.users.push('/api/users/'+user.id);
                                this.organizationService.updateOrganization(this.parent.id, this.parent).subscribe((data: any) => {
                                    this.initUsers();
                                })
                            }
                        })
                    break;
                }
            }
        });
    }

    // Remove user from parent module
    removeUser(user: any) {
        switch(this.parentModule){
            case 'organizations':
                this.service.getUser(user.id).subscribe((user: any) => {
                    const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
                    modalRef.componentInstance.title = 'Removing user from organization';
                    modalRef.componentInstance.content = 'Are you sure you want to remove <i>' + user.firstName + ' ' + user.lastName + '</i> from <i>' + this.parent.name + '</i>?';
                    modalRef.componentInstance.confirmBtn = 'Confirm';
                    modalRef.result.then((result) => {
                        if (result == 'confirm') {
                            const index: number = this.parent.users.indexOf('/api/users/'+user.id);
                            if (index !== -1) {
                                this.parent.users.splice(index, 1);
                                this.organizationService.updateOrganization(this.parent.id, this.parent).subscribe((data: any) => {
                                    this.initUsers();
                                })
                            }                
                        }
                    });
                })
            break;
        }
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