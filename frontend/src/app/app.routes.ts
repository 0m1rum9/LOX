import { Routes } from '@angular/router';
import { MainComponent } from './features/main/main.component';
import { SearchComponent } from './features/search/search.component';
import { MessagesComponent } from './features/messages/messages.component';
import { ProfileComponent } from './features/profile/profile.component';
import { CreateListingComponent } from './features/create-listing/create-listing.component';
import { MyListingsComponent } from './features/my-listings/my-listings.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: '',            component: MainComponent },
  { path: 'search',      component: SearchComponent },
  { path: 'messages',    component: MessagesComponent },
  { path: 'profile',     component: ProfileComponent },
  { path: 'create',      component: CreateListingComponent },
  { path: 'my-listings', component: MyListingsComponent },
  { path: 'login',       component: LoginComponent },
  { path: 'register',    component: RegisterComponent },
];