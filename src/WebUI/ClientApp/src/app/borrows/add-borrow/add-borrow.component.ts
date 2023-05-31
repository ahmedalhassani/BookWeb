import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BooksClient, BorrowDto, BorrowerDto, BorrowersClient, BorrowsClient, CreateBorrowCommand, LookupDto } from 'src/app/web-api-client';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-borrw',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule,NgSelectModule ],
  templateUrl: './add-borrow.component.html'
})

export class AddBorrowComponent implements OnInit {
  @Input()   bookId: number;
  message:string;
  borrowBook:BorrowDto=new BorrowDto();
  
  lookupBook: LookupDto[];
  lookupBorrower: LookupDto[];
  isAddBorrower:boolean=false;
  constructor(private client: BorrowsClient,
    private clientBook: BooksClient,
    private clientBorrower: BorrowersClient,
      public dialogRef: NgbActiveModal) {
  }

  ngOnInit() {
    if (this.bookId) {
      this.borrowBook.bookId =this.bookId;
    }
    this.borrowBook.borrower=new BorrowerDto();
    this.clientBook.getLookup().subscribe(result => {
      this.lookupBook = result;
    }, error => console.error(error));
    this.clientBorrower.getLookup().subscribe(result => {
      this.lookupBorrower = result;
    }, error => console.error(error));
  }
  addBorrower(){
    this.isAddBorrower=true;
  }
  onSubmit() {  
    this.message="";
    this.client.create(this.borrowBook  as CreateBorrowCommand).subscribe(
      result => {
        this.borrowBook.id = result.id;
        this.dialogRef.close(result);
      },
      error => {
        const res = JSON.parse(error.response);
        if (res && res.errors) {  
          if(res.errors.BookId)
          this.message +=" - "+ res.errors.BookId;
          if(res.errors.Duration)
          this.message +=" - "+ res.errors.Duration;
          if(res.errors.Price)
          this.message +=" - "+ res.errors.Price;
        }     
     }
    );
    
  }
  close() {
    this.dialogRef.dismiss();
  }
}


  
  