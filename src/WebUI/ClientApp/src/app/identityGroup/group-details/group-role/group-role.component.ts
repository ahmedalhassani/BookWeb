import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityGroupService, RoleDto } from 'projects/identity/src/public-api';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { AppService, BaseComponent } from 'projects/core/src/public-api';

@Component({
  selector: 'yid-group-role',
  standalone: true,
  templateUrl: './group-role.component.html',
  imports: [CommonModule, FormsModule, SharedModule]
})

export class GroupRoleComponent extends BaseComponent  {
  @Input() model: RoleDto[];
  @Input() gId: string;
  constructor(
    appService: AppService,
    private identityGroupService: IdentityGroupService
  ) {
    super(appService);
  }

  submit() {
    const subscr = this.identityGroupService.addRoleToGroup(this.model,this.gId)
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

