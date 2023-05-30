import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksClient,BookDto,CreateBookCommand,PaginatedListOfBookDto, UpdateBookCommand, AuthorsClient, CategoriesClient, LookupDto } from 'src/app/web-api-client';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from "../pagination/pagination.component";
import { sizePage } from 'src/api.config';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBorrowComponent } from '../borrows/add-borrow/add-borrow.component';
import { ToastService } from '../toast/toast-service';
import { Observable } from 'rxjs';
@Component({
    selector: 'app-books',
    standalone: true,
    templateUrl: './books.component.html',
    imports: [CommonModule, FormsModule, PaginationComponent,NgSelectModule,BsDatepickerModule]
})
export class BooksComponent implements OnInit  {
  pageNumber=1;
  pageSize=sizePage;
  nameBook: string ;
  publicationDt: Date;
  categoryId: number;
  authorId: number;

  public books:PaginatedListOfBookDto;
  debug = false;
  lookupCategory: LookupDto[];
  lookupAuthor: LookupDto[];
  selectedbook: BookDto;
  newListEditor: any = {};
  bookOptionsEditor: any = {};
  newbookEditor: any = {};
  newborrowModalRef: BsModalRef;
  newbookModalRef: BsModalRef;
  bookOptionsModalRef: BsModalRef;
  deletebookModalRef: BsModalRef;
    isAdministrator = false;
    public isAuthenticated?: Observable<boolean>;
     constructor(private authorizeService: AuthorizeService,
    private client: BooksClient,
    private clientCategory: CategoriesClient,
    private clientAuthor: AuthorsClient,
    private modalService: BsModalService,
    private modalNgService: NgbModal,
    public toastService: ToastService) {   
     this.authorizeService.getUser().subscribe(params => {
      this.isAdministrator=params&&(params.name=="administrator@localhost");
    });     
  }
  ngOnInit(): void {
    this.isAuthenticated = this.authorizeService.isAuthenticated();
    this.load(); 
    this.clientCategory.getLookup().subscribe(result => {
      this.lookupCategory = result;
    }, error => console.error(error));
    this.clientAuthor.getLookup().subscribe(result => {
      this.lookupAuthor = result;
    }, error => console.error(error));
  }
  load(){
    this.client.getBooksWithPagination(this.pageNumber,this.pageSize,this.nameBook,this.publicationDt,this.categoryId,this.authorId).subscribe(result => {
      this.books = result;      
    }, error => console.error(error));   
  }
  loadSearch() {
    this.pageNumber=1;
    this.pageSize=sizePage;
    this.load();
}

showNewBorrowModal(bookId:number) {
  const dialog = this.modalNgService.open(AddBorrowComponent);
  dialog.componentInstance.bookId = bookId;
  dialog.result.then(
    data => {
      if (data) {
        this.toastService.showSuccess('تم حفظ ');
      }
    },
    () => {}
  );
}

  changeNumberPage(nPage: number): void {
    this.pageNumber = nPage;
     this.load(); 
 }
 changePageSize(pSize:number): void {
   this.pageSize = pSize;
     this.load(); 
 }
  showNewbookModal(template: TemplateRef<any>): void {
    this.newbookModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('name').focus(), 250);
  }
  
  Cancelled(add:boolean): void {
    if(add){
    this.newbookModalRef.hide();
    this.newbookEditor = {};
    }else{
      this.bookOptionsModalRef.hide();
      this.bookOptionsEditor = {};
    }
  }

  addbook(): void {
    this.newbookEditor.error =null;
    const book = {
      id: 0,
      name: this.newbookEditor.name,      
      numberPages: this.newbookEditor.numberPages,
      publicationDt: this.newbookEditor.publicationDt,
      categoryId: this.newbookEditor.categoryId,
      authorId: this.newbookEditor.authorId      
    } as BookDto;
    if(this.newbookEditor.categoryId){
      const category = this.lookupCategory.find((obj) => {
        return obj.id === this.newbookEditor.categoryId;
      });
      book.category=category?.title;
    }
    if(this.newbookEditor.authorId){
      const author = this.lookupAuthor.find((obj) => {
        return obj.id === this.newbookEditor.authorId;
      });
      book.author=author?.title;
    }
    this.client.create(book as CreateBookCommand).subscribe(
      result => {
        book.id = result;
        this.books.items.push(book);
        this.books.totalCount+=1;
        this.newbookModalRef.hide();
        this.newbookEditor = {};
      },
      error => {
        const res = JSON.parse(error.response);
        if (res && res.errors) {
          error={
            name:res.errors.Name?res.errors.Name[0]:null,
            numberPages:res.errors.NumberPages?res.errors.NumberPages[0]:null,
            publicationDt:res.errors.PublicationDt?res.errors.PublicationDt[0]:null,
            categoryId:res.errors.CategoryId?res.errors.CategoryId[0]:null,
            authorId:res.errors.AuthorId?res.errors.AuthorId[0]:null,
          }
          this.newbookEditor.error = error;
        }     
     }
    );
  }
  showbookOptionsModal(book:BookDto,template: TemplateRef<any>) {
    this.selectedbook=book;
    this.bookOptionsEditor = {
      id: this.selectedbook.id,
      name: this.selectedbook.name,
      numberPages: this.selectedbook.numberPages,
      publicationDt: this.selectedbook.publicationDt,
      categoryId: this.selectedbook.categoryId,
      authorId: this.selectedbook.authorId
    };

    this.bookOptionsModalRef = this.modalService.show(template);
  }

  updatebookOptions() {  
    const book = this.bookOptionsEditor as UpdateBookCommand;
    book.categoryId=book.categoryId?book.categoryId:0;
    book.authorId=book.authorId?book.authorId:0;
    this.client.update(this.selectedbook.id, book).subscribe(
      () => {
        this.selectedbook = this.bookOptionsEditor;
        if(this.selectedbook.categoryId){
          const category = this.lookupCategory.find((obj) => {
            return obj.id === this.selectedbook.categoryId;
          });
          this.selectedbook.category=category?.title;
        }
        if( this.selectedbook.authorId){
          const author = this.lookupAuthor.find((obj) => {
            return obj.id === this.selectedbook.authorId;
          });
          this.selectedbook.author=author?.title;
        }
        this.bookOptionsEditor.error =null;
        this.books.items =this.books.items.map(s => {
              if (s.id === this.selectedbook.id) {
                  return this.selectedbook;
                }
                return s;
              });        
          this.bookOptionsModalRef.hide();
        this.bookOptionsEditor = {};
      },
      error =>{
        const res = JSON.parse(error.response);
        if (res && res.errors) {
          error={
            name:res.errors.Name?res.errors.Name[0]:null,
            numberPages:res.errors.NumberPages?res.errors.NumberPages[0]:null,
            publicationDt:res.errors.PublicationDt?res.errors.PublicationDt[0]:null,
            categoryId:res.errors.CategoryId?res.errors.CategoryId[0]:null,
            authorId:res.errors.AuthorId?res.errors.AuthorId[0]:null,
          }
          this.bookOptionsEditor.error = error;
        }
      }    
    );
  }
  
  confirmDeletebook(template: TemplateRef<any>) {
    this.bookOptionsModalRef.hide();
    this.deletebookModalRef = this.modalService.show(template);
  }

  deletebookConfirmed(): void {
    this.client.delete(this.selectedbook.id).subscribe(
      () => {
        this.deletebookModalRef.hide();
        this.books.items = this.books.items.filter(t => t.id !== this.selectedbook.id);
        this.books.totalCount-=1
      },
      error => console.error(error)
    );
  }
}
