import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowersClient,BorrowerDto,CreateBorrowerCommand,PaginatedListOfBorrowerDto, UpdateBorrowerCommand } from 'src/app/web-api-client';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from "../pagination/pagination.component";
import { sizePage } from 'src/api.config';
import { AuthorizeService } from 'src/api-authorization/authorize.service';

@Component({
    selector: 'app-borrowers',
    standalone: true,
    templateUrl: './borrowers.component.html',
    imports: [CommonModule, FormsModule, PaginationComponent]
})
export class BorrowersComponent implements OnInit  {
  pageNumber=1;
  pageSize=sizePage;
  public borrowers:PaginatedListOfBorrowerDto;
  debug = false;
  selectedborrower: BorrowerDto;
  newListEditor: any = {};
  borrowerOptionsEditor: any = {};
  newborrowerEditor: any = {};
  newborrowerModalRef: BsModalRef;
  borrowerOptionsModalRef: BsModalRef;
  deleteborrowerModalRef: BsModalRef;
  constructor(private client: BorrowersClient,    
    private modalService: BsModalService) {   
      
  }
  ngOnInit(): void {
    this.load(); 
  }
  load(){
    this.client.getBorrowersWithPagination(this.pageNumber,this.pageSize).subscribe(result => {
      this.borrowers = result;
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
  showNewborrowerModal(template: TemplateRef<any>): void {
    this.newborrowerModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('name').focus(), 250);
  }
  
  Cancelled(add:boolean): void {
    if(add){
    this.newborrowerModalRef.hide();
    this.newborrowerEditor = {};
    }else{
      this.borrowerOptionsModalRef.hide();
      this.borrowerOptionsEditor = {};
    }
  }

  addborrower(): void {
    const borrower = {
      id: 0,
      name: this.newborrowerEditor.name,
      address: this.newborrowerEditor.address,
      phone: this.newborrowerEditor.phone
    } as BorrowerDto;

    this.client.create(borrower as CreateBorrowerCommand).subscribe(
      result => {
        borrower.id = result;
        this.borrowers.items.push(borrower);
        this.borrowers.totalCount+=1;
        this.newborrowerModalRef.hide();
        this.newborrowerEditor = {};
      },
      error => {
        const res = JSON.parse(error.response);
        if (res && res.errors) {
          error={
            name:res.errors.Name?res.errors.Name[0]:null,
            address:res.errors.Address?res.errors.Address[0]:null,
            phone:res.errors.Phone?res.errors.Phone[0]:null,
          }
          this.newborrowerEditor.error = error;
        }     
     }
    );
  }
  showborrowerOptionsModal(borrower:BorrowerDto,template: TemplateRef<any>) {
    this.selectedborrower=borrower
    this.borrowerOptionsEditor = {
      id: this.selectedborrower.id,
      name: this.selectedborrower.name,
      address: this.selectedborrower.address,
      phone: this.selectedborrower.phone
    };

    this.borrowerOptionsModalRef = this.modalService.show(template);
  }

  updateborrowerOptions() {
    const borrower = this.borrowerOptionsEditor as UpdateBorrowerCommand;
    this.client.update(this.selectedborrower.id, borrower).subscribe(
      () => {
        this.selectedborrower = this.borrowerOptionsEditor;
        this.borrowers.items =this.borrowers.items.map(s => {
              if (s.id === this.selectedborrower.id) {
                  return this.selectedborrower;
                }
                return s;
              });        
          this.borrowerOptionsModalRef.hide();
        this.borrowerOptionsEditor = {};
      },
      error =>{
        const res = JSON.parse(error.response);
        if (res && res.errors) {
          error={
            name:res.errors.Name?res.errors.Name[0]:null,
            address:res.errors.Address?res.errors.Address[0]:null,
            phone:res.errors.Phone?res.errors.Phone[0]:null,
          }
          this.borrowerOptionsEditor.error = error;
        }
      }    
    );
  }
  
  confirmDeleteborrower(template: TemplateRef<any>) {
    this.borrowerOptionsModalRef.hide();
    this.deleteborrowerModalRef = this.modalService.show(template);
  }

  deleteborrowerConfirmed(): void {
    this.client.delete(this.selectedborrower.id).subscribe(
      () => {
        this.deleteborrowerModalRef.hide();
        this.borrowers.items = this.borrowers.items.filter(t => t.id !== this.selectedborrower.id);
        this.borrowers.totalCount-=1
      },
      error => console.error(error)
    );
  }
}
