import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityGroupService, ListPermissionDto } from 'projects/identity/src/public-api';
import { AppService, BaseComponent } from 'projects/core/src/public-api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'yid-group-permission',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './group-permission.component.html'
})

export class GroupPermissionComponent extends BaseComponent  {
  @Input()  model: ListPermissionDto[];
  @Input() gId: string;
  constructor(
    appService: AppService,
    private identityGroupService: IdentityGroupService    
  ) {
    super(appService);
  }

  submit() {
    const subscr = this.identityGroupService.addPermissionToGroup(this.model,this.gId)
      .subscribe({
        next: (res) => {
          if (res.succeeded) {
            this.toastService.showSuccess('تم حفظ ');
          } else {
            this.toastService.showDanger(res.message);
          }
        }, error: (_) => { this.toastService.showDanger("الرجاء معاودة المحاولة في وقت لاحق"); }
      });
    this.addSubscriber(subscr);
  }
}