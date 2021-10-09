import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { ModuleOrganizationsComponent } from './module-organizations/module-organizations.component';
import { ModuleOrganizationsViewComponent } from './module-organizations/module-organizations-view/module-organizations-view.component';
import { ModuleUsersComponent } from './module-users/module-users.component';
import { ModuleUsersViewComponent } from './module-users/module-users-view/module-users-view.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },
    { 
        path: 'user', 
        component: BoardUserComponent,
        children: [
            {
                path: 'profile',
                component: ProfileComponent
            }
        ]
    },
    {
        path: 'admin',
        component: BoardAdminComponent, 
        children: [
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'organizations',
                component: ModuleOrganizationsComponent,
            },
            {
                path: 'organizations/:id',
                component: ModuleOrganizationsViewComponent,
            },
            {
                path: 'users',
                component: ModuleUsersComponent,
            },
            {
                path: 'users/:id',
                component: ModuleUsersViewComponent,
            }
        ]

    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
