import {
  VillageNameService,
  TableData,
} from "./../services/village-name.service";
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { ProvinceCityCountyService } from "../services/province-city-county.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Router } from "@angular/router";
import { MultiVillageFilterService } from "../services/multi-village-filter.service";
import { HttpClient } from "@angular/common/http";
import { Input, Output, EventEmitter } from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";
import { Category,CheckBox } from "./modals/formatData";
// import myData from '../../assets/data.json';

@Component({
  selector: "app-search-multi-villages",
  templateUrl: "./search-multi-villages.component.html",
  styleUrls: ["./search-multi-villages.component.css"],
})
export class SearchMultiVillagesComponent implements OnInit {
  @ViewChild("myYearDiv", { static: false }) myYearDiv: ElementRef;
  @ViewChild("tabGroup") tabGroup: MatTabGroup;
  options;
  //TODO this is fake data for province, need change later
  provinceList: string[] = [];
  //city and county got from database with 100 values
  cityList: string[] = [];
  countyList: string[] = [];
  displayedColumns: string[] = [
    "checked",
    "name",
    "province",
    "city",
    "county",
  ];

  displayedMiddleTabs: string[] = [
    "经济",
    "第一次购买或拥有年份",
    "人口",
    "军事政治",
    "计划生育",
    "教育",
    "姓氏",
    "自然环境",
    "自然灾害",
  ];

  dataSource;
  selectedValue: string;
  provinceSearch: string;
  citySearch: string;
  countySearch: string;
  villageSearch: string;
  totalList: any = {};
  checkItems = new Map();
  tempcheckItems: string[] = [];
  rightToptempcheckItems: string[] = [];
  startYearInput: string;
  endYearInput: string;
  searchCollectorInput: string;
  multiSearchResult: any;
  selectedTabLabel: string;

  searchResult: TableData[];

  villageidList: any = [];

  middleBoxCategory1: string[] = [];
  middleBoxCategory2: string[] = [];

  category1Map = new Map();
  cat1Cat2Map = new Map();
  middleTabsMap = new Map([
    ["经济", "economy"],
    ["第一次购买或拥有年份", "firstavailabilityorpurchase"],
    ["人口", "population"],
    ["军事政治", "military"],
    ["计划生育", "familyplanning"],
    ["教育", "education"],
    ["姓氏", "fourthlastNames"],
    ["自然环境", "naturalenvironment"],
    ["自然灾害", "naturaldisasters"],
  ]);

  postVillagesTopics = {
    villageid: [""],
    topic: [""],
    //TODO
    // topic: ['economy'],
  };
  categoryResult: any = {};
  singleYearList: string[] = [];
  singleYearMap = new Map();
  singleYearSelected: string;

  postYearData = {
    villageid: [],
    topic: [],
    year: [],
    year_range: [],
  };

  allVillagesSelected: boolean = false;
  subVillageSelected: boolean = false;

  constructor(
    private villageNameService: VillageNameService,
    private provinceCityCountyService: ProvinceCityCountyService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router, // private multiVillageFilterService: MultiVillageFilterService,
    private http: HttpClient,
    private multiVillageFilterService: MultiVillageFilterService
  ) {  }

