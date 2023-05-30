import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService, BaseComponent } from 'projects/core/src/public-api';
import { IdentityGroups } from '../../../models';
import { IdentityGroupService } from '../../../services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'yid-group-from',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule ],
  templateUrl: './group-from.component.html'
})

export class GroupFromComponent extends BaseComponent implements OnInit {
  @Input()   identityGroup: IdentityGroups;
  message:string;
  constructor(appService: AppService,
     private identityGroupService: IdentityGroupService,
      public dialogRef: NgbActiveModal) {
    super(appService);
  }

  ngOnInit() {
    if (!this.identityGroup) {
      this.identityGroup = new IdentityGroups();
    }
  }

  onSubmit() {  
    this.message="";
    const subscr =  this.identityGroupService.addOrUpdate(this.identityGroup).subscribe({
      next: (res) => {
        if (res.succeeded) {
          this.identityGroup.id = res.data;          
          this.dialogRef.close(this.identityGroup);
        }else{
        this.message=res.message;
        }
      }, error: (_) => { this.message="الرجاء معاودة المحاولة في وقت لاحق..."}
    });
    this.addSubscriber(subscr);
  }
  close() {
    this.dialogRef.dismiss();
  }
}


  
  