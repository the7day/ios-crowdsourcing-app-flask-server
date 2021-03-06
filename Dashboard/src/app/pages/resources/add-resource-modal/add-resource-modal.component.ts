import { Component, OnInit, EventEmitter, Input, Output,ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesService } from '../resources.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveResourceModalComponent } from '../save-resource-modal/save-resource-modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';


@Component({
  selector: 'add-resource-modal',
  templateUrl: './add-resource-modal.component.html',
  styleUrls: ['./add-resource-modal.component.scss']
})
export class AddResourceModalComponent implements OnInit {
  resourceTypes: string[] = [
    "Link",
    "Document",
    "Text",
    "Audio",
    "Video",
    "Contentfeed"
  ];
  contentFeedTypes: string[] = [
    "Google",
    "Weather"
  ];
  isEmpty: boolean;
  isLink: boolean = true;
  modalHeader: string;
  resType: string = "Link";
  labelTxt: string = "";
  url: string = "";
  files: FileList;
  filesLst: File[] = [];
  labelName = [];
  resName: string = "";
  resFile: File = null;
  isContentFeed: boolean = false;
  adapterType: string = "Google";
  maxResults: number = 3;
  notLinkAndContentfeed: boolean = false;
  locationLatitude: number = 0;
  locationLongitude: number = 0;
  locationLatitudeCurrentLocation: number = 0;
  locationLongitudeCurrentLocation: number = 0;
  isLatInvalid: boolean = false;
  isLongInvalid: boolean = false;
  isResultInvalid: boolean = false;
  isTextInvalid: boolean = false;
  isURLInvalid: boolean = false;
  zoom: number = 8;
  longitude: number;
  latitude: number;
  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;


  setPosition(position: Position) {
    this.locationLatitude = position.coords.latitude;
    this.locationLongitude = position.coords.longitude;
    this.locationLatitudeCurrentLocation = position.coords.latitude;
    this.locationLongitudeCurrentLocation = position.coords.longitude;
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  }

  constructor(private resourcesService: ResourcesService, private activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    this.loadLabels();
  }

  onModalLaunch() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    };
  }

  ngOnInit() { }

  onSelectContentFeedChange(value) {
    this.adapterType = value;
  }



  onchangeLatitude(Latitude){
    if( Latitude === null || !(Latitude >= -90 && Latitude <= 90) || !(this.isValidCoordinate(Latitude)) ){
        this.isLatInvalid = true;
      }else{
        this.isLatInvalid = false; 
      }
  }

  onchangeLongitude(Longitude){
    if( Longitude === null || !(Longitude >= -180 && Longitude <= 180) || !(this.isValidCoordinate(Longitude)) ){
      this.isLongInvalid = true;
    }else{
      this.isLongInvalid = false; 
    }
  }

  onChangeResultvalues(value){
   if(value<=0 || value>=11){
      this.isResultInvalid = true;
   }else{
      this.isResultInvalid = false;
   }
  }

  onChangeURLText(value){
   if(value.length <= 0){
      this.isURLInvalid = true;
   }else{
      this.isURLInvalid = false;
   }
  }

  onChangeNameText(value){
   if(value.length <= 0){
      this.isTextInvalid = true;
   }else{
      this.isTextInvalid = false;
   }
  }




  onSelectChange(value) {
    if (!(value === "Link") && !(value === "Contentfeed")) {
      this.notLinkAndContentfeed = true;
    } else {
      this.notLinkAndContentfeed = false;
    }

    if (value === "Link") {
      this.isLink = true;
      this.notLinkAndContentfeed = false;
      this.resFile = null;
    }
    else {
      this.isLink = false;
    }

    if (value === "Contentfeed") {
      this.isContentFeed = true;
      this.notLinkAndContentfeed = false;
      this.resFile = null;
    }
    else {
      this.isContentFeed = false;
    }

    this.resType = value;
    console.log("Resource type: " + value);
  }

  //Batch uploading
  onLabel(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.resFile = files[0];
  }

  setLabel() {
    this.isEmpty = this.checkEmpty();
    if (!this.isEmpty) {
      this.labelTxt = "";
    }
    if (this.labelTxt == "" || this.labelTxt.length == 0) {
      alert('Not a valid resource');
    }
    else {
      this.resourcesService.uploadResource(this.resName.toLowerCase(), this.labelTxt.toLowerCase(),
        this.resType.toLowerCase(), this.url, this.resFile, this.locationLatitude,
        this.locationLongitude, this.adapterType.toLowerCase(), this.maxResults)
        .subscribe(
        (response) => {
          this.closeModal();
          console.log(response);
          this.lgModalShow();
        },
        (error) => console.log(error)
        );
    }
  }

  checkEmpty() {
    for (var i = 0; i < this.labelName.length; i++) {
      if (this.labelTxt == this.labelName[i]) {
        return true;
      }
    }
    return false;
  }

  closeModal() {
    this.activeModal.close();
  }

  //Load label name
  loadLabels() {
    this.resourcesService.getLabels()
      .subscribe(
      (labels: any[]) => {
        for (var i = 0; i < labels.length; i++) {
          this.labelName[i] = labels[i].name;
        }
      },
      (error) => { console.log(error); },
    );
  }

  //autocomplete check
  labelChanged(newVal) {
    this.labelTxt = newVal;
  }

  isValidCoordinate(coordinate: number) {
    if (coordinate != 0 && ((coordinate % 1 === 0) ||
      (coordinate === +coordinate && coordinate !== (coordinate | 0)))) {
      return true;
    }
    return false;
  }

  isValidLatitudeLongitude(Latitude: number, Longitude: number) {
    
    //error msg

    if( Longitude === null || Latitude === null ){
        return false;
      }

    if ((Latitude >= -90 && Latitude <= 90) && (Longitude >= -180 && Longitude <= 180)
      && this.isValidCoordinate(Latitude) && this.isValidCoordinate(Longitude)) {
      return true;
    }
    
    if ( (this.locationLongitudeCurrentLocation == Longitude &&
      this.locationLatitudeCurrentLocation == Latitude)) {
      return true;
    }

    return false;
  }

//  checkLinkErrors(link,url){
//     if(link === "Link"){ 
//         if(url.length <= 0){
//            this.isURLInvalid = true;
//         }else{
//            this.isURLInvalid = false;
//         }
//      }
//  }

  disableButton() {
    if (this.resName.length > 0 && this.labelTxt.length > 0
      && this.isValidLatitudeLongitude(this.locationLatitude, this.locationLongitude)) {
        //this.checkLinkErrors(this.resType,this.url);
        if ((this.resType === "Link" && this.url.length > 0) || (this.resFile) ||
          (this.resType === "Contentfeed" && (this.maxResults > 0 && this.maxResults < 11) &&
            (this.adapterType === "Google" || this.adapterType === "Weather"))) {
          return false;
        }
    }
    return true;
  }

  // save success modal
  lgModalShow() {
    const activeModal = this.modalService.open(SaveResourceModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = '';
  }

}