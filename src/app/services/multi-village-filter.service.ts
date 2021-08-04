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
      .post("ccvg/advancesearch", {
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
      .post("ccvg/advancesearch", postData)
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
      .post("ccvg/advancesearch/yearsearch", postYearData)
      .catch((err: HttpErrorResponse) => {
        console.log("cannot get response data from year filter", err);
        return { data: [] };
      });

    return yearResponse;
  }


//   get rawData() {
//     return {
//     "tables": [{
//             "tableNameChinese": '村庄基本信息',
//             "field": ['gazetteerId', 'gazetteerName', 'villageId', 'villageName', 'province', 'city', 'county', 'category1', 'data', 'unit'],
//             "data": [
//                 { "gazetteerId": 2, "gazetteerName": '叶店村志', "villageId": '420116403201', "villageName": '叶店村', "province": '湖北省', "city": '武汉市', "county": '黄陂区', "category": 'TotalArea_村庄总面积', "data": '7.5', "unit": '平方千米 / 平方公里 square kilometers' },
//                 { "gazetteerId": 2, "gazetteerName": '叶店村志', "villageId": '420116403201', "villageName": '叶店村', "province": '湖北省', "city": '武汉市', "county": '黄陂区', "category": 'Distance TO Affiliated TO the county town_距隶属县城距离', "data": '5', "unit": '公里/千米 kilometer' },
//                 {
//                     "gazetteerId": 2,
//                     "gazetteerName": '叶店村志',
//                     "villageId": '420116403201',
//                     "villageName": '叶店村',
//                     "province": '湖北省',
//                     "city": '武汉市',
//                     "county": '黄陂区',
//                     "category": '\n' +
//                         'Longitude_经度',
//                     "data": '114°11′E',
//                     "unit": '度分秒 DMS (degrees-minutes-seconds)'
//                 },
//                 {
//                     "gazetteerId": 2,
//                     "gazetteerName": '叶店村志',
//                     "villageId": '420116403201',
//                     "villageName": '叶店村',
//                     "province": '湖北省',
//                     "city": '武汉市',
//                     "county": '黄陂区',
//                     "category": '\n' +
//                         'Latitude_纬度',
//                     "data": '30°47′N',
//                     "unit": '度分秒 DMS (degrees-minutes-seconds)'
//                 }
//             ]
//         },
//         {
//             "tableNameChinese": '村志基本信息',
//             "field": ['villageId', 'villageName', 'gazetteerId', 'gazetteerName', 'publishYear', 'publishType'],
//             "data": [
//                 { "villageId": '420116403201', "villageName": '叶店村', "gazetteerId": 2, "gazetteerName": '叶店村', "publishYear": 2008, "publishType": '非正式出版 Informal' }
//             ]
//         },
//         {
//             "tableNameChinese": '经济',
//             "field": ['gazetteerName', 'gazetteerId', 'category1', 'category2', 'category3', 'startYear', 'endYear', 'data', 'unit'],
//             "data": [{
//                     "gazetteerName": '叶店村志',
//                     "gazetteerId": 2,
//                     "category1": '水价 Water Price',
//                     "category2": 'General',
//                     "category3": 'null',
//                     "startYear": 1950,
//                     "endYear": 1950,
//                     "data": 69.51,
//                     "unit": '万斤 10K jin'
//                 },
//                 {
//                     "gazetteerName": '叶店村志',
//                     "gazetteerId": 2,
//                     "category1": '水价 Water Price',
//                     "category2": '生活 Household',
//                     "category3": 'null',
//                     "startYear": 1949,
//                     "endYear": 1949,
//                     "data": 69.51,
//                     "unit": '万斤 10K jin'
//                 },
//                 {
//                     "gazetteerName": '叶店村志',
//                     "gazetteerId": 2,
//                     "category1": '用电量 Electricity Consumption',
//                     "category2": '生活 Household',
//                     "category3": '每户 per household',
//                     "startYear": 1950,
//                     "endYear": 1950,
//                     "data": 69.51,
//                     "unit": '万斤 10K jin'
//                 },
//                 {
//                     "gazetteerName": '叶店村志',
//                     "gazetteerId": 2,
//                     "category1": '用电量 Electricity Consumption',
//                     "category2": '生活 Household',
//                     "category3": '每人 per person',
//                     "startYear": 1949,
//                     "endYear": 1949,
//                     "data": 69.51,
//                     "unit": '万斤 10K jin'
//                 }
//             ]
//         }
//     ]
// }
//   }
}
