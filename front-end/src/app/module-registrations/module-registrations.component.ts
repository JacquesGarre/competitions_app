import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Registration } from './registration';
import { RegistrationService } from './registration.service';
import { Router } from '@angular/router';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap, faGem, faObjectUngroup, faClipboardList,faCheck,faTimes } from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModuleRegistrationsAddModalFormComponent } from './module-registrations-add-modal-form/module-registrations-add-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { OrganizationService } from '../module-organizations/organization.service';
import { TournamentService } from '../module-tournaments/tournament.service';
import { PoolService } from '../module-pools/pool.service';

import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../module-users/user.service';

@Component({
    selector: 'app-module-registrations',
    templateUrl: './module-registrations.component.html',
    styleUrls: ['./module-registrations.component.css'],
    providers: [DatePipe]
})
export class ModuleRegistrationsComponent implements OnInit {

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
    faClipboardList = faClipboardList;
    faCheck = faCheck;
    faTimes = faTimes;

    registrations: any = [];
    tournaments: any = [];
    registrationForm: any;
    allRegistrationDetails: any;
    forms: any = [];
    currentUser: any;
    users: any = [];
    pools: any = [];

    constructor(
        private token: TokenStorageService,
        public service: RegistrationService,
        public userService: UserService,
        public poolService: PoolService,
        public organizationService: OrganizationService,
        public tournamentService: TournamentService,
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

    ngOnInit(): void {
        this.ngxLoader.startLoader('page-loader');
        this.currentUser = this.token.getUser();
        this.initRegistrations();
    }

    initRegistrations() {
        this.userService.getUserByEmail(this.currentUser.email).subscribe((data: any) => {
            if (data.length) {
                this.currentUser = data[0];
            }
            this.poolService.getPools().subscribe((data: any) => {
                this.pools = data;
                this.userService.getUsers().subscribe((data: any) => {
                    this.users = data;
                    this.tournamentService.getTournaments().subscribe((data: any) => {
                        this.tournaments = data;
                        this.service.getRegistrations().subscribe((data: any) => {
                            if (data.length) {
                                this.registrations = data;
                                this.registrationForm = this.formBuilder.group({
                                    registrationDetails: this.formBuilder.array(
                                        this.registrations.map((x: any) => {
                                            var tournament: any = this.tournaments.filter((tournament: any) => {
                                                return tournament.id.toString() === x.tournament.replace('/api/tournaments/','')
                                            })[0]?.name
                                            var user: any = this.users.filter((user: any) => {
                                                return user.id.toString() === x.user.replace('/api/users/','')
                                            })[0];
                                            user = user.firstName + ' ' + user.lastName;
                                            var pools: any = this.pools.filter((pool: any) => {
                                                return x.pools.includes('/api/pools/'+pool.id.toString())
                                            });
                                            var poolsTxt: any = pools.map((pool: any) => {
                                                return pool.name;
                                            }).join(", ")
                                            console.log(pools)
                                            return this.formBuilder.group({
                                                id: [x.id, [Validators.required, Validators.minLength(2)]],
                                                user: [user, [Validators.required, Validators.minLength(2)]],
                                                tournament: [tournament, [Validators.required, Validators.minLength(2)]],
                                                payableAmount: [x.payableAmount, [Validators.required, Validators.minLength(2)]],
                                                paidAmount: [x.paidAmount, [Validators.required, Validators.minLength(2)]],
                                                jerseyNumber: [x.jerseyNumber, [Validators.required, Validators.minLength(2)]],
                                                pools: [poolsTxt],
                                                createdAt: [x.createdAt, [Validators.required, Validators.minLength(2)]],
                                                updatedAt: x.updatedAt,
                                                isReadonly: true
                                            })
                                        })
                                    )
                                })
                            }
                            this.ngxLoader.stopLoader('page-loader');
                        })
                    })
                });
            });
        })
    }

    // Create registration
    createRegistration() {
        const modalRef = this.modalService.open(ModuleRegistrationsAddModalFormComponent, { centered: true });
        modalRef.result.then((result) => {
            if (result == 'save') {
                this.ngxLoader.startLoader('page-loader');
                let values = modalRef.componentInstance.addForm.value;
                let registration: any = {
                    name: values.name,
                    tournament: 'api/tournaments/' + values.tournament,
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
