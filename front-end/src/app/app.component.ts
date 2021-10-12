import { Component } from '@angular/core';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { TokenStorageService } from './_services/token-storage.service';
import { UserService } from './module-users/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    private roles: string[] = [];
    isLoggedIn = false;
    showAdminBoard = false;
    showModeratorBoard = false;
    username?: string;
    user: any;

    constructor(
        dateTimeAdapter: DateTimeAdapter<any>,
        private tokenStorageService: TokenStorageService, 
        public userService: UserService
    ) {}

    ngOnInit(): void {
        this.isLoggedIn = !!this.tokenStorageService.getToken();

        if (this.isLoggedIn) {
        const user = this.tokenStorageService.getUser();

        this.userService.getUserByEmail(user.email).subscribe((data: any) => {
            if (data.length) {
                this.user = data;
            }
        })

        this.roles = user.roles;
        this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
        this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
        this.username = user.username;
        
        }
    }

    logout(): void {
        this.tokenStorageService.signOut();
        window.location.reload();
    }
}
