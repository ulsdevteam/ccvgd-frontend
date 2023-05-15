import { MatTableDataSource } from "@angular/material/table";
import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from "@angular/core";
import { MultiVillageFilterService } from "../services/multi-village-filter.service";
import { MatPaginator } from "@angular/material/paginator";
import { Router } from "@angular/router";
import { COMMA, ENTER, P } from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { environment } from '../../environments/environment';

import mapSubCategoryToNewSubCategory from '../search-multi-villages/mapSubCategoryToNewSubCategory';

//TODO
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface BasicVillageInformation {
  gazetteerId: number;
  gazetteerName: string;
  villageId: string;
  villageName: string;
  province: string;
  city: string;
  county: string;
  category1: string;
  data: string;
  unit: string;
}

export interface Fruit {
  name: string;
}

@Component({
  selector: "app-muiti-village-results",
  templateUrl: "./muiti-village-results.component.html",
  styleUrls: ["./muiti-village-results.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class MuitiVillageResultsComponent implements OnInit {
  @ViewChildren(MatPaginator) mainPaginator = new QueryList<MatPaginator>();
  // @Input() dataSource;
  // @ViewChild("mainPaginator") mainPaginator: MatPaginator;

  loading: boolean = false;
  userInput: any = {};
  getAllResponses: any = {};

  inputSearchField: any;


  dataSource;

  searchResultData: any = {}
  displayResultsData: any[] = []

  userSelectionList: any[] = []

  chartData: any[] = []
  chartGroupData: any[] = []
  chartVillageData: any[] = []
  //for chips list
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [
    {name: 'Lemon'},
    {name: 'Lime'},
    {name: 'Apple'},
  ];

  mapFromCHToEN = new Map([
    ["村庄基本信息", "village"],
    ["村志基本信息", "gazetteerinformation"],
    ["自然环境", "naturalenvironment"],
    ["自然灾害", "naturaldisasters"],
    ["姓氏", "fourthlastNames"],
    ["第一次拥有或购买年份", "firstavailabilityorpurchase"],
    ["民族", "ethnicgroups"],
    ["人口", "population"],
    ["军事政治", "military"],
    ["经济原始数据", "economy"],
    ["统一单位经济", "economyunity"],
    ["计划生育", "familyplanning"],
    ["教育", "education"]
  ]);

  getVillageidForDownload: string;
  index: string;

  constructor(private multiVillageFilterService: MultiVillageFilterService,private router: Router) {}

  filterChartData() {

    // console.log('this.chartData', this.chartData);

    const map = new Map<string, Record<string, any>[]>();

    this.chartData.forEach(item => {
      if (map.has(item.category1) === false) {
        map.set(item.category1, [item]);
      } else if (map.has(item.category1) === true) {
        let temp = map.get(item.category1);
        temp.push(item);
        map.delete(item.category1);
        map.set(item.category1, temp);
      }

      if (map.has(item.category2) === false) {
        map.set(item.category2, [item]);
      } else if (map.has(item.category2) === true) {
        let temp = map.get(item.category2);
        temp.push(item);
        map.delete(item.category2);
        map.set(item.category2, temp);
      }
    });

    map.delete('null');

    const mapVillage = new Map<string, Record<string, any>[]>();

    this.chartData.forEach(item => {
      if (mapVillage.has(item.gazetteerName) === false) {
        mapVillage.set(item.gazetteerName, [item]);
      }
      else if (mapVillage.has(item.gazetteerName) === true) {
        let temp = mapVillage.get(item.gazetteerName);
        temp.push(item);
        mapVillage.delete(item.gazetteerName);
        mapVillage.set(item.gazetteerName, temp);
      }
    });

    // console.log('map', map);
    // console.log('mapVillage', mapVillage);

    for (let [key, value] of map.entries()) {
      const name = key;
      const item = value;
      this.chartGroupData.push({name, item});
    }

    for (let [key, value] of mapVillage.entries()) {
      const name = key;
      const item = value;
      this.chartVillageData.push({name, item});
    }

    // console.log(this.chartGroupData);
    // console.log(this.chartVillageData);

    window.localStorage.setItem('chartData', JSON.stringify(this.chartData));
    window.localStorage.setItem('chartGroupData', JSON.stringify(this.chartGroupData));
  }

  openChart() {

    for (let item of this.userSelectionList) {
      if (item.category1List.includes("人口 Population") 
        || item.category1List.includes("户数 Number of Households") 
        || item.category1List.includes("耕地面积 Cultivated Area") 
        || item.category1List.includes("人均收入 Per Capita Income")
        || item.category1List.includes('出生人数 Number of Births')
        || item.category1List.includes('死亡人数 Number of Deaths')
        || item.category1List.includes('自然出生率 Birth Rate')
        || item.category1List.includes('死亡率 Death Rate (‰)')) {
        let baseUrl = window.location.href.replace(this.router.url, '');
        const url = baseUrl + this.router.createUrlTree([`/multi-village-search-result-chart`]);
        window.open(url, '_blank');
        break;
      }
    }
  }

  getUrlParams (key): string {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(key)
  }

  ngOnInit(): void {
    this.loading = true;
    const userSelection = window.localStorage.getItem('userSelection');
    // const userValue = this.getUrlParams('userValue');
    // [TODO] decode userValue and return it
    // const userValuePlainText = decode(userValue);
    this.userSelectionList = JSON.parse(userSelection);

    const userList = window.localStorage.getItem('userList');
    // const userList = this.getUrlParams('userList');
    // [TODO] decode userList and return it
    // const userListPlainText = decode(userList);
    this.userInput = JSON.parse(userList);

    // const userValueEncoded = encode(userValue);
    // console.log('[debug] user selection', this.userSelectionList)
    // console.log("[debug] user input",this.userInput)
    this.getData();

    // console.log("userSelectionList", this.userSelectionList)
  }

  removeGazetteerId(rawArray) {
    let resultsDisplay = [];
    for(let item in rawArray) {
      // gazetteerId
      if(rawArray[item] !== "village_id") {
        resultsDisplay.push(rawArray[item]);
      }
    }
    return resultsDisplay;
  }

  async getData() {

    // console.log("[debug] this.userInput", this.userInput)

    this.searchResultData  = await this.multiVillageFilterService.onPostMultiVillages(this.userInput);
    // console.log('[debug] result data', this.searchResultData);
    this.loading = false;
    if(this.searchResultData.code === 4001) {
      alert("Please must select at least one village!!!");
      setTimeout(async ()=>{
        // await this.router.navigate(["/multi-village-search"]);
      }, 3000);
    }
    if(this.searchResultData.data && this.searchResultData.data.length === 0) {
      alert(`后端返回报错 !  \n  error message: ${this.searchResultData.error}`);
      setTimeout(async ()=>{
        // await this.router.navigate(["/multi-village-search"]);
      }, 3000);
    }
    this.chartData = []
    // console.log('[debug] search result data', this.searchResultData)
    // console.log('[debug] user selection', this.userSelectionList);
    for(let index in this.searchResultData) {
      this.dataSource = this.searchResultData[index].data;

      for(let item in this.userSelectionList) {
        if(this.userSelectionList[item].selectedTopic === this.searchResultData[index].tableNameChinese) {
          // console.log('hit selected topic', this.searchResultData[index])
          //advance filter - display only user selected categories
          const each_res = this.userSelectionList[item].hasCategory === true ? this.searchResultData[index].data.filter(dataItem =>
              {
                // console.log('[debug] filter', this.userSelectionList[item].category1List, dataItem.category1)
                return this.userSelectionList[item].category1List.indexOf(dataItem.category1) !== -1
              }
            ) : this.searchResultData[index].data;

          // console.log('each row in searchResultData', each_res)
          this.chartData.push(...each_res);
          this.displayResultsData.push({
            topicName: this.searchResultData[index].tableNameChinese,
            dataSource: new MatTableDataSource(each_res),
            displayedColumns: this.removeGazetteerId(this.searchResultData[index].field),
            selected_Categories: this.userSelectionList[item]. hasCategory ? 
            this.userSelectionList[item].category1List : null,
            downloadUrl: `${environment.API_ROOT}advancesearch/download/?village=${this.userInput.villageid.toString()}&topic=${this.mapFromCHToEN.get(this.searchResultData[index].tableNameChinese)}`
          })
        }
      }
    }

    this.mainPaginator.changes.subscribe(a => a.forEach((b, index) => 
    this.displayResultsData[index].dataSource.paginator = b));

    this.onlyGetSelectedCategoriesRow();
    this.filterChartData()
    // filter to decide to show chart
    // console.log('[debug] before show Chart check', this.displayResultsData)

    const updateShowChartMapToSubCategory = (showChartMap) => {
      const mapNewCategoryToOld = {}
      for(let item in showChartMap) {
        const subCategories = []
        // according to value in mapSubCategoryToNewSubCategory, add key to subCategories
        let flag = false;
        for(let key in mapSubCategoryToNewSubCategory) {
          if(mapSubCategoryToNewSubCategory[key] === item) {
            subCategories.push(key)
            flag = true;
          }
        }
        if(flag) {
          mapNewCategoryToOld[item] = subCategories;
        }
      }
      // console.log('[debug] maptoold', JSON.stringify(showChartMap), mapNewCategoryToOld)
      for(let key in mapNewCategoryToOld) {
        delete showChartMap[key]
        mapNewCategoryToOld[key].forEach(item => {
          showChartMap[item] = 1
        })
      }
      return showChartMap
    }

    const showChartMap = updateShowChartMapToSubCategory({'人口基本数据 Basic Info':1, '人口自然变化数据 Natural Population Change Data':1, '耕地面积 Cultivated Area':1, '人均收入 Per Capita Income':1});
    // console.log('[debug] map to old categories', showChartMap);
    const checkAllinShowChartMap = (arr) => {
      for(let i=0;i<arr.length;i++) {
        if(!showChartMap[arr[i]]) {
          return false
        }
      }
      return true;
    }

    for(let eachCategory of this.displayResultsData) {
      if(checkAllinShowChartMap(eachCategory.selected_Categories)) {
        eachCategory.showChart = true
      }
      // console.log('[debug] showChart check', eachCategory, checkAllinShowChartMap(eachCategory.selected_Categories))
    }
  }

  filterDataSource(event: Event, currentDataSource) {
      // console.log("currentDataSource",currentDataSource)
    const filterValue = (event.target as HTMLInputElement).value;
    currentDataSource.filter = filterValue.trim().toLowerCase();
    if (currentDataSource.paginator) currentDataSource.paginator.firstPage();
  }

  downloadCurrentTopic(event, topicName) {}

  onlyGetSelectedCategoriesRow() {}

  add(event: MatChipInputEvent, currentDataSource): void {
    const value = (event.value || '').trim();

    // console.log("event.input.value",event)

    currentDataSource.filter = event.input.value.trim().toLowerCase();
    // if (currentDataSource.paginator) currentDataSource.paginator.firstPage();

    // Add our vlaue
    if (value) {
      this.fruits.push({name: event.input.value});
    }
    
    // Clear the input value
    // event.chipInput!.clear();
    if (event.input) {
      event.input.value = '';
       }
  }

  remove(eachCategory): void {
    const index = this.fruits.indexOf(eachCategory);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

}
