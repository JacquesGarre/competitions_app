import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
    constructor() { }

    signOut(): void {
        window.sessionStorage.clear();
    }

    public saveToken(token: string): void {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): string | null {
        let token = window.sessionStorage.getItem(TOKEN_KEY);
        return token;
    }

    public saveUser(user: any): void {
        window.sessionStorage.removeItem(USER_KEY);
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    public getUser(): any {
        let token = window.sessionStorage.getItem(USER_KEY);
        const helper = new JwtHelperService();
        const user = helper.decodeToken(token!);
        user.email = user.username;
        if (user) {
            return user;
        }
        return {};
    }

}
