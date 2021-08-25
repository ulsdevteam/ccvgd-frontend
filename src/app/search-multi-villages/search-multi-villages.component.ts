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
  Inject,
} from "@angular/core";
import { ProvinceCityCountyService } from "../services/province-city-county.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Router } from "@angular/router";
import { MultiVillageFilterService } from "../services/multi-village-filter.service";
import { HttpClient } from "@angular/common/http";
import { Input, Output, EventEmitter } from "@angular/core";
import { MatTabGroup } from "@angular/material/tabs";
import { Category, CheckList, PostDataToSearch, Year, DisplayTopicCategory } from "./modals/formatData";
import { HttpServiceService } from '../services/http-service.service';
// import { MatSelectionList } from "@angular/material/list";
import { MatListOption, MatSelectionListChange } from '@angular/material/list'
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { DialogComponent } from './dialog/dialog.component'

@Component({
  selector: "app-search-multi-villages",
  templateUrl: "./search-multi-villages.component.html",
  styleUrls: ["./search-multi-villages.component.css"],
})
export class SearchMultiVillagesComponent implements OnInit {
  @ViewChild("myYearDiv", { static: false }) myYearDiv: ElementRef;
  @ViewChild("tabGroup") tabGroup: MatTabGroup;
  @Input() okIsClick;

  comfirmDelete: boolean; 
  options;
  //TODO this is fake data for province, need change later
  provinceList: string[] = [];
  //city and county got from database with 100 values
  cityList: string[] = [];
  countyList: string[] = [];
  displayedColumns: string[] = [
    "isSelected",
    "village_name",
    "province",
    "city",
    "county",
  ];

//   1. 村志信息 Gazetteer Information
// 2. 村庄信息 Village Information —> ? 
// 3. 自然环境 Natural Environment
// 4. 自然灾害 Natural Disasters
// 5. 姓氏 Last Names
// 6. 首次拥有年份 Year of First Availability/Purchase
// 7. 民族 Ethnic Groups
// 8. 人口与人口迁移 Population and Migration
// 9. 军事, 政治, 管理 Military, Politics and Management
// 10. 经济 Economy
// 11. 计划生育 Family Planning
// 12. 教育 Education

