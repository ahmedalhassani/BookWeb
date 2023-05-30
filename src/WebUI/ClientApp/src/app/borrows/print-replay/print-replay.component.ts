import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowDto, BorrowsClient } from 'src/app/web-api-client';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-print-replay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print-replay.component.html'
})
export class PrintReplayComponent implements OnInit ,OnDestroy {
  private _subscriptions$: Subscription[] = [];
  id:null;
  borrow=new BorrowDto; 
    constructor(
      private activatedRoute: ActivatedRoute,
      private  client: BorrowsClient
    ) {
      const subscr1 = this.activatedRoute.params.subscribe(p => {
        this.id = p.id || null;
        if (this.id) {       
          this.load();          
        }       
      });
      this._subscriptions$.push(subscr1);
    }
  
    ngOnInit() {
     
    }
     print(){
      window.print();
//       const printContent = document.getElementById("componentID");
// const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
// WindowPrt.document.write(printContent.innerHTML);
// WindowPrt.document.close();
// WindowPrt.focus();
// WindowPrt.print();
// WindowPrt.close();
     }
    load() {    
      const subscr2 = this.client.getBorrow(this.id).subscribe({
        next: (res) => {
          this.borrow = res;  
        }, error: (er) => { console.log(er)}
      });
      this._subscriptions$.push(subscr2);
    } 
  
    ngOnDestroy() {
      this._subscriptions$.map(s => s.unsubscribe());     
    } 
  }