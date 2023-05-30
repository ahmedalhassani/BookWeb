import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatedListOfBorrowDto, BorrowsClient, BorrowDto, QueryType, LookupDto, BooksClient, BorrowersClient, UpdateBorrowCommand } from 'src/app/web-api-client';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { sizePage } from 'src/api.config';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { ToastService } from 'src/app/toast/toast-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-replay-borrows',
    standalone: true,
    templateUrl: './replay-borrows.component.html',
    imports: [CommonModule, FormsModule, PaginationComponent,NgSelectModule,BsDatepickerModule,RouterModule]
})
export class ReplayBorrowsComponent implements OnInit  {
  pageNumber=1;
  pageSize=sizePage;
  bookId: number ;
  borrowerId: number;
  created: Date;
  replayDt: Date;
  lookupBook: LookupDto[];
  lookupBorrower: LookupDto[];
  public borrows:PaginatedListOfBorrowDto;
  constructor(private client: BorrowsClient,
    private clientBook: BooksClient,
    private clientBorrower: BorrowersClient,
    private modalNgService: NgbModal,
    public toastService: ToastService,    
    private modalService: BsModalService) {   
      
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
    this.client.getBorrowsWithPagination(this.pageNumber,this.pageSize,QueryType.Finished,this.bookId,this.borrowerId,this.created,this.replayDt,null,null).subscribe(result => {
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