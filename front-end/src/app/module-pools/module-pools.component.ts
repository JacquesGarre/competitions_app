import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Pool } from './pool';
import { PoolService } from './pool.service';
import { Router } from '@angular/router';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap, faGem, faObjectUngroup } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModulePoolsAddModalFormComponent } from './module-pools-add-modal-form/module-pools-add-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { OrganizationService } from '../module-organizations/organization.service';
import { TournamentService } from '../module-tournaments/tournament.service';

import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../module-users/user.service';

@Component({
    selector: 'app-module-pools',
    templateUrl: './module-pools.component.html',
    styleUrls: ['./module-pools.component.css'],
    providers: [DatePipe]
})
export class ModulePoolsComponent implements OnInit {

    faGem = faGem;
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
    tournaments: any = [];
    poolForm: any;
    allPoolDetails: any;
    forms: any = [];
    currentUser: any;

    constructor(
        private token: TokenStorageService,
        public service: PoolService,
        public userService: UserService,
        public organizationService: OrganizationService,
        public tournamentService: TournamentService,
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

    ngOnInit(): void {
        this.ngxLoader.startLoader('page-loader');
        this.currentUser = this.token.getUser();
        this.initPools();
    }

    initPools() {
        this.userService.getUserByEmail(this.currentUser.email).subscribe((data: any) => {
            if (data.length) {
                this.currentUser = data[0];
            }
            this.tournamentService.getTournaments().subscribe((data: any) => {
                this.tournaments = data;
                this.service.getPools().subscribe((data: any) => {
                    if (data.length) {
                        this.pools = data;
                        this.poolForm = this.formBuilder.group({
                            poolDetails: this.formBuilder.array(
                                this.pools.map((x: any) => {
                                    var tournament: any = this.tournaments.filter((tournament: any) => {
                                        return tournament.id.toString() === x.tournament.replace('/api/tournaments/','')
                                    })[0]?.name
                                    return this.formBuilder.group({
                                        id: [x.id, [Validators.required, Validators.minLength(2)]],
                                        name: [x.name, [Validators.required, Validators.minLength(2)]],
                                        tournament: [tournament, [Validators.required, Validators.minLength(2)]],
                                        createdAt: [x.createdAt, [Validators.required, Validators.minLength(2)]],
                                        startDate: [x.startDate, [Validators.required, Validators.minLength(2)]],
                                        endDate: [x.endDate, [Validators.required, Validators.minLength(2)]],
                                        minPoints: [x.minPoints, [Validators.required, Validators.minLength(2)]],
                                        maxPoints: [x.maxPoints, [Validators.required, Validators.minLength(2)]],
                                        price: [x.price, [Validators.required, Validators.minLength(2)]],
                                        updatedAt: x.updatedAt,
                                        isReadonly: true
                                    })
                                })
                            )
                        })
                    } else {
                        this.pools = [];
                    }
                    this.ngxLoader.stopLoader('page-loader');
                    this.ngxLoader.stopLoader('task-loader');
                })
            })
        })
    }

    // Create pool
    createPool() {
        const modalRef = this.modalService.open(ModulePoolsAddModalFormComponent, { centered: true });
        modalRef.result.then((result) => {
            if (result == 'save') {
                this.ngxLoader.startLoader('task-loader');
                let values = modalRef.componentInstance.addForm.value;
                let pool: any = {
                    name: values.name,
                    tournament: 'api/tournaments/' + values.tournament,
                    minPoints: parseInt(values.minPoints),
                    maxPoints: parseInt(values.maxPoints),
                    startDate: new Date(Date.parse(values.startDate)+7200*1000).toUTCString(),
                    endDate: new Date(Date.parse(values.endDate)+7200*1000).toUTCString(),
                    price: parseFloat(values.price)
                }
                this.service.createPool(pool).subscribe(data => {
                    this.initPools();
                })
            }
        });
    }

    // Delete pool
    deletePool(pool: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Suppression d\'un tableau';
        modalRef.componentInstance.content = 'Êtes-vous sûr de vouloir supprimer le tableau <i>' + pool.name + '</i> ?';
        modalRef.componentInstance.confirmBtn = 'Confirmer';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
                this.ngxLoader.startLoader('task-loader');
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
