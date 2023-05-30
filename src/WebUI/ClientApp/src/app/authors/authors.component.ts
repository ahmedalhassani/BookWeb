import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsClient,AuthorDto,CreateAuthorCommand,PaginatedListOfAuthorDto, UpdateAuthorCommand } from 'src/app/web-api-client';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from "../pagination/pagination.component";
import { sizePage } from 'src/api.config';

@Component({
    selector: 'app-authors',
    standalone: true,
    templateUrl: './authors.component.html',
    imports: [CommonModule, FormsModule, PaginationComponent]
})
export class AuthorsComponent implements OnInit  {
  pageNumber=1;
  pageSize=sizePage;
  public authors:PaginatedListOfAuthorDto;
  debug = false;
  selectedAuthor: AuthorDto;
  newListEditor: any = {};
  AuthorOptionsEditor: any = {};
  newAuthorEditor: any = {};
  newAuthorModalRef: BsModalRef;
  AuthorOptionsModalRef: BsModalRef;
  deleteAuthorModalRef: BsModalRef;
  constructor(private client: AuthorsClient,
    private modalService: BsModalService) {   
  }
  ngOnInit(): void {
    this.load(); 
  }
  load(){
    this.client.getAuthorsWithPagination(this.pageNumber,this.pageSize).subscribe(result => {
      this.authors = result;
    }, error => console.error(error));
  }
  changeNumberPage(nPage: number): void {
    this.pageNumber = nPage;
     this.load(); 
 }
 changePageSize(pSize:number): void {
   this.pageSize = pSize;
     this.load(); 
 }
  showNewAuthorModal(template: TemplateRef<any>): void {
    this.newAuthorModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('name').focus(), 250);
  }
  
  Cancelled(add:boolean): void {
    if(add){
    this.newAuthorModalRef.hide();
    this.newAuthorEditor = {};
    }else{
      this.AuthorOptionsModalRef.hide();
      this.AuthorOptionsEditor = {};
    }
  }

  addAuthor(): void {
    const author = {
      id: 0,
      name: this.newAuthorEditor.name,
      address: this.newAuthorEditor.address
    } as AuthorDto;

    this.client.create(author as CreateAuthorCommand).subscribe(
      result => {
        author.id = result;
        this.authors.items.push(author);
        this.authors.totalCount+=1;
        this.newAuthorModalRef.hide();
        this.newAuthorEditor = {};
      },
      error => {
        const res = JSON.parse(error.response);
        if (res && res.errors) {
          error={
            name:res.errors.Name?res.errors.Name[0]:null,
            address:res.errors.Address?res.errors.Address[0]:null,
          }
          this.newAuthorEditor.error = error;
        }     
     }
    );
  }
  showAuthorOptionsModal(author:AuthorDto,template: TemplateRef<any>) {
    this.selectedAuthor=author
    this.AuthorOptionsEditor = {
      id: this.selectedAuthor.id,
      name: this.selectedAuthor.name,
      address: this.selectedAuthor.address
    };

    this.AuthorOptionsModalRef = this.modalService.show(template);
  }

  updateAuthorOptions() {
    const author = this.AuthorOptionsEditor as UpdateAuthorCommand;
    this.client.update(this.selectedAuthor.id, author).subscribe(
      () => {
        this.selectedAuthor = this.AuthorOptionsEditor;
        this.authors.items =this.authors.items.map(s => {
              if (s.id === this.selectedAuthor.id) {
                  return this.selectedAuthor;
                }
                return s;
              });          
          this.AuthorOptionsModalRef.hide();
        this.AuthorOptionsEditor = {};
      },
      error =>{
        const res = JSON.parse(error.response);
        if (res && res.errors) {
          error={
            name:res.errors.Name?res.errors.Name[0]:null,
            address:res.errors.Address?res.errors.Address[0]:null,
          }
          this.AuthorOptionsEditor.error = error;
        }
      }    
    );
  }
  
  confirmDeleteAuthor(template: TemplateRef<any>) {
    this.AuthorOptionsModalRef.hide();
    this.deleteAuthorModalRef = this.modalService.show(template);
  }

  deleteAuthorConfirmed(): void {
    this.client.delete(this.selectedAuthor.id).subscribe(
      () => {
        this.deleteAuthorModalRef.hide();
        this.authors.items = this.authors.items.filter(t => t.id !== this.selectedAuthor.id);
        this.authors.totalCount-=1
      },
      error => console.error(error)
    );
  }
}
