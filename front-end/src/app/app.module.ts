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

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    "bgsColor": "red",
    "bgsOpacity": 0.1,
    "bgsPosition": "bottom-right",
    "bgsSize": 20,
    "bgsType": "ball-spin-clockwise",
    "blur": 10,
    "delay": 0,
    "fastFadeOut": true,
    "fgsColor": "rgba(0, 57, 171, 0.8)",
    "fgsPosition": "center-center",
    "fgsSize": 70,
    "fgsType": "cube-grid",
    "gap": 24,
    "logoPosition": "center-center",
    "logoSize": 120,
    "logoUrl": "",
    "masterLoaderId": "master",
    "overlayBorderRadius": "0",
    "overlayColor": "rgba(255,255,255)",
    "pbColor": "#4e73df",
    "pbDirection": "ltr",
    "pbThickness": 3,
    "hasProgressBar": true,
    "text": "Preparing the magic...",
    "textColor": "rgba(0, 57, 171, 0.8)",
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
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig), 
        NgxUiLoaderHttpModule.forRoot({ showForeground: false })
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
