import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatedListOfBorrowDto, BorrowsClient, BorrowDto, QueryType, LookupDto, BooksClient, BorrowersClient, UpdateBorrowCommand } from 'src/app/web-api-client';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { sizePage } from 'src/api.config';
import { PaginationComponent } from 'src/app/pagination/pagination.component';
import { ToastService } from 'src/app/toast/toast-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBorrowComponent } from '../add-borrow/add-borrow.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';

@Component({
    selector: 'app-borrows',
    standalone: true,
    templateUrl: './borrows.component.html',
    imports: [CommonModule, FormsModule, PaginationComponent,NgSelectModule,BsDatepickerModule]
})
export class BorrowsComponent implements OnInit  {
  pageNumber=1;
  pageSize=sizePage;
  bookId: number ;
  borrowerId: number;
  created: Date;
  lookupBook: LookupDto[];
  lookupBorrower: LookupDto[];
  public borrows:PaginatedListOfBorrowDto;
  debug = false;
  selectedborrow: BorrowDto;
  borrowOptionsEditor: any = {};
  borrowOptionsModalRef: BsModalRef;
  deleteborrowModalRef: BsModalRef;
  constructor(private client: BorrowsClient,
    private router: Router,
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
    this.client.getBorrowsWithPagination(this.pageNumber,this.pageSize,QueryType.Borrows,this.bookId,this.borrowerId,this.created,null,null,null).subscribe(result => {
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

 showNewBorrowModal() {
  const dialog = this.modalNgService.open(AddBorrowComponent);
  dialog.result.then(
    data => {
      if (data) {
        this.borrows.items.push(data);
        this.borrows.totalCount+=1;
        this.toastService.showSuccess('تم حفظ ');
      }
    },
    () => {}
  );
}
  Cancelled(): void {   
    this.borrowOptionsModalRef.hide();
    this.borrowOptionsEditor = {};
  }

 
  showReplayBorrowModal(borrow:BorrowDto,template: TemplateRef<any>) {
    this.selectedborrow=borrow
    this.borrowOptionsEditor = {
      id: this.selectedborrow.id,
      duration: this.selectedborrow.duration,
      price: this.selectedborrow.price
    };

    this.borrowOptionsModalRef = this.modalService.show(template);
  }
 
  showborrowOptionsModal(borrow:BorrowDto,template: TemplateRef<any>) {
    this.selectedborrow=borrow
    this.borrowOptionsEditor = {
      id: this.selectedborrow.id,
      duration: this.selectedborrow.duration,
      price: this.selectedborrow.price
    };

    this.borrowOptionsModalRef = this.modalService.show(template);
  }

  updateborrowOptions() {
    const borrow = this.borrowOptionsEditor as UpdateBorrowCommand;
    if(this.borrowOptionsEditor.replayDt){
      console.log(borrow)
      this.client.update(this.selectedborrow.id, borrow).subscribe(
        () => {
          this.borrowOptionsModalRef.hide();
          this.borrowOptionsEditor = {}; 
          this.router.navigate(['/printreplay/'+this.selectedborrow.id]);
        },
        error =>{
          const res = JSON.parse(error.response);
          if (res && res.errors) {
            error={
              replayDt:res.errors.ReplayDt?res.errors.ReplayDt[0]:null
              
            }
            this.borrowOptionsEditor.error = error;
          }
        }    
      );
    }else{
      this.client.update(this.selectedborrow.id, borrow).subscribe(
        () => {
          this.selectedborrow.duration = this.borrowOptionsEditor.duration;
            this.selectedborrow.price = this.borrowOptionsEditor.price;
            this.borrows.items =this.borrows.items.map(s => {
              if (s.id === this.selectedborrow.id) {
                  return this.selectedborrow;
                }
                return s;
              });        
          this.borrowOptionsModalRef.hide();
        this.borrowOptionsEditor = {};    
        },
        error =>{
          const res = JSON.parse(error.response);
          if (res && res.errors) {
            error={
              duration:res.errors.Duration?res.errors.Duration[0]:null,
              price:res.errors.Price?res.errors.Price[0]:null
            }
            this.borrowOptionsEditor.error = error;
          }
        }    
      );
    }
   
  }
  
  confirmDeleteborrow(template: TemplateRef<any>) {
    this.borrowOptionsModalRef.hide();
    this.deleteborrowModalRef = this.modalService.show(template);
  }

  deleteborrowConfirmed(): void {
    this.client.delete(this.selectedborrow.id).subscribe(
      () => {
        this.deleteborrowModalRef.hide();
        this.borrows.items = this.borrows.items.filter(t => t.id !== this.selectedborrow.id);
        this.borrows.totalCount-=1
      },
      error => console.error(error)
    );
  }
}
