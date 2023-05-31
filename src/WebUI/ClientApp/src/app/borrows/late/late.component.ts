import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatedListOfBorrowDto, BorrowsClient, BorrowDto, QueryType, LookupDto, BooksClient, BorrowersClient, UpdateBorrowCommand } from 'src/app/web-api-client';
import { FormsModule } from '@angular/forms';
import { sizePage } from 'src/api.config';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { ToastService } from 'src/app/toast/toast-service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'app-late',
    standalone: true,
    templateUrl: './late.component.html',
    imports: [CommonModule, FormsModule, PaginationComponent,NgSelectModule,BsDatepickerModule]
})
export class LateComponent implements OnInit  {
  pageNumber=1;
  pageSize=sizePage;
  bookId: number ;
  borrowerId: number;
  created: Date;
  lookupBook: LookupDto[];
  lookupBorrower: LookupDto[];
  public borrows:PaginatedListOfBorrowDto;
  constructor(private client: BorrowsClient,
    private clientBook: BooksClient,
    private clientBorrower: BorrowersClient,
    public toastService: ToastService) {   
      
  }
  ngOnInit(): void {
    this.load(); 
    this.clientBook.getLookup().subscribe(result => {
      this.lookupBook = result;
    }, error => console.error(error));
    this.clientBorrower.getLookup().subscribe(result => {
      this.lookupBorrower = result;
    }, error => console.error(error));
  }
  load(){
    this.client.getBorrowsWithPagination(this.pageNumber,this.pageSize,QueryType.Late,this.bookId,this.borrowerId,this.created,null,null,null).subscribe(result => {
      this.borrows = result;
    }, error => console.error(error));
  }
  loadSearch() {
    this.pageNumber=1;
    this.pageSize=sizePage;
    this.load();
}
  changeNumberPage(nPage: number): void {
    this.pageNumber = nPage;
     this.load(); 
 }
 changePageSize(pSize:number): void {
   this.pageSize = pSize;
     this.load(); 
 }   
}
