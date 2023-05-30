import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from '../api-authorization/authorize.guard';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { TodoComponent } from './todo/todo.component';
import { TokenComponent } from './token/token.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'categories',   
    loadComponent: () =>
     import('./categories/categories.component').then(mod => mod.CategoriesComponent),
      canActivate: [AuthorizeGuard]  
  },  
  {
    path: 'authors',   
    loadComponent: () =>
     import('./authors/authors.component').then(mod => mod.AuthorsComponent),
      canActivate: [AuthorizeGuard]  
  },  
  {
    path: 'borrowers',   
    loadComponent: () =>
     import('./borrowers/borrowers.component').then(mod => mod.BorrowersComponent),
      canActivate: [AuthorizeGuard]  
  },  
  {
    path: 'books',   
    loadComponent: () =>
     import('./books/books.component').then(mod => mod.BooksComponent)      
  },
  {
    path: 'borrows',   
    loadComponent: () =>
     import('./borrows/borrows/borrows.component').then(mod => mod.BorrowsComponent),
      canActivate: [AuthorizeGuard]  
  },
      {
    path: 'replayborrows',   
    loadComponent: () =>
     import('./borrows/replay-borrowers/replay-borrows.component').then(mod => mod.ReplayBorrowsComponent),
      canActivate: [AuthorizeGuard]  
  },  
  {
    path: 'nearexpiry',   
    loadComponent: () =>
     import('./borrows/near-expiry/near-expiry.component').then(mod => mod.NearExpiryComponent),
      canActivate: [AuthorizeGuard]  
  },  
  {
    path: 'printreplay/:id',   
    loadComponent: () =>
     import('./borrows/print-replay/print-replay.component').then(mod => mod.PrintReplayComponent),
      canActivate: [AuthorizeGuard]  
  },  
  { path: 'counter', component: CounterComponent },
  { path: 'fetch-data', component: FetchDataComponent },
  { path: 'todo', component: TodoComponent, canActivate: [AuthorizeGuard] },
  { path: 'token', component: TokenComponent, canActivate: [AuthorizeGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
