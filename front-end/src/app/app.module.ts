import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { NgxUiLoaderModule,
    NgxUiLoaderConfig,
    NgxUiLoaderHttpModule,
    NgxUiLoaderRouterModule, 
    SPINNER,
    POSITION,
    PB_DIRECTION } from "ngx-ui-loader";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardUserComponent } from './board-user/board-user.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';

import { DataTablesModule } from 'angular-datatables';

import { ModuleOrganizationsComponent } from './module-organizations/module-organizations.component';
import { ModuleOrganizationsAddModalFormComponent } from './module-organizations/module-organizations-add-modal-form/module-organizations-add-modal-form.component';
import { ModuleOrganizationsViewComponent } from './module-organizations/module-organizations-view/module-organizations-view.component';


import { ModuleUsersComponent } from './module-users/module-users.component';
import { ModuleUsersAddModalFormComponent } from './module-users/module-users-add-modal-form/module-users-add-modal-form.component';
import { ModuleUsersViewComponent } from './module-users/module-users-view/module-users-view.component';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    "bgsColor": "red",
    "bgsOpacity": 0.1,
    "bgsPosition": "bottom-right",
    "bgsSize": 20,
    "bgsType": "ball-spin-clockwise",
    "blur": 10,
    "delay": 0,
    "fastFadeOut": true,
    "fgsColor": "#ff7518",
    "fgsPosition": "center-center",
    "fgsSize": 70,
    "fgsType": "rectangle-bounce-pulse-out",
    "gap": 24,
    "logoPosition": "center-center",
    "logoSize": 120,
    "logoUrl": "",
    "masterLoaderId": "master",
    "overlayBorderRadius": "0",
    "overlayColor": "#1b1b1b",
    "pbColor": "#ff7518",
    "pbDirection": "ltr",
    "pbThickness": 3,
    "hasProgressBar": true,
    "text": "",
    "textColor": "#f8f9fc",
    "textPosition": "center-center",
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        ProfileComponent,
        BoardAdminComponent,
        BoardUserComponent,
        NavbarComponent,
        SidebarComponent,
        ModalConfirmComponent,
        ModuleOrganizationsComponent,
        ModuleOrganizationsAddModalFormComponent,
        ModuleOrganizationsViewComponent,
        ModuleUsersComponent,
        ModuleUsersAddModalFormComponent,
        ModuleUsersViewComponent,
    ],  
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        FormsModule,
        HttpClientModule,
        FontAwesomeModule,
        NgbModule,
        ReactiveFormsModule,
        DataTablesModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig), 
        NgxUiLoaderHttpModule, 
        NgxUiLoaderRouterModule
    ],
    providers: [
        authInterceptorProviders
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas);
    }
}
