import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditResourceModalComponent } from './edit-resource-modal/edit-resource-modal.component';
import { DeleteResourceModalComponent } from './delete-resource-modal/delete-resource-modal.component';
import { ViewResourceModalComponent } from './view-resource-modal/view-resource-modal.component';

@Component({
  template: `
  <div style="text-align: center;" id="action-btn">
  <button class="btn btn-success btn-sm action-property" (click)="launchPreviewModal($event)" title="Edit Resource Name"><i class="ion-edit"></i>&nbsp;Preview</button>
  <button class="btn btn-warning btn-sm action-property" (click)="launchEditModal($event)" title="Edit Resource Name"><i class="ion-edit"></i>&nbsp;Edit</button>
  <button class="btn btn-danger btn-sm action-property" (click)="launchDeleteModal($event)" title="Delete Resource"><i class="ion-trash-a"></i>&nbsp;Delete</button>
  </div>
   `,
})
export class ActionRenderComponent implements OnInit {

  rowData;

  @Input() value;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.rowData = this.value;
  }

  launchPreviewModal(event) {
    event.stopPropagation();
    const activeModal = this.modalService.open(ViewResourceModalComponent, { size: 'lg' });
    activeModal.componentInstance.modalHeader = '';
    activeModal.componentInstance.onModalLaunch(this.rowData);
  }


  launchEditModal(event) {
    event.stopPropagation();
    const activeModal = this.modalService.open(EditResourceModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Edit Resource';
    console.log(this.rowData);
    activeModal.componentInstance.onModalLaunch(this.rowData);
  }
  
  launchDeleteModal(event) {
    event.stopPropagation();
    const activeModal = this.modalService.open(DeleteResourceModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Delete Resource';
    activeModal.componentInstance.onModalLaunch(this.rowData);
  }
}