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