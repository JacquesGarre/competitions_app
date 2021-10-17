import { Component, ElementRef, Input, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Registration } from '../registration';
import { RegistrationService } from '../registration.service';
import { UserService } from '../../module-users/user.service';
import { Router } from '@angular/router';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap, faTimes, faObjectUngroup } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { ModuleRegistrationsAddModalFormComponent } from '../module-registrations-add-modal-form/module-registrations-add-modal-form.component';
import { ModuleRegistrationsLinkModalFormComponent } from '../module-registrations-link-modal-form/module-registrations-link-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'app-module-registrations-submodule',
    templateUrl: './module-registrations-submodule.component.html',
    styleUrls: ['./module-registrations-submodule.component.css'],
    providers: [DatePipe]
})
export class ModuleRegistrationsSubmoduleComponent implements OnChanges {

    faTimes = faTimes;
    faSitemap = faSitemap;
    faUser = faUser;
    faTrashAlt = faTrashAlt;
    faPencilAlt = faPencilAlt;
    faTrash = faTrash;
    faPen = faPen;
    faEye = faEye;
    faPlus = faPlus;
    faObjectUngroup = faObjectUngroup;

    registrations: any = [];
    registrationForm: any;
    allRegistrationDetails: any;
    forms: any = [];

    @Input() parent: any;
    @Input() parentModule: any;

    constructor(
        public service: RegistrationService,
        public userService: UserService,
        private modalService: NgbModal,
        private router: Router,
        private datePipe: DatePipe,
        private ngxLoader: NgxUiLoaderService,
        private formBuilder: FormBuilder
    ) {
        this.registrationForm = this.formBuilder.group({
            registrationDetails: this.formBuilder.array([])
        });
    }

    ngOnChanges(): void {
        this.initRegistrations();
    }

    initRegistrations() {
        // Registrations as submodule in user
        if(this.parent.id && this.parentModule == 'tournaments'){
            this.service.getRegistrationsByTournament(this.parent.id).subscribe((data: any) => {
                if (data.length) {
                    this.registrations = data;
                    this.registrationForm = this.formBuilder.group({
                        registrationDetails: this.formBuilder.array(
                            this.registrations.map((x: any) => 
                                this.formBuilder.group({
                                    id: [x.id, [Validators.required, Validators.minLength(2)]],
                                    name: [x.name, [Validators.required, Validators.minLength(2)]],
                                    minPoints: [x.minPoints, [Validators.required, Validators.minLength(2)]],
                                    maxPoints: [x.maxPoints, [Validators.required, Validators.minLength(2)]],
                                    startDate: [x.startDate, [Validators.required, Validators.minLength(2)]],
                                    endDate: [x.endDate, [Validators.required, Validators.minLength(2)]],
                                    price: [x.price, [Validators.required, Validators.minLength(2)]],
                                    createdAt: [x.createdAt, [Validators.required, Validators.minLength(2)]],
                                    updatedAt: x.updatedAt, 
                                    isReadonly: true
                                })
                            )
                        )
                    })
                } else {
                    this.registrations = [];
                }
            })
        }
    }

    // Create registration
    createRegistration() {
        const modalRef = this.modalService.open(ModuleRegistrationsLinkModalFormComponent, { centered: true });
        modalRef.result.then((result) => {
            if (result == 'save') {
                this.ngxLoader.startLoader('page-loader');
                let values = modalRef.componentInstance.addForm.value;
                let registration: any = {
                    name: values.name,
                    tournament: 'api/tournaments/' + this.parent.id,
                    minPoints: parseInt(values.minPoints),
                    maxPoints: parseInt(values.maxPoints),
                    startDate: new Date(Date.parse(values.startDate)+7200*1000).toUTCString(),
                    endDate: new Date(Date.parse(values.endDate)+7200*1000).toUTCString(),
                    price: parseFloat(values.price)
                }
                this.service.createRegistration(registration).subscribe(data => {
                    this.initRegistrations();
                    this.ngxLoader.stopLoader('page-loader');
                })
            }
        });
    }

    // Remove registration from parent module
    removeRegistration(registration: any) {
        switch(this.parentModule){
            case 'users':
                const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
                modalRef.componentInstance.title = 'Removing user from registration';
                modalRef.componentInstance.content = 'Are you sure you want to remove <i>' + this.parent.firstName + ' ' + this.parent.lastName + '</i> from <i>' + registration.name + '</i>?';
                modalRef.componentInstance.confirmBtn = 'Confirm';
                modalRef.result.then((result) => {
                    if (result == 'confirm') {
                        const index: number = registration.users.indexOf('/api/users/'+this.parent.id);
                        if (index !== -1) {
                            registration.users.splice(index, 1);
                            this.service.updateRegistration(registration.id, registration).subscribe((data: any) => {
                                this.initRegistrations();
                            })
                        }                
                    }
                });
            break;
        }
    }


    // Delete registration
    deleteRegistration(registration: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Deleting a registration';
        modalRef.componentInstance.content = 'Are you sure you want to delete <i>' + registration.name + '</i> ?';
        modalRef.componentInstance.confirmBtn = 'Confirm';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
                this.service.deleteRegistration(registration.id).subscribe(data => {
                    this.initRegistrations();
                })
            }
        });
    }

    // Shows details
    showRegistration(registration: any) {
        this.router.navigate(['/admin/registrations/' + registration.id])
    }

    // On submit inline edit form
    onSubmit(registration: any) {
        const name = registration.name;
        this.service.updateRegistration(registration.id, {
            name
        }).subscribe((data: any) => {
            registration = data;
        })
        this.toggleForm(registration)
    }

    toggleForm(registration: any) {
        registration.isReadonly = !registration.isReadonly
    }

}
