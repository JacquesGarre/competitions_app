import { Component, ElementRef, Input, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Pool } from '../pool';
import { PoolService } from '../pool.service';
import { UserService } from '../../module-users/user.service';
import { Router } from '@angular/router';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap, faTimes} from '@fortawesome/free-solid-svg-icons';

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
        // Pools as submodule in user
        if(this.parent.id && this.parentModule == 'users'){
            this.service.getPoolsByUser(this.parent.id).subscribe((data: any) => {
                if (data.length) {
                    this.pools = data;
                    this.poolForm = this.formBuilder.group({
                        poolDetails: this.formBuilder.array(
                            this.pools.map((x: any) => 
                                this.formBuilder.group({
                                    id: [x.id, [Validators.required, Validators.minLength(2)]],
                                    name: [x.name, [Validators.required, Validators.minLength(2)]],
                                    subdomain: [x.subdomain, [Validators.required, Validators.minLength(2)]],
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
            })
        }
    }

    // Add orga to parent module
    linkPool() {
        const modalRef = this.modalService.open(ModulePoolsLinkModalFormComponent, { centered: true });
        modalRef.componentInstance.parentPoolIDS = this.parent.pools.map((url: any) => {return url.replace('/api/pools/', '')})
        modalRef.result.then((result) => {
            if (result == 'save') {
                let values = modalRef.componentInstance.addForm.value;
                switch(this.parentModule){
                    case 'users':
                        this.service.getPool(values.poolId).subscribe((pool: any) => {
                            console.log(this.parent.pools);
                            if (!pool.users.includes(this.parent.id)) {
                                pool.users.push('/api/users/'+this.parent.id);
                                this.service.updatePool(pool.id, pool).subscribe((data: any) => {
                                    this.initPools();
                                })
                            }
                        })
                    break;
                }
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
                        const index: number = pool.users.indexOf('/api/users/'+this.parent.id);
                        if (index !== -1) {
                            pool.users.splice(index, 1);
                            this.service.updatePool(pool.id, pool).subscribe((data: any) => {
                                this.initPools();
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
        modalRef.componentInstance.title = 'Deleting an pool';
        modalRef.componentInstance.content = 'Are you sure you want to delete <i>' + pool.name + '</i> ?';
        modalRef.componentInstance.confirmBtn = 'Confirm';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
                this.service.deletePool(pool.id).subscribe(data => {
                    this.initPools();
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
