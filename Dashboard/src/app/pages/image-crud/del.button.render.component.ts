
import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { ViewPhotosModalComponent } from './view-photos-modal/view-photos-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
  <div style="text-align: center;" id="action-btn">
  <button class="btn btn-danger btn-sm action-property" (click)="launchDeleteModal()" title="Delete Training Image"><i class="ion-trash-a"></i>&nbsp;Delete</button></div>
  `,
})
export class DeleteButtonRenderComponent implements OnInit {

  rowData;
  @Input() value;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.rowData = this.value;
  }
  launchDeleteModal() {
    const activeModal = this.modalService.open(ViewPhotosModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Delete Photo';
    activeModal.componentInstance.onModalLaunch(this.rowData, "delete");
  }
}