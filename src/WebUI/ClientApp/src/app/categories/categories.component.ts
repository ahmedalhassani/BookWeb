import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesClient,CategoryDto,CreateCategoryCommand,PaginatedListOfCategoryDto, UpdateCategoryCommand } from 'src/app/web-api-client';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from "../pagination/pagination.component";
import { sizePage } from 'src/api.config';

@Component({
    selector: 'app-categories',
    standalone: true,
    templateUrl: './categories.component.html',
    imports: [CommonModule, FormsModule, PaginationComponent]
})
export class CategoriesComponent implements OnInit {
  pageNumber=1;
  pageSize=sizePage;
  public categories:PaginatedListOfCategoryDto;
  debug = false;
  selectedCategory: CategoryDto;
  newListEditor: any = {};
  categoryOptionsEditor: any = {};
  newCategoryEditor: any = {};
  newCategoryModalRef: BsModalRef;
  categoryOptionsModalRef: BsModalRef;
  deleteCategoryModalRef: BsModalRef;
  constructor(private client: CategoriesClient,
    private modalService: BsModalService) {   
  }
  ngOnInit(): void {
    this.load(); 
  }
  load(){
    this.client.getCategoriessWithPagination(this.pageNumber,this.pageSize).subscribe(result => {
      this.categories = result;
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
  showNewCategoryModal(template: TemplateRef<any>): void {
    this.newCategoryModalRef = this.modalService.show(template);
    setTimeout(() => document.getElementById('name').focus(), 250);
  }
  
  Cancelled(add:boolean): void {
    if(add){
    this.newCategoryModalRef.hide();
    this.newCategoryEditor = {};
    }else{
      this.categoryOptionsModalRef.hide();
      this.categoryOptionsEditor = {};
    }
  }

  addCategory(): void {
    const category = {
      id: 0,
      name: this.newCategoryEditor.name
    } as CategoryDto;

    this.client.create(category as CreateCategoryCommand).subscribe(
      result => {
        category.id = result;
        this.categories.items.push(category);
        this.categories.totalCount+=1;
        this.newCategoryModalRef.hide();
        this.newCategoryEditor = {};
      },
      error => {
        const res = JSON.parse(error.response);
        if (res && res.errors.Name) {
          this.newCategoryEditor.error = res.errors.Name[0];
        }
        setTimeout(() => document.getElementById('name').focus(), 250);
      }
    );
  }
  showCategoryOptionsModal(category:CategoryDto,template: TemplateRef<any>) {
    this.selectedCategory=category
    this.categoryOptionsEditor = {
      id: this.selectedCategory.id,
      name: this.selectedCategory.name
    };

    this.categoryOptionsModalRef = this.modalService.show(template);
  }

  updateCategoryOptions() {
    const category = this.categoryOptionsEditor as UpdateCategoryCommand;
    this.client.update(this.selectedCategory.id, category).subscribe(
      () => {
        (this.selectedCategory.name = this.categoryOptionsEditor.name),
          this.categoryOptionsModalRef.hide();
        this.categoryOptionsEditor = {};
      },
      error =>{
        const res = JSON.parse(error.response);
        if (res && res.errors.Name) {
          this.categoryOptionsEditor.error = res.errors.Name[0];
        }
        setTimeout(() => document.getElementById('inputName').focus(), 250);
      }    
    );
  }
  
  confirmDeleteCategory(template: TemplateRef<any>) {
    this.categoryOptionsModalRef.hide();
    this.deleteCategoryModalRef = this.modalService.show(template);
  }

  deleteCategoryConfirmed(): void {
    this.client.delete(this.selectedCategory.id).subscribe(
      () => {
        this.deleteCategoryModalRef.hide();
        this.categories.items = this.categories.items.filter(t => t.id !== this.selectedCategory.id);
        this.categories.totalCount-=1
      },
      error => console.error(error)
    );
  }
}
