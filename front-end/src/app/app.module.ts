import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { ModuleOrganizationsSubmoduleComponent } from './module-organizations/module-organizations-submodule/module-organizations-submodule.component';
import { ModuleOrganizationsAddModalFormComponent } from './module-organizations/module-organizations-add-modal-form/module-organizations-add-modal-form.component';
import { ModuleOrganizationsLinkModalFormComponent } from './module-organizations/module-organizations-link-modal-form/module-organizations-link-modal-form.component';
import { ModuleOrganizationsViewComponent } from './module-organizations/module-organizations-view/module-organizations-view.component';

import { ModuleUsersComponent } from './module-users/module-users.component';
import { ModuleUsersSubmoduleComponent } from './module-users/module-users-submodule/module-users-submodule.component';
import { ModuleUsersAddModalFormComponent } from './module-users/module-users-add-modal-form/module-users-add-modal-form.component';
import { ModuleUsersLinkModalFormComponent } from './module-users/module-users-link-modal-form/module-users-link-modal-form.component';
import { ModuleUsersViewComponent } from './module-users/module-users-view/module-users-view.component';

import { ModuleTournamentsComponent } from './module-tournaments/module-tournaments.component';
import { ModuleTournamentsSubmoduleComponent } from './module-tournaments/module-tournaments-submodule/module-tournaments-submodule.component';
import { ModuleTournamentsAddModalFormComponent } from './module-tournaments/module-tournaments-add-modal-form/module-tournaments-add-modal-form.component';
import { ModuleTournamentsLinkModalFormComponent } from './module-tournaments/module-tournaments-link-modal-form/module-tournaments-link-modal-form.component';
import { ModuleTournamentsViewComponent } from './module-tournaments/module-tournaments-view/module-tournaments-view.component';

import { ModulePoolsComponent } from './module-pools/module-pools.component';
import { ModulePoolsSubmoduleComponent } from './module-pools/module-pools-submodule/module-pools-submodule.component';
import { ModulePoolsAddModalFormComponent } from './module-pools/module-pools-add-modal-form/module-pools-add-modal-form.component';
import { ModulePoolsLinkModalFormComponent } from './module-pools/module-pools-link-modal-form/module-pools-link-modal-form.component';
import { ModulePoolsViewComponent } from './module-pools/module-pools-view/module-pools-view.component';

import { ModuleRegistrationsComponent } from './module-registrations/module-registrations.component';
import { ModuleRegistrationsSubmoduleComponent } from './module-registrations/module-registrations-submodule/module-registrations-submodule.component';
import { ModuleRegistrationsAddModalFormComponent } from './module-registrations/module-registrations-add-modal-form/module-registrations-add-modal-form.component';
import { ModuleRegistrationsLinkModalFormComponent } from './module-registrations/module-registrations-link-modal-form/module-registrations-link-modal-form.component';
import { ModuleRegistrationsViewComponent } from './module-registrations/module-registrations-view/module-registrations-view.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { QuillModule } from 'ngx-quill';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ClubComponent } from './club/club.component';
import { RegistrationComponent } from './registration/registration.component';

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
        ModuleOrganizationsSubmoduleComponent,
        ModuleOrganizationsAddModalFormComponent,
        ModuleOrganizationsLinkModalFormComponent,
        ModuleOrganizationsViewComponent,

        ModuleUsersComponent,
        ModuleUsersSubmoduleComponent,
        ModuleUsersAddModalFormComponent,
        ModuleUsersLinkModalFormComponent,
        ModuleUsersViewComponent,

        ModuleTournamentsComponent,
        ModuleTournamentsSubmoduleComponent,
        ModuleTournamentsAddModalFormComponent,
        ModuleTournamentsLinkModalFormComponent,
        ModuleTournamentsViewComponent,

        ModulePoolsComponent,
        ModulePoolsSubmoduleComponent,
        ModulePoolsAddModalFormComponent,
        ModulePoolsLinkModalFormComponent,
        ModulePoolsViewComponent,

        ModuleRegistrationsComponent,
        ModuleRegistrationsSubmoduleComponent,
        ModuleRegistrationsAddModalFormComponent,
        ModuleRegistrationsLinkModalFormComponent,
        ModuleRegistrationsViewComponent,
        
        ClubComponent,
                  RegistrationComponent,

    ],  
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
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
        NgxUiLoaderRouterModule,
        OwlDateTimeModule, 
        OwlNativeDateTimeModule,
        QuillModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot()
    ],
    providers: [
        authInterceptorProviders,
        { provide: OWL_DATE_TIME_LOCALE, useValue: 'fr' },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIconPacks(fas);
    }
}
