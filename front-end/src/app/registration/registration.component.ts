import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../module-organizations/organization.service';
import { TournamentService } from '../module-tournaments/tournament.service';

import {
    faCalendarCheck,
    faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

    organization: any;
    tournament: any;
    faCalendarCheck = faCalendarCheck;
    faMapMarkerAlt = faMapMarkerAlt;

    constructor(
        private route: ActivatedRoute,
        public organizationService: OrganizationService,
        public tournamentService: TournamentService,
    ) { }

    ngOnInit(): void {
        const slug = this.route.snapshot.paramMap.get('slug');
        const uri = this.route.snapshot.paramMap.get('uri');

        // get current organization & tournament
        this.organizationService.getOrganizationBySlug(slug).subscribe((data: any) => {
            if(data.length){
                this.organization = data[0];
                this.tournamentService.getTournamentByOrganizationAndUri(this.organization.id, uri).subscribe((data: any) => {
                    if(data.length){
                        this.tournament = data[0];
                    }
                })
            }
        })
    }

}
