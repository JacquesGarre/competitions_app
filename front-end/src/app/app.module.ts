import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';


import { ModuleOrganizationsComponent } from './module-organizations/module-organizations.component';
import { ModuleOrganizationsAddModalFormComponent } from './module-organizations/module-organizations-add-modal-form/module-organizations-add-modal-form.component';
import { ModuleOrganizationsViewComponent } from './module-organizations/module-organizations-view/module-organizations-view.component';



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        ProfileComponent,
        BoardAdminComponent,
        BoardModeratorComponent,
        BoardUserComponent,
        NavbarComponent,
        SidebarComponent,
        ModuleOrganizationsComponent,
        ModalConfirmComponent,
        ModuleOrganizationsAddModalFormComponent,
        ModuleOrganizationsViewComponent,
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
        Ng2SmartTableModule,
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
