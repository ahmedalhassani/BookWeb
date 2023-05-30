import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService, BaseComponent } from 'projects/core/src/public-api';
import { ActivatedRoute } from '@angular/router';
import { IdentityGroupDto } from '../../../models';
import { IdentityGroupService } from '../../../services';
import { ToolbarComponent } from "../../../../../../core/src/lib/shared/components/toolbar/toolbar.component";
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { GroupUserComponent } from "./group-user/group-user.component";
import { GroupRoleComponent } from "./group-role/group-role.component";
import { GroupPermissionComponent } from "./group-permission/group-permission.component";

@Component({
    selector: 'yid-identity-group-details',
    standalone: true,
    templateUrl: './group-details.component.html',
    imports: [CommonModule, ToolbarComponent, NgbNavModule, GroupUserComponent, GroupRoleComponent, GroupPermissionComponent]
})
export class GroupDetailsComponent extends BaseComponent implements OnInit {
  active=1
  id:string;
identityGroup:IdentityGroupDto;
  constructor(
    appService: AppService,
    private identityGroupService: IdentityGroupService,
    private activatedRoute: ActivatedRoute
  ) {
    super(appService);
  }

  ngOnInit() {
    const subscr1 = this.activatedRoute.params.subscribe(p => {
      this.id = p.id || null;
      if (this.id) {       
        this.load();
      }
    });
    this.addSubscriber(subscr1);
  }
  load() {    
    const subscr2 = this.identityGroupService.getById(this.id).subscribe({
      next: (res) => {
        if (res.succeeded) {
          console.log(res.data)
          this.identityGroup = res.data;
        }
      }, error: (er) => { console.log(er)}
    });
    this.addSubscriber(subscr2);
  }  
}
