import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {AuthGuard} from "./service/authguard.service"

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path:"auth",
    loadChildren: () => import("./layouts/auth/auth/auth.module").then(m => m.AuthModule)
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
    }],
    canActivate:[AuthGuard]
},{
  path:"**",
  redirectTo:"",
  pathMatch:"full"
}

]


