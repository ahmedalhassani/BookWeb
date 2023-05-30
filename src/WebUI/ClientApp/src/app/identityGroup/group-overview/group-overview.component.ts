import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from "../../../../../../core/src/lib/shared/components/toolbar/toolbar.component";
import { AppService, BaseComponent, yan_pageSize, PaginatedModel } from 'projects/core/src/public-api';
import { IdentityGroups, IdentityGroupService, UserInfo } from 'projects/identity/src/public-api';
import { SharedModule } from "../../../../../../../src/app/_metronic/shared/shared.module";
import { QueryParamsModel } from 'projects/core/src/lib/shared/models/query-param.model';
import { PaginationComponent } from "../../../../../../core/src/lib/shared/components/pagination/pagination.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupFromComponent } from '../group-from/group-from.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'yid-group-overview',
    standalone: true,
    templateUrl: './group-overview.component.html',
    imports: [CommonModule, FormsModule,ToolbarComponent, SharedModule, PaginationComponent,RouterModule]
})
export class GroupOverviewComponent extends BaseComponent implements OnInit {
  pageNumber=1;
  pageSize=yan_pageSize;
  search:string;
  page: PaginatedModel<IdentityGroups>;
  constructor(
    appService: AppService,
    private identityGroupService: IdentityGroupService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute
    ) {
    super(appService);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(p => {
      this.pageNumber = p.pageNumber||this.pageNumber;       
      this.pageSize = p.pageSize||this.pageSize;    
    });
    this.load(); 
  }

  load() {
    const query: QueryParamsModel = {
      pageNumber: this.pageNumber,
      pageSize: yan_pageSize,
      filter:this.search
    };
    const subscr = this.identityGroupService.getAll(query).subscribe({
      next: (res) => {
        if (res.succeeded) {
         this.page =res.data;
        }
      }, error: (er) => { console.log(er)}
    });
    this.addSubscriber(subscr);
  }
  loadSearch() {
      this.pageNumber=1;
      this.pageSize=yan_pageSize;
      this.load();
  }
  changeNumberPage(nPage: number): void {
    this.pageNumber = nPage;
     this.load(); 
 }
 changePageSize(pSize:number): void {
   this.pageSize = pSize;
     this.load(); 
 }
 create() {
  const identityGroup = new IdentityGroups();
  this.openWindowWithBackdrop(identityGroup);
}
edit(identityGroup: IdentityGroups) {
  this.openWindowWithBackdrop(identityGroup);
}
openWindowWithBackdrop(identityGroup: IdentityGroups) {
  const dialog = this.modalService.open(GroupFromComponent);
  dialog.componentInstance.identityGroup = identityGroup;
  dialog.result.then(
    data => {
      if (data) {
        if (this.page.data.find(s => s.id === data.id)) {
          // this.page.data =this.page.data.map(s => {
            //   if (s.id === data.id) {
              //     return data;
              //   }
              //   return s;
              // });
            } else {    
              this.page.totalCount+=1;     
              this.page.data=[data,...this.page.data];
            }
            this.toastService.showSuccess('تم حفظ ');
      }
    },
    () => {}
  );
}
 delete(itemId: string) {
  const dialog = this.layoutUtilsService.deleteElement('تنبية!', 'هل أنت متاكد؟', 'الرجاء الانتظار، جاري الحذف....');
  dialog.componentInstance.onYesClick = async () => {
    const subscr = this.identityGroupService.deleteById(itemId).subscribe({      
      next: (data) => {
        if (data.succeeded) {
          this.toastService.showSuccess('تم حذف ');
          this.page.data = this.page.data.filter(d => d.id !== itemId);
          this.page.totalCount-=1;     
          }
      },
      error:(er) => {
        console.log(er);
      }
    });
    this.addSubscriber(subscr);  
  };
}
}
