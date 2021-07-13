import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    content?: string;
    private roles: string[] = [];
    isLoggedIn = false;
    showAdminBoard = false;
    showModeratorBoard = false;
    showUserBoard = false;
    username?: string;

    constructor(private userService: UserService, private tokenStorageService: TokenStorageService) { }

    ngOnInit(): void {
        this.userService.getPublicContent().subscribe(
            data => {
                this.content = data;
            },
            err => {
                this.content = JSON.parse(err.error).message;
            }
        );

        this.isLoggedIn = !!this.tokenStorageService.getToken();
        
        if (this.isLoggedIn) {
            const user = this.tokenStorageService.getUser();

            this.roles = user.roles;
            this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
            this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
            this.showUserBoard = this.roles.includes('ROLE_USER') && !this.roles.includes('ROLE_ADMIN');
            this.username = user.username;

        }
    }

    logout(): void {
        this.tokenStorageService.signOut();
        window.location.reload();
    }

}
