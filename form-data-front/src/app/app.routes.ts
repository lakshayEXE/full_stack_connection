import { Routes } from '@angular/router';
import { Signup } from './components/signup/signup';
import { Login } from './components/login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { LoginRedirect } from './guards/login-redirect';
import { AuthGuard } from './auth-guard';
export const routes: Routes = [
  { path: 'signup', component: Signup },
  { path: 'login', canActivate:[LoginRedirect],component: Login },
  { path: 'dashboard', canActivate:[AuthGuard] ,component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Default route
];

/// jab agr humara token store hai toh vo login page p dubara nahi jana chahiye
// jab hu login kr le toh tab vo users ki detail display kr de dashboard p
