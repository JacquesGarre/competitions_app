import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form: any = {
        email: null,
        password: null
    };
    isLoggedIn = false;
    isLoginFailed = false;
    errorMessage = '';
    roles: string[] = [];

    constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

    ngOnInit(): void {
        if (this.tokenStorage.getToken()) {
            this.isLoggedIn = true;
            this.roles = this.tokenStorage.getUser().roles;
            if(this.roles.includes('ROLE_ADMIN')){
                this.router.navigate(['/admin'])
            }
            if(this.roles.includes('ROLE_MODERATOR')){
                this.router.navigate(['/mod'])
            }
            if(this.roles.includes('ROLE_USER') && !this.roles.includes('ROLE_ADMIN') && !this.roles.includes('ROLE_MODERATOR')){
                this.router.navigate(['/user'])
            }
        }
    }

    onSubmit(): void {
        const { email, password } = this.form;

        this.authService.login(email, password).subscribe(
            data => {
                this.tokenStorage.saveToken(data.token);
                this.tokenStorage.saveUser(data);
                this.isLoginFailed = false;
                this.isLoggedIn = true;
                this.roles = this.tokenStorage.getUser().roles;
                if(this.roles.includes('ROLE_ADMIN')){
                    this.router.navigate(['/admin'])
                }
                if(this.roles.includes('ROLE_MODERATOR')){
                    this.router.navigate(['/mod'])
                }
                if(this.roles.includes('ROLE_USER') && !this.roles.includes('ROLE_ADMIN') && !this.roles.includes('ROLE_MODERATOR')){
                    this.router.navigate(['/user'])
                }
            },
            err => {
                this.errorMessage = err.error.message;
                this.isLoginFailed = true;
            }
        );
    }

    reloadPage(): void {
        window.location.reload();
    }
}