  displayedMiddleTabs: string[] = [
    "村庄基本信息",
    "自然环境",
    "自然灾害",
    "姓氏",
    "第一次拥有或购买年份",
    "民族",
    "人口",
    "军事政治",
    "经济",
    "计划生育",
    "教育",
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
    ["村庄基本信息", "gazetteerinformation"],
    ["自然环境", "naturalenvironment"],
    ["自然灾害", "naturaldisasters"],
    ["姓氏", "fourthlastNames"],
    ["第一次拥有或购买年份", "firstavailabilityorpurchase"],
    ["民族", "ethnicgroups"],
    ["人口", "population"],
    ["军事政治", "military"],
    ["经济", "economy"],
    ["计划生育", "familyplanning"],
    ["教育", "education"]
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

  //TODO *****************************
  masterSelected: boolean;
  multiVillages_checkList: CheckList[] = [];
  multiVillages_checkedList: CheckList[] = [];
  checkedVillagesID: any[];
  //search
  postDataToSearch: PostDataToSearch[] = [];
  //search - select all
  filteredData: any[];
  //middle - category
  topicCategory: any[];

  category2_checkedList: any[];
  displayTopicCategory: DisplayTopicCategory[] = [];
  resultSelectedTopics: any[];
  tabIsChanged: boolean = false;

  //
  currentSelectedTopic: string;
  displayCategory2: string;
  //data
  responseData: any;
  //year -left top
  topicYear: Year[] = [];
  totalYearOnly: any[] = [];
  checked_year_only: any[] = [];


  constructor(
    private villageNameService: VillageNameService,
    private provinceCityCountyService: ProvinceCityCountyService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router, // private multiVillageFilterService: MultiVillageFilterService,
    private http: HttpClient,
    private multiVillageFilterService: MultiVillageFilterService,
    private httpService : HttpServiceService,
    public dialog: MatDialog
  ) {
    this.masterSelected = false;
    // console.log(this.filteredData);
    // this.provinceList = this.provinceCityCountyService.getProvince();
  }

  ngOnInit(): void {
    this.villageNameService.getVillages().then((result) => {
      this.totalList = result.data;
      result.data.map((item) => {
        if (this.cityList.includes(item.city) === false) {
          //push to array and prevent duplicate items
          //BUG
          if (this.provinceList.indexOf(item.province) == -1) {
            this.provinceList.push(item.province);
          }
          if (this.cityList.indexOf(item.city) == -1) {
            this.cityList.push(item.city);
          }
          if (this.countyList.indexOf(item.county) == -1) {
            this.countyList.push(item.county);
          }
        }
        this.multiVillages_checkList.push({
          village_id: item.id,
          village_name: item.name,
          province: item.province,
          city: item.city,
          county: item.county,
          isSelected: false
        });
      });
      this.options = new MatTableDataSource(result.data);
      this.filteredData = this.options.filteredData;
      // console.log("this.filteredData", this.filteredData)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.options.filter = filterValue.trim().toLowerCase();
    console.log(this.options.filter);
  }
   //********************* for checkbox field ************************************* */

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

    this.filteredData = this.options.filteredData;
    // console.log("this province", this.options)
  }

  changeCity(data: Event) {
    this.options.filter = data;

    this.countyList = [];
    this.options.filteredData.map((item) => {
      if (!this.countyList.includes(item.county)) {
        this.countyList.push(item.county);
      }
    });
    // console.log(this.options)
    this.filteredData = this.options.filteredData;
  }

  changeCounty(data) {
    this.options.filter = data;
    this.filteredData = this.options.filteredData;
  }
  
  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    //update checkLsit
    this.multiVillages_checkList = [];
    this.filteredData.map(item => {
      this.multiVillages_checkList.push({
        village_id: item.id,
        village_name: item.name,
        province: item.province,
        city: item.city,
        county: item.county,
        isSelected: false
      });
    })
    for(let i = 0; i < this.multiVillages_checkList.length; i++) {
      this.multiVillages_checkList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  //check if all the checkbox selected
  async isAllCheckBoxSelected(event: MatCheckboxChange, element) {
    let checkedItemID = this.multiVillages_checkList.findIndex((obj => obj.village_id === element.id));
    this.multiVillages_checkList[checkedItemID].isSelected = event.checked ? true : false;
    this.getCheckedItemList();
    this.getYearWithTopic();
  }

  //here all the items are checked 
  getCheckedItemList() {
    this.multiVillages_checkedList = [];
    for(let i = 0; i < this.multiVillages_checkList.length; i++) {
      if(this.multiVillages_checkList[i].isSelected)
      this.multiVillages_checkedList.push(this.multiVillages_checkList[i]);
    }
     this.getListOfchecked_VillagesID();
  }

  //*************************** post and get data ******************************* */
  //1. get list of village id and post request with all the topic -- as default

  getListOfchecked_VillagesID() {
    this.checkedVillagesID = [];
    for(let i in this.multiVillages_checkedList) {
      this.checkedVillagesID.push(this.multiVillages_checkedList[i].village_id);
    }
    if(this.checkedVillagesID.length > 0) this.processRequest();
  }

  deleteVillage(event, checkedItem) {
    const dialogRef = this.dialog.open(DialogComponent, {
      // width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);

      if(result) {
        let deleteElementIndex = this.multiVillages_checkList.findIndex(item => item === checkedItem);
        this.multiVillages_checkList[deleteElementIndex].isSelected = false;
        this.getCheckedItemList();
        console.log(this.multiVillages_checkedList);
      }
    });


  }

  // getDefaultTopics() 

  async processRequest() {
    const response =
    await this.multiVillageFilterService.onPostMultiVillages(
      {
        villageid: this.checkedVillagesID,
        //BUG 1.checkedall 2. fourthlastNames -- ask backend -
        // "ethnicgroups" BUG -- "firstavailabilityorpurchase","ethnicgroups","population" "military", "economy", 
        //"BUG - familyplanning", "education"
        //cannot read "field " undefined if not match all the topics for search results page.
        //BUG
        // topic: ["gazetteerinformation","naturalenvironment","naturaldisasters", "fourthlastNames",
        // "firstavailabilityorpurchase","population", "military", "economy", 
        // "education"],
        topic: ["gazetteerinformation","naturalenvironment","naturaldisasters", "fourthlastNames",
        "firstavailabilityorpurchase","ethnicgroups","population", "military", "economy", 
        "familyplanning", "education"],
        // topic:["population"]
        // year: [this.checked_year_only[0]],
      }
    );
    this.responseData = response;
    console.log("this.responseData", this.responseData)
    this.getTopicWithCategories();
    this.getYearWithTopic();
  }

  getTopicWithCategories() {
    //by default - hard coded
    this.topicCategory = [];
    let totalResults = [];
    if(this.currentSelectedTopic === undefined) this.currentSelectedTopic = "村庄基本信息";
    for(let index in this.responseData) {
      if(this.responseData[index].tableNameChinese === this.currentSelectedTopic) {
        // console.log(this.responseData[index]);
        for(let item in this.responseData[index].data){
          let storeCategoriesData = {
            category1: this.responseData[index].data[item].category1,
            isSelected: false,
            subCategories: {
              category2: this.responseData[index].data[item].category2,
              isSelected: false,
              subCategories: {
                category3: this.responseData[index].data[item].category3
              }
            }
        }
        totalResults.push(storeCategoriesData);
      }
    }
  }
  this.topicCategory = this.removeDuplicates(totalResults, "category1");
  // console.log(this.topicCategory);
}

  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = [];
    // this.topicCategory = [];
    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
    }

  tabChanged(event) {
    this.tabIsChanged = true;
    
    this.currentSelectedTopic = event.tab.textLabel;
    this.getTopicWithCategories();
    this.getYearWithTopic();
    console.log(this.topicCategory)
    console.log("topic select",this.displayTopicCategory);
    // this.resultSelectedTopics.push(this.displayTopicCategory);
    // console.log(this.category2_checkedList)
    // this.category2_checkedList = [];
  }

  getYearWithTopic() {
    this.topicYear = [];
    this.totalYearOnly = [];

    console.log(this.responseData);
    if(this.responseData) {
      let matchIndex = this.responseData.findIndex(item => item.tableNameChinese === this.currentSelectedTopic);

      for(let eachID in this.checkedVillagesID) {
        if(this.responseData[matchIndex].year) {
          let year_index = this.responseData[matchIndex].year.findIndex( (item) =>  {
          if(item[this.checkedVillagesID[eachID]]) {
            const currentTopicEN = this.middleTabsMap.get(this.currentSelectedTopic);
            const getYearObject = item[this.checkedVillagesID[eachID]][0][currentTopicEN];
            for(let eachYearIndex in getYearObject.year_only) {
              if(this.totalYearOnly.indexOf(getYearObject.year_only[eachYearIndex]) === -1) {
                this.totalYearOnly.push(getYearObject.year_only[eachYearIndex]);
                this.totalYearOnly.sort();
              }
            }
          }
        });
        }
      }

      this.topicYear.push({
        topic: this.currentSelectedTopic,
        village_id: this.checkedVillagesID,
        total_year_only: this.totalYearOnly
      })
    }
    console.log("topicYear", this.topicYear)
  }

  checkboxYear(event, selectedYear, checked) {
    // let selectedYear = year.toString();
    if(checked) {
      this.checked_year_only.push(selectedYear);
    }
    else{
      let removeIndex = this.checked_year_only.indexOf(selectedYear);
      if(removeIndex > -1 ) this.checked_year_only.splice(removeIndex, this.checked_year_only.length)
    }


    const values = Object.keys(this.checked_year_only).map(it => this.checked_year_only[it]);
    console.log(typeof values)


  }

  async postFinalRequest() {
    let resnew = await this.multiVillageFilterService.onPostMultiVillages(
      {
        //BUG 1.checkedall 2. fourthlastNames -- ask backend
          villageid: this.checkedVillagesID,
          topic: ["gazetteerinformation","naturalenvironment","naturaldisasters", "fourthlastNames",
            "firstavailabilityorpurchase","ethnicgroups","population", "military", "economy", 
            "familyplanning", "education"],
          year: this.checked_year_only
          // year_range: [2009, 2012],
      }
    );
    console.log("res", resnew);
  }

    //if search button is clicked, go to results page
    async goToPage() {
      this.processRequest();
      // this.postFinalRequest();
      this.router.navigate(["/multi-village-search-result"]);
    }
  // options: MatListOption[] - call multi-times
  categorySelection(checkedList) {
    this.tabIsChanged = false;
    let results_c1 = [];
    //BUG
    // this.displayTopicCategory = [];
    for(let index in this.topicCategory) {
      for(let item in checkedList) { 
        checkedList[item].isSelected = true; 
        if(results_c1.indexOf(checkedList[item].category1) === -1) {
          results_c1.push(checkedList[item].category1);
        }
      }
      this.category2_checkedList = checkedList;
    }

    if(results_c1.length > 0) {
      this.displayTopicCategory.push({
        selectedTopic: this.currentSelectedTopic,
        selectedCategoryList: results_c1
      })  
    }

    this.displayTopicCategory = this.removeDuplicates(this.displayTopicCategory, "selectedTopic");
        // console.log("topic select",this.displayTopicCategory);

  }
    //TODO  use dynamic db data - Later
    middleCheckBox(event: MatCheckboxChange) {
      const selectedText = event.source._elementRef.nativeElement.innerText;
      console.log(this.responseData);
    }

  //       //TODO
  //       //   const getChineseWordCategory1 = item.category1
  //       //     .split('')
  //       //     .filter((char) => /\p{Script=Han}/u.test(char))
  //       //     .join('');
  //       //   if (
  //       //     this.middleBoxCategory1.indexOf(getChineseWordCategory1) == -1
  //       //   ) {
  //       //     this.middleBoxCategory1.push(getChineseWordCategory1);
  //       //     this.cat1Cat2Map.set(item.category1, item.category2);
  //       //     // console.log('trigger');
  //       //     // this.category1Map.set(element.id, this.middleBoxCategory1);
  //       //   }
  //       // });
  //       // console.log('filter category 1 result ', this.middleBoxCategory1);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  //TODO
  onCreatePost(postData: { villageid: any; topic: any }) {
    // Send Http request
    this.httpService.post("advancesearch", postData).then((responseData) => {
        console.log("responseData", responseData);
      });
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
}