import { Routes } from '@angular/router';
import { MainComponent } from './features/main/main.component';
import { SearchComponent } from './features/search/search.component';
import { MessagesComponent } from './features/messages/messages.component';
import { ProfileComponent } from './features/profile/profile.component';
import { CreateListingComponent } from './features/create-listing/create-listing.component';
import { MyListingsComponent } from './features/my-listings/my-listings.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ListingDetailComponent } from './features/listing-detail/listing-detail.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '',            component: MainComponent },
  { path: 'search',      component: SearchComponent },
  { path: 'messages',    component: MessagesComponent, canActivate: [authGuard] },
  { path: 'profile',     component: ProfileComponent, canActivate: [authGuard] },
  { path: 'create',      component: CreateListingComponent, canActivate: [authGuard] },
  { path: 'my-listings', component: MyListingsComponent, canActivate: [authGuard] },
  { path: 'login',       component: LoginComponent },
  { path: 'register',    component: RegisterComponent },
  { path: 'listing/:id', component: ListingDetailComponent },
];