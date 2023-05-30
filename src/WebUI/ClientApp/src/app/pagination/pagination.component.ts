import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ycr-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements OnInit {
  @Input() totalCount:number;
  @Input() numberPage:number;
  @Input() pageSize:number;
  @Output() page: EventEmitter<number> = new EventEmitter<number>();
  @Output() size: EventEmitter<number> = new EventEmitter<number>();
  totalPages:number;
 
  constructor(){  }
  ngOnInit() {
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
  }
  setPage(pageNum: number): void {
    if (pageNum !== this.numberPage && pageNum > 0 && pageNum <= this.totalPages) {
      this.numberPage = pageNum;
      this.page.emit(this.numberPage);
    }
  }
  
  setPageSize(event: any): void {
    this.pageSize = event.target.value;
    this.numberPage = 1;
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    this.size.emit(this.pageSize);
  }
  
}
