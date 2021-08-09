import { Injectable } from "@angular/core";
import { HttpServiceService } from "./http-service.service";
import { HttpClient } from "@angular/common/http";
import {
  Village,
  VillageSearchResult,
  TableData,
} from "./village-name.service";
import { HttpErrorResponse } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class MultiVillageFilterService {
  getResults: VillageSearchResult;
  getUserList: any = {};
  constructor(
    private httpService: HttpServiceService,
    private http: HttpClient
  ) {}

  async filterSelectedTopics(choose: Village): Promise<any> {
    const selectedTopic = "economy";

    //TODO
    console.log("my choose id: ", choose.id);

    //TODO
    const myObj = {
      villageid: ["1", "3", "2"],
      topic: ["economy", "population"],
    };
    let response = await this.httpService
      .post("advancesearch", {
        myObj,
        // villageid: choose.id,
        // topic: selectedTopic,
      })
      .catch((err: HttpErrorResponse) => {
        console.log("error for request", err);
        return { data: [] };
      });

    console.log("i got the response", response);

    return response;
  }

  async onPostMultiVillages(postData: { villageid: any; topic: any }) {
    this.getUserList = postData;
    // this.getYearBySelectedVillagesAndTopics(postData);
    let response = await this.httpService
      .post("advancesearch", postData)
      .catch((err: HttpErrorResponse) => {
        console.log("error for request", err);
        return { data: [] };
      });
    return response;
  }

  async postYearMultiVillages(postYearData: {
    villageid: any;
    topic: any;
    year: any;
    year_range: any;
  }) {
    // let test = {
    //   villageid: ["3"],
    //   topic: ["population"],
    //   year: [2011],
    //   year_range: [2009, 2012],
    // // };
    // console.log("this.getUserList", this.getUserList);

    // let convertYearFormat = {
    //   villageid: [this.getUserList.villageid],
    //   topic: this.getUserList.topic,
    // };
    // console.log(test);
    // console.log("😦", convertYearFormat);
    let yearResponse = await this.httpService
      .post("advancesearch", postYearData)
      .catch((err: HttpErrorResponse) => {
        console.log("cannot get response data from year filter", err);
        return { data: [] };
      });

    return yearResponse;
  }
}
