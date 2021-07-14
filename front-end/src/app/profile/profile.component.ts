import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    currentUser: any;

    constructor(private token: TokenStorageService) { }

    ngOnInit(): void {
        this.currentUser = this.token.getUser();
    }
}
