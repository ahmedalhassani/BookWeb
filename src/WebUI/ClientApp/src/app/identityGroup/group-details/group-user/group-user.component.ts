import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupUser, GroupUserDto, IdentityGroupService, UserService } from 'projects/identity/src/public-api';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppService, BaseComponent, BaseLookupUser } from 'projects/core/src/public-api';
import { SharedModule } from "../../../../../../../../src/app/_metronic/shared/shared.module";

@Component({
  selector: 'yid-group-user',
  standalone: true,
  templateUrl: './group-user.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class GroupUserComponent extends BaseComponent implements OnInit {
  @Input() model: GroupUserDto[];
  @Input() gId: string;
  groupUser=new GroupUser();
  lookupUser: BaseLookupUser[];
  userId: string;
  loginForm: FormGroup;
  hasError: boolean;
  constructor(
    appService: AppService,
    private userService: UserService,
    private identityGroupService: IdentityGroupService,
    private fb: FormBuilder
  ) {
    super(appService);
  }

  ngOnInit() {   
    this.loadLookupUser();
    this.groupUser.identityGroupId = this.gId;
    this.initForm();
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  loadLookupUser() {
    const subscr = this.userService.getLookup().subscribe({
      next: (res) => {
        if (res.succeeded) {
          this.lookupUser = res.data;
        }
      }, error: (er) => { console.log(er) }
    });
    this.addSubscriber(subscr);
  }
  initForm() {
    this.loginForm = this.fb.group({
      userId: [
        this.groupUser.userId,
        Validators.compose([
          Validators.required
        ]),
      ]
    });
  }

  submit() {
    this.groupUser.userId = this.f.userId.value;
    this.hasError = false;
    const subscr = this.identityGroupService.addUserToGroup(this.groupUser)
      .subscribe({
        next: (res) => {
          if (res.succeeded) {
            this.model = [res.data, ...this.model];
            this.userId = "";
            this.toastService.showSuccess('تم حفظ ');
          } else {
            this.toastService.showDanger(res.message);
          }
        }, error: (_) => { this.toastService.showDanger("الرجاء معاودة المحاولة في وقت لاحق"); }
      });
    this.addSubscriber(subscr);
  }
  delete(itemId: string) {
    const dialog = this.layoutUtilsService.deleteElement('تنبية!', 'هل أنت متاكد؟', 'الرجاء الانتظار، جاري الحذف....');
    dialog.componentInstance.onYesClick = async () => {
      const subscr = this.identityGroupService.deleteUserOfGroup(itemId).subscribe({
        next: (data) => {
          if (data.succeeded) {
            this.toastService.showSuccess('تم حذف ');
            this.model = this.model.filter(d => d.id !== itemId);
          }
        },
        error: (er) => {
          console.log(er);
        }
      });
      this.addSubscriber(subscr);
    };
  }
}
