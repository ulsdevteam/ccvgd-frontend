import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';
import { HttpClient } from '@angular/common/http';
import {
  Village,
  VillageSearchResult,
  TableData,
} from './village-name.service';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class MultiVillageFilterService {
  getResults: VillageSearchResult;
  getUserList: any = {};
  constructor(
    private httpService: HttpServiceService,
    private http: HttpClient
  ) {}

  async filterSelectedTopics(choose: Village): Promise<any> {
    const selectedTopic = 'economy';

    //TODO
    console.log('my choose id: ', choose.id);

    //TODO
    const myObj = {
      villageid: ['1', '3', '2'],
      topic: ['economy', 'population'],
    };
    let response = await this.httpService
      .post('ccvg/advancesearch', {
        myObj,
        // villageid: choose.id,
        // topic: selectedTopic,
      })
      .catch((err: HttpErrorResponse) => {
        console.log('error for request', err);
        return { data: [] };
      });

    console.log('i got the response', response);

    return response;
  }

  async onPostMultiVillages(postData: { villageid: any; topic: any }) {
    // let response;

    this.getUserList = postData;
    let response = await this.httpService
      .post('ccvg/advancesearch', postData)
      .catch((err: HttpErrorResponse) => {
        console.log('error for request', err);
        return { data: [] };
      });

    // console.log('i got the response', response);

    return response;
    // // Send Http request
    // this.http
    //   .post('http://ngrok.luozm.me:8395/ccvg/advancesearch', postData)
    //   .subscribe((responseData) => {
    //     response = responseData;
    //     console.log('responseData in service', responseData);
    //   });

    // return response;
  }
}
