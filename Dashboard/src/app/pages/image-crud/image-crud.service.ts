import { EventEmitter, Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ImageCrudService {
  deleteRowEmitter: any = new EventEmitter<any>();
  constructor(private http: Http) { }

  getImages() {
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get('http://54.93.252.106:8080/api/images', { headers: headers })
      .map(
      (response: Response) => {
        const data = response.json();
        console.log(data.images);
        return data.images;
      }
      )
      .catch(
      (error: Response) => {
        return Observable.throw('Something went wrong');
      }
      );
  }

  deleteImage(rowData) {
    const imgSrc = rowData.dp;
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.delete(imgSrc, { headers: headers })
      .map(
      (response: Response) => {
        const data = response.json();
        this.deleteRowEmitter.emit(rowData);
        console.log(data);
        return data.images;
      }
      )
      .catch(
      (error: Response) => {
        return Observable.throw('Something went wrong');
      }
      );
  }
}