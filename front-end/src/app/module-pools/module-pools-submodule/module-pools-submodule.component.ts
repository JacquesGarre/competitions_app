import { Component, ElementRef, Input, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Pool } from '../pool';
import { PoolService } from '../pool.service';
import { UserService } from '../../module-users/user.service';
import { Router } from '@angular/router';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap, faTimes, faObjectUngroup } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { ModulePoolsAddModalFormComponent } from '../module-pools-add-modal-form/module-pools-add-modal-form.component';
import { ModulePoolsLinkModalFormComponent } from '../module-pools-link-modal-form/module-pools-link-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'app-module-pools-submodule',
    templateUrl: './module-pools-submodule.component.html',
    styleUrls: ['./module-pools-submodule.component.css'],
    providers: [DatePipe]
})
export class ModulePoolsSubmoduleComponent implements OnChanges {

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

    pools: any = [];
    poolForm: any;
    allPoolDetails: any;
    forms: any = [];

    @Input() parent: any;
    @Input() parentModule: any;

    constructor(
        public service: PoolService,
        public userService: UserService,
        private modalService: NgbModal,
        private router: Router,
        private datePipe: DatePipe,
        private ngxLoader: NgxUiLoaderService,
        private formBuilder: FormBuilder
    ) {
        this.poolForm = this.formBuilder.group({
            poolDetails: this.formBuilder.array([])
        });
    }

    ngOnChanges(): void {
        this.initPools();
    }

    initPools() {
        this.ngxLoader.startLoader('submodule-loader');
        // Pools as submodule in user
        if(this.parent.id && this.parentModule == 'tournaments'){
            this.service.getPoolsByTournament(this.parent.id).subscribe((data: any) => {
                if (data.length) {
                    this.pools = data;
                    this.poolForm = this.formBuilder.group({
                        poolDetails: this.formBuilder.array(
                            this.pools.map((x: any) => 
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
                    this.pools = [];
                }
                this.ngxLoader.stopLoader('submodule-loader');
            })
        }

        // Pools as submodule in registration
        if(this.parent.id && this.parentModule == 'registrations'){
            this.service.getPoolsByRegistration(this.parent.id).subscribe((data: any) => {
                if (data.length) {
                    this.pools = data;
                    this.poolForm = this.formBuilder.group({
                        poolDetails: this.formBuilder.array(
                            this.pools.map((x: any) => 
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
                    this.pools = [];
                }
                this.ngxLoader.stopLoader('submodule-loader');
            })
        }
    }

    // Create pool
    createPool() {
        const modalRef = this.modalService.open(ModulePoolsLinkModalFormComponent, { centered: true });
        modalRef.result.then((result) => {
            if (result == 'save') {
                this.ngxLoader.startLoader('task-loader');
                let values = modalRef.componentInstance.addForm.value;
                let pool: any = {
                    name: values.name,
                    tournament: 'api/tournaments/' + this.parent.id,
                    minPoints: parseInt(values.minPoints),
                    maxPoints: parseInt(values.maxPoints),
                    startDate: new Date(Date.parse(values.startDate)+7200*1000).toUTCString(),
                    endDate: new Date(Date.parse(values.endDate)+7200*1000).toUTCString(),
                    price: parseFloat(values.price)
                }
                this.service.createPool(pool).subscribe(data => {
                    this.initPools();
                    this.ngxLoader.stopLoader('task-loader');
                })
            }
        });
    }

    // Remove pool from parent module
    removePool(pool: any) {
        switch(this.parentModule){
            case 'users':
                const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
                modalRef.componentInstance.title = 'Removing user from pool';
                modalRef.componentInstance.content = 'Are you sure you want to remove <i>' + this.parent.firstName + ' ' + this.parent.lastName + '</i> from <i>' + pool.name + '</i>?';
                modalRef.componentInstance.confirmBtn = 'Confirm';
                modalRef.result.then((result) => {
                    if (result == 'confirm') {
                        this.ngxLoader.startLoader('submodule-loader');
                        const index: number = pool.users.indexOf('/api/users/'+this.parent.id);
                        if (index !== -1) {
                            pool.users.splice(index, 1);
                            this.service.updatePool(pool.id, pool).subscribe((data: any) => {
                                this.initPools();
                                this.ngxLoader.stopLoader('submodule-loader');
                            })
                        }                
                    }
                });
            break;
        }
    }


    // Delete pool
    deletePool(pool: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Deleting a pool';
        modalRef.componentInstance.content = 'Are you sure you want to delete <i>' + pool.name + '</i> ?';
        modalRef.componentInstance.confirmBtn = 'Confirm';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
                this.ngxLoader.startLoader('submodule-loader');
                this.service.deletePool(pool.id).subscribe(data => {
                    this.initPools();
                    this.ngxLoader.stopLoader('submodule-loader');
                })
            }
        });
    }

    // Shows details
    showPool(pool: any) {
        this.router.navigate(['/admin/pools/' + pool.id])
    }

    // On submit inline edit form
    onSubmit(pool: any) {
        const name = pool.name;
        this.service.updatePool(pool.id, {
            name
        }).subscribe((data: any) => {
            pool = data;
        })
        this.toggleForm(pool)
    }

    toggleForm(pool: any) {
        pool.isReadonly = !pool.isReadonly
    }

}