  ngOnInit(): void {
    this.villageNameService.getVillages().then((result) => {
      this.totalList = result.data;
      result.data.map((item) => {
        if (this.cityList.includes(item.city) === false) {
          //push to array and prevent duplicate items
          if (this.provinceList.indexOf(item.province) == -1) this.provinceList.push(item.province);
          if (this.cityList.indexOf(item.city) == -1) this.cityList.push(item.city);
          if (this.countyList.indexOf(item.county) == -1) this.countyList.push(item.county);
        }
      });
      this.options = new MatTableDataSource(result.data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.options.filter = filterValue.trim().toLowerCase();
  }

  selectAllVillages(selectAll: boolean) {
    this.allVillagesSelected = selectAll;
  }

  async checkBoxValue(subVillageSelected: boolean, element) {
    console.log('check box event', subVillageSelected);
    this.multiSearchResult = element;
    console.log(element.id);
    let getTopic = [];
    if (getTopic.length === 0 || getTopic[0] === undefined) {
      // getTopic = "economy";
      getTopic.push("economy", "population", "military");
    }

    this.postVillagesTopics = {
      villageid: [element.id],
      topic: getTopic,
      //TODO
      // topic: ['economy'],
    };
    this.getVillageDataWithTopics();

    console.log("getTopic🧸 ", getTopic);

    if (getTopic[0] === undefined) {
      console.log("true");
    }
    if (element.id) {
      this.villageidList.push(element.id);

      const currentServiceData =
        await this.multiVillageFilterService.onPostMultiVillages(
          this.postVillagesTopics
        );

      console.log(currentServiceData);
    }
    console.log(await this.cat1Cat2Map);

    if (subVillageSelected) {
      this.checkItems.set(element.id, element);
    } else {
      this.checkItems.delete(element.id);
      // this.category1Map.delete(element.id);
    }

    //BUG default value?
    if (this.selectedTabLabel === undefined) {
      this.selectedTabLabel = "经济";
    }
  }

  tabChanged(event) {
    //TODO this is a change event
    this.selectedTabLabel = event.tab.textLabel;
    // console.log(event.tab.textLabel);
    console.log(this.middleTabsMap.get(this.selectedTabLabel));
    const newTopic = this.middleTabsMap.get(this.selectedTabLabel);
    //clear
    this.middleBoxCategory1 = [];
    this.middleBoxCategory2 = [];
    this.categoryResult = {};

    // this.postVillagesTopics.topic[0] = newTopic;
    // BUG;
    if (this.postVillagesTopics.topic.indexOf(newTopic) === -1) {
      this.postVillagesTopics.topic.push(newTopic);
    }
    //
    this.getVillageDataWithTopics();
  }

  async getVillageDataWithTopics() {
    //TODO
    // this.getCheckBoxLanguageChinese(currentServiceData[2].data[0].category1);
    console.log("post Villages and Topics 😵‍💫", this.postVillagesTopics);
    this.multiVillageFilterService
      .onPostMultiVillages(this.postVillagesTopics)
      .then((result) => {
        console.log("post topics and village id result", result);
        // console.log(typeof result);
        console.log("size", Object.keys(result).length);
        console.log(result[2].tableNameChinese);

        let rawCategories = result[2].data;
        console.log("rawCategories", rawCategories);

        //clear
        this.middleBoxCategory1 = [];
        this.categoryResult = {};

        for (let c of rawCategories) {
          if (!(c.category1 in this.categoryResult)) {
            this.categoryResult[c.category1] = {
              name: c.category1,
              childCategories: [],
            };
            if (!(c.category2 in this.categoryResult)) {
              this.categoryResult[c.category1].childCategories.push(
                c.category2
              );
            }
          }
        }
        console.log(this.categoryResult);

        for (let i in this.categoryResult) {
          // console.log(i);
          this.middleBoxCategory1.push(i);
          // console.log(result[i].childCategories);
        }
        console.log("result", this.categoryResult);

        // if(this.categoryResult)
        // }

        // for(let i = 0; i < Object.keys(result).length; i++) {

        // }

        // result[2].data.map((item) => {

        //   // console.log(item);
        //TODO
        //   const getChineseWordCategory1 = item.category1
        //     .split('')
        //     .filter((char) => /\p{Script=Han}/u.test(char))
        //     .join('');
        //   if (
        //     this.middleBoxCategory1.indexOf(getChineseWordCategory1) == -1
        //   ) {
        //     this.middleBoxCategory1.push(getChineseWordCategory1);
        //     this.cat1Cat2Map.set(item.category1, item.category2);
        //     // console.log('trigger');
        //     // this.category1Map.set(element.id, this.middleBoxCategory1);
        //   }
        // });
        // console.log('filter category 1 result ', this.middleBoxCategory1);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getCheckboxValuesMiddle() {}

  //TODO
  onCreatePost(postData: { villageid: any; topic: any }) {
    // Send Http request
    this.http
      .post("http://ngrok.luozm.me:8395/ccvg/advancesearch", postData)
      .subscribe((responseData) => {
        console.log("responseData", responseData);
      });
  }

  //TODO  use dynamic db data
  middleCheckBox(event: MatCheckboxChange) {
    const selectedText = event.source._elementRef.nativeElement.innerText;

    // console.log(this.categoryResult[selectedText].childCategories[0]);

    let category2Text = "";
    if (this.categoryResult[selectedText].childCategories) {
      category2Text = this.categoryResult[selectedText].childCategories[0];
    }

    // console.log(selectedText);
    if (event.checked) {
      // console.log(event.source._elementRef.nativeElement.innerText);

      this.tempcheckItems.push(selectedText);

      if (this.categoryResult[selectedText].childCategories[0] !== "null") {
        this.middleBoxCategory2.push(category2Text);
      }
      // this.tempcheckItems.push(event.source.name);
    } else {
      // var index = this.tempcheckItems.indexOf(event.source.name);
      var index = this.tempcheckItems.indexOf(selectedText);
      if (index > -1) {
        this.tempcheckItems.splice(index, 1);
      }

      // category2Text == 'null';
      this.middleBoxCategory2 = [];

      // this.checkItems.delete(element.id);
    }
  }

  arr_diff(a1, a2) {
    var a = [],
      diff = [];

    for (var i = 0; i < a1.length; i++) {
      a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
        delete a[a2[i]];
      } else {
        a[a2[i]] = true;
      }
    }
    for (var k in a) {
      diff.push(k);
    }
    return diff;
  }

  changeProvince(data: Event) {
    this.options.filter = data;

    this.cityList = [];
    this.options.filteredData.map((item) => {
      if (!this.cityList.includes(item.city)) {
        this.cityList.push(item.city);
      }
    });

    this.countyList = [];
    this.options.filteredData.map((item) => {
      if (!this.countyList.includes(item.county)) {
        this.countyList.push(item.county);
      }
    });
  }

  changeCity(data: Event) {
    this.options.filter = data;

    this.countyList = [];
    this.options.filteredData.map((item) => {
      if (!this.countyList.includes(item.county)) {
        this.countyList.push(item.county);
      }
    });
  }

  changeCounty(data) {
    this.options.filter = data;
  }

  onInputStartYearField(event: any) {
    this.startYearInput = event.target.value;
    console.log(event.target.value);
  }
  onInputEndYearField(event: any) {
    this.endYearInput = event.target.value;
    console.log(event.target.value);
  }

  async onPostInputYear() {
    //TODO single selection first

    // this.postYearData = {
    //   villageid: this.postVillagesTopics.villageid,
    //   topic: this.postVillagesTopics.topic,
    //   year: [],
    //   year_range: [parseInt(this.startYearInput), parseInt(this.endYearInput)],
    // };

    this.postYearData.villageid = this.postVillagesTopics.villageid;
    this.postYearData.topic = this.postVillagesTopics.topic;
    this.postYearData.year_range = [
      parseInt(this.startYearInput),
      parseInt(this.endYearInput),
    ];
    console.log("this postYearData", this.postYearData);

    let x = this.postVillagesTopics.villageid;
    this.multiVillageFilterService
      .postYearMultiVillages(this.postYearData)
      .then((result) => {
        console.log("year res", result[2].year[0]);
        result[2].year.map((villageData) => {
          // console.log(villageYear[42]);
          villageData[parseInt(this.postVillagesTopics.villageid[0])].map(
            (allYearData) => {
              // for
              for (let i = 0; i < allYearData.year_range.length; i++) {
                const singleYear = allYearData.year_range[i][0];
                //TODO use hashmap later
                // this.singleYearMap.set(
                //   this.postVillagesTopics.villageid,
                //   allYearData.year_range[i][0]
                // );
                if (this.singleYearList.indexOf(singleYear) === -1) {
                  this.singleYearList.push(singleYear);
                } else {
                  console.log("dup value 😈", singleYear);
                }
              }
              // console.log(this.singleYearMap);
              // console.log(allYearData.year_range.length);
            }
          );
        });
        // console.log("result ");
      });
  }

  rightTopYearCheckBox(event: MatCheckboxChange) {
    this.singleYearSelected = event.source._elementRef.nativeElement.innerText;
    //IMPORTANT
    if (event.checked) {
      // m;
      console.log("singleYearSelected", this.singleYearSelected);
      this.postYearData.year.push(parseInt(this.singleYearSelected));
      this.rightToptempcheckItems.push(event.source.name);
    } else {
      //remove the uncheck single year
      this.postYearData.year.splice(
        this.postYearData.year.indexOf(this.singleYearSelected)
      );
      var index = this.rightToptempcheckItems.indexOf(event.source.name);
      if (index > -1) {
        this.rightToptempcheckItems.splice(index, 1);
      }
      // this.checkItems.delete(element.id);
    }

    //do post to year serve
    this.onPostInputYear();

    // console.log(this.postYearData);
  }

  //TODO
  // addInputYears() {
  //   console.log('input year called');
  //   // console.log(this.startYearInput + ' - ' + this.endYearInput);

  //   const div = this.renderer.createElement('p');
  //   const text = this.renderer.createText(
  //     `${this.startYearInput} - ${this.endYearInput}`
  //   );
  //   this.renderer.appendChild(div, text);
  //   // console.log(this.myYearDiv.nativeElement);
  //   this.renderer.appendChild(this.myYearDiv.nativeElement, div);
  // }

  resetAll() {
    console.log("reset");
    this.checkItems.clear();
    this.tempcheckItems = [];
    this.rightToptempcheckItems = [];
    // const div =

    const childElements = this.myYearDiv.nativeElement.children;
    console.log("childElements", childElements);
    for (let child of childElements) {
      this.renderer.removeChild(this.myYearDiv.nativeElement, child);
    }

    this.searchCollectorInput = "";
    // this.startYearInput = '';
  }

  async goToPage() {
    console.log(this.villageidList);
    console.log(this.checkItems);
    console.log(this.multiSearchResult);

    console.log(
      "this is the searchResult ",
      await this.multiVillageFilterService.onPostMultiVillages(
        this.postVillagesTopics
      )
    );
    // this.onCreatePost(postData);

    window.localStorage.setItem(
      "choose",
      JSON.stringify(this.multiSearchResult)
    );
    this.router.navigate(["/multi-village-search-result"]);
  }
}
