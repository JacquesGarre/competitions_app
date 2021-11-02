import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../module-organizations/organization.service';
import { TournamentService } from '../module-tournaments/tournament.service';

import {
    faCalendarCheck,
    faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { PoolService } from '../module-pools/pool.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

    organization: any;
    tournament: any;
    pools: any;
    addForm: any;
    payableAmount: any = 0.0;
    selectedPools: [] = [];
    registrationID: any;
    licenceNumber: any;
    genre: any;
    email: any;
    firstName: any;
    lastName:any;


    faCalendarCheck = faCalendarCheck;
    faMapMarkerAlt = faMapMarkerAlt;

    constructor(
        private route: ActivatedRoute,
        public organizationService: OrganizationService,
        public tournamentService: TournamentService,
        public poolService: PoolService,
        private formBuilder: FormBuilder,
    ) {

        const slug = this.route.snapshot.paramMap.get('slug');
        const uri = this.route.snapshot.paramMap.get('uri');

        // get current organization & tournament
        this.organizationService.getOrganizationBySlug(slug).subscribe((data: any) => {
            if(data.length){
                this.organization = data[0];
                this.tournamentService.getTournamentByOrganizationAndUri(this.organization.id, uri).subscribe((data: any) => {
                    if(data.length){
                        this.tournament = data[0];
                        this.poolService.getPoolsByTournament(this.tournament.id).subscribe((data: any) => {
                            if(data.length){
                                this.pools = data;
                            }
                        })
                    }
                })
            }
        })

        this.addForm = new FormGroup({
            licenceNumber: new FormControl(
                this.licenceNumber, 
                [
                    Validators.required
                ]
            ),
            firstName: new FormControl(
                this.firstName, 
                [
                    Validators.required
                ]
            ),
            lastName: new FormControl(
                this.lastName, 
                [
                    Validators.required
                ]
            ),
            email: new FormControl(
                this.email, 
                [
                    Validators.required
                ]
            ),
            tournament: new FormControl(
                this.tournament,
                [
                    Validators.required
                ]
            ),
            selectedPools: new FormControl(
                this.selectedPools,
                [
                    Validators.required
                ]
            ),
            registrationID: new FormControl(
                this.registrationID,
                []
            ),
            payableAmount: new FormControl(
                this.payableAmount,
                []
            ),
            genre: new FormControl(
                this.genre, 
                []
            )
        });


    }

    ngOnInit(): void {

    }

    calculatePayableAmount(){
        this.addForm.value.selectedPools;
        let payableAmount = 0;
        this.addForm.value.selectedPools.map((selectedPool: any) => {
            const pool = this.pools.filter((el: any) => {
                return el.id === selectedPool.id
            })[0];
            payableAmount += pool.price;
        })
        this.payableAmount = payableAmount.toString();
        this.addForm.controls.payableAmount.setValue(this.payableAmount);
    }

    submitForm(){
        alert('submit');
    }


}
