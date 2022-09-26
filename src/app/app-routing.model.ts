import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddUserComponent } from "./add-user/add-user.component";
import AppComponent from "./app.component";
import { CustomersComponent } from "./customers/customers.component";
import { EditUserComponent } from "./edit-user/edit-user.component";
import { LoginComponent } from "./login/login.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { AuthGuardService } from "./services/guards/auth-guard.services";
import { DeactivateGuardService } from "./services/guards/deactivate-guard.service";

const appRoutes: Routes = [

    { path: '', component: AppComponent, canActivate: [AuthGuardService] },
    { path: 'login', component: LoginComponent },
    { path: 'customers', component: CustomersComponent, canActivate: [AuthGuardService] },
    { path: 'user/post', component: AddUserComponent, canActivate: [AuthGuardService], canDeactivate: [DeactivateGuardService] },
    { path: 'user/update', component: EditUserComponent, canActivate: [AuthGuardService], canDeactivate: [DeactivateGuardService] },
    { path: 'not-found', component: PageNotFoundComponent, },
    { path: '**', redirectTo: 'not-found' }

]
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],

})
export class AppRoutingModule {


}
