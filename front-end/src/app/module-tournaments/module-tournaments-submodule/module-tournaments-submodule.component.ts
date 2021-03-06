import { Component, ElementRef, Input, OnDestroy, OnChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Tournament } from '../tournament';
import { TournamentService } from '../tournament.service';
import { UserService } from '../../module-users/user.service';
import { Router } from '@angular/router';

import { faUser, faTrashAlt, faPencilAlt, faPlus, faEye, faTrash, faPen, faSitemap, faTimes} from '@fortawesome/free-solid-svg-icons';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '../../modal-confirm/modal-confirm.component';
import { ModuleTournamentsAddModalFormComponent } from '../module-tournaments-add-modal-form/module-tournaments-add-modal-form.component';
import { ModuleTournamentsLinkModalFormComponent } from '../module-tournaments-link-modal-form/module-tournaments-link-modal-form.component';

import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'app-module-tournaments-submodule',
    templateUrl: './module-tournaments-submodule.component.html',
    styleUrls: ['./module-tournaments-submodule.component.css'],
    providers: [DatePipe]
})
export class ModuleTournamentsSubmoduleComponent implements OnChanges {

    faTimes = faTimes;
    faSitemap = faSitemap;
    faUser = faUser;
    faTrashAlt = faTrashAlt;
    faPencilAlt = faPencilAlt;
    faTrash = faTrash;
    faPen = faPen;
    faEye = faEye;
    faPlus = faPlus;
    tournaments: any = [];
    tournamentForm: any;
    allTournamentDetails: any;
    forms: any = [];

    @Input() parent: any;
    @Input() parentModule: any;

    constructor(
        public service: TournamentService,
        public userService: UserService,
        private modalService: NgbModal,
        private router: Router,
        private datePipe: DatePipe,
        private ngxLoader: NgxUiLoaderService,
        private formBuilder: FormBuilder
    ) {
        this.tournamentForm = this.formBuilder.group({
            tournamentDetails: this.formBuilder.array([])
        });
    }

    ngOnChanges(): void {
        this.initTournaments();
    }

    initTournaments() {
        this.ngxLoader.startLoader('submodule-loader');
        // Tournaments as submodule in user
        if(this.parent.id && this.parentModule == 'users'){
            this.service.getTournamentsByUser(this.parent.id).subscribe((data: any) => {
                if (data.length) {
                    this.tournaments = data;
                    this.tournamentForm = this.formBuilder.group({
                        tournamentDetails: this.formBuilder.array(
                            this.tournaments.map((x: any) => 
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
                    this.tournaments = [];
                }
                this.ngxLoader.stopLoader('submodule-loader');
            })
        }
    }

    // Add orga to parent module
    linkTournament() {
        const modalRef = this.modalService.open(ModuleTournamentsLinkModalFormComponent, { centered: true });
        modalRef.componentInstance.parentTournamentIDS = this.parent.tournaments.map((url: any) => {return url.replace('/tournaments/', '')})
        modalRef.result.then((result) => {
            if (result == 'save') {
                this.ngxLoader.startLoader('submodule-loader');
                let values = modalRef.componentInstance.addForm.value;
                switch(this.parentModule){
                    case 'users':
                        this.service.getTournament(values.tournamentId).subscribe((tournament: any) => {
                            console.log(this.parent.tournaments);
                            if (!tournament.users.includes(this.parent.id)) {
                                tournament.users.push('/users/'+this.parent.id);
                                this.service.updateTournament(tournament.id, tournament).subscribe((data: any) => {
                                    this.initTournaments();
                                    this.ngxLoader.stopLoader('submodule-loader');
                                })
                            }
                        })
                    break;
                }
            }
        });
    }

    // Remove tournament from parent module
    removeTournament(tournament: any) {
        switch(this.parentModule){
            case 'users':
                const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
                modalRef.componentInstance.title = 'Supprimer un utilisateur d\'un tournoi';
                modalRef.componentInstance.content = '??tes-vous s??r de vouloir supprimer <i>' + this.parent.firstName + ' ' + this.parent.lastName + '</i> de <i>' + tournament.name + '</i>?';
                modalRef.componentInstance.confirmBtn = 'Confirm';
                modalRef.result.then((result) => {
                    if (result == 'confirm') {
                        this.ngxLoader.startLoader('submodule-loader');
                        const index: number = tournament.users.indexOf('/users/'+this.parent.id);
                        if (index !== -1) {
                            tournament.users.splice(index, 1);
                            this.service.updateTournament(tournament.id, tournament).subscribe((data: any) => {
                                this.initTournaments();
                                this.ngxLoader.stopLoader('submodule-loader');
                            })
                        }                
                    }
                });
            break;
        }
    }


    // Delete tournament
    deleteTournament(tournament: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, { centered: true });
        modalRef.componentInstance.title = 'Suppression d\'un tournoi';
        modalRef.componentInstance.content = '??tes-vous s??r de vouloir supprimer <i>' + tournament.name + '</i> ?';
        modalRef.componentInstance.confirmBtn = 'Confirmer';
        modalRef.result.then((result) => {
            if (result == 'confirm') {
                this.ngxLoader.startLoader('submodule-loader');
                this.service.deleteTournament(tournament.id).subscribe(data => {
                    this.initTournaments();
                    this.ngxLoader.stopLoader('submodule-loader');
                })
            }
        });
    }

    // Shows details
    showTournament(tournament: any) {
        this.router.navigate(['/admin/tournaments/' + tournament.id])
    }

    // On submit inline edit form
    onSubmit(tournament: any) {
        const name = tournament.name;
        this.service.updateTournament(tournament.id, {
            name
        }).subscribe((data: any) => {
            tournament = data;
        })
        this.toggleForm(tournament)
    }

    toggleForm(tournament: any) {
        tournament.isReadonly = !tournament.isReadonly
    }

}
