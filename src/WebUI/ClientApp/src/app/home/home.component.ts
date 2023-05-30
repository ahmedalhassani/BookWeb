import { Component, OnInit } from '@angular/core';
import { BooksClient,BookDto,CreateBookCommand,PaginatedListOfBookDto, UpdateBookCommand, AuthorsClient, CategoriesClient, LookupDto, PaginatedListOfBorrowDto, BorrowsClient, QueryType } from 'src/app/web-api-client';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { ToastService } from '../toast/toast-service';
import { Observable, take } from 'rxjs';
@Component({
     selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit  {

    public isAuthenticated?: Observable<boolean>;
     constructor(private authorizeService: AuthorizeService,
    private client: BorrowsClient,
    public toastService: ToastService) {   
  }
  ngOnInit(): void {
    this.authorizeService.isAuthenticated().pipe(
      take(1)
     ).subscribe(s =>{
      if(s){
        this.load(); }
    });    
  }
  load(){
    this.client.getBorrowsWithPagination(1,1,QueryType.NearExpiry,null,null,null,null,null,null).subscribe(result => {
            if(result&&result.totalCount>0){
        this.toastService.showDanger("تنبية! يوجد "+result.totalCount+" قرب انتهاء مدة اإلعارة");
      }
    }, error => console.error(error));
  }
  
}
