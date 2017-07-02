import { Component, NgModule, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { ResourcesService } from './resources.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as moment from 'moment';
import { ActionRenderComponent } from './action.render.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddResourceModalComponent } from './add-resource-modal/add-resource-modal.component';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  constructor(private imgService: ResourcesService, private modalService: NgbModal, private activatedRoute: ActivatedRoute) {
    this.fillTable();
  }
  data = [];
  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const filter: string = params['label'];
      console.log(filter);
      if (filter) {
        this.source.setFilter([{ field: 'label', search: filter }]);
      }
    });
  }

  settings = {
    mode: 'inline',
    actions: false,
    pager: {
      display: true,
      perPage: 50
    },
    columns: {
      label: {
        title: 'Label',
        editable: false,
      },
      name: {
        title: 'Name',
        hideSubHeader: true
      },
      _cls: {
        title: 'Type',
        editable: false,
        valuePrepareFunction: (_cls) => {
          var type = _cls.slice(9);
          return type;
        }
      },
      createdBy: {
        title: 'Created By',
        editable: false,
      },
      createdOn: {
        title: 'Created On',
        editable: false,
        filter: false,
        valuePrepareFunction: (createdOn) => {
          var dt = new Date(createdOn.$date);
          var formattedDate = moment(dt).format('Do MMMM YYYY, h:mm:ss a');
          return formattedDate;
        }
      },
      actions: {
        title: 'Actions',
        type: 'custom',
        renderComponent: ActionRenderComponent,
        valuePrepareFunction: (cell, row) => row,
        width: '80px',
        filter: false,
        hideSubHeader: true
      },
    }
  };

  source: LocalDataSource = new LocalDataSource();
  fillTable() {
    this.imgService.getResources()
      .subscribe(
      (resources: any[]) => {
        console.log(resources);
        this.source.load(resources);
      },
      (error) => { console.log(error); }
      );
  }

  launchAddResourceModal() {
    const activeModal = this.modalService.open(AddResourceModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Add Resource';
  }
}
