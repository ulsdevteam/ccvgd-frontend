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
import { DialogComponent } from './dialog/dialog.component';
import { MatCardModule } from "@angular/material/card";
import { FormControl } from "@angular/forms";


@Component({
  selector: "app-search-multi-villages",
  templateUrl: "./search-multi-villages.component.html",
  styleUrls: ["./search-multi-villages.component.css"],
})
export class SearchMultiVillagesComponent implements OnInit {
  @ViewChild("myYearDiv", { static: false }) myYearDiv: ElementRef;
  @ViewChild("tabGroup") tabGroup: MatTabGroup;
  @Input() okIsClick;
  formControl = new FormControl(['angular']);

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
  startYearInput: string = "";
  endYearInput: string = "";
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
    // ["村庄基本信息", "gazetteerinformation"],
    ["村庄基本信息", "village"],
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

  //
  currentSelectedTopic: string;
  displayCategory2: string;
  //data
  responseData: any;
  //year -left top
  topicYear: Year[] = [];
  totalYearOnly: any[] = [];
  checked_year_only: any[] = [];
  inputed_year_range: any[] = [];

  displayYearRange: string;
  //post
  finalPostTopicList: any[] = [];
  value1 = "";

//note is not category data under topic
  noCategoryData: boolean;
  noCategoryNote: string = "";

  //
  currentTopicData: any;
  category1Set = new Set();
  category2Set = new Set();
  category3Set = new Set();
  //

  // name *******
  allNamesData: any[] = [];
  filteredNamesData: any[] = [];
  showAllNamesDataList: any[] = [];
  showAllNamesDataListUnique: any[] = [];
  numsOfLastNames: any[] = [];
  nameOfVillage: any[] = [];
  isNamesTab: boolean = false;


  SingleYearIsChecked: boolean;
  closeSingleYear: boolean = false;
  closeYearRange: boolean = false;

  // tooltip field
  tooltip_start_year: string = "Please enter start year for searching";
  tooltip_end_year: string = "Please enter end year for searching";

  // ["village","naturalenvironment","naturaldisasters", "fourthlastNames",
  // "firstavailabilityorpurchase","ethnicgroups","population","military","economy","familyplanning","education"];
  defaultTopicList = ["village", "naturalenvironment","naturaldisasters",
  "fourthlastNames","firstavailabilityorpurchase","ethnicgroups",
  "population","military","economy","familyplanning","education"];
  defaultTopics_InCh = ["村庄基本信息","自然环境","自然灾害", "姓氏",
      "第一次拥有或购买年份","民族","军事政治","经济","计划生育"];

  search_value: string;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  currentPageNum: number = 1;
  form

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
    // this.getServerData(null);
    this.fetchVillageData(this.currentPageNum);
  }
  fetchVillageData(pageNum) {
    this.villageNameService.getVillages(pageNum).then((result) => {
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
    }).catch((error: any)  => {
      console.log("error from the back", error)
    });
  }

  clearSearchValue() {
    console.log("search_value=''")
    this.search_value=''
    this.fetchVillageData(1)
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  handleSearchInput(userInput) {

    this.villageNameService.filterVillages(userInput).then((searchResult) => {
      console.log(searchResult)
      this.options = new MatTableDataSource(searchResult.data);
      // this.filteredData = this.options.filteredData;
      console.log("this.filteredData",this.filteredData)
    }).catch((err: any) => {
      console.log("err", err)
    });
    // console.log(event)
  }

  getServerData(event? : PageEvent) {
    console.log(event)
    this.currentPageNum = event.pageIndex+1;
    this.fetchVillageData(this.currentPageNum);
    return event
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.options.filter = filterValue.trim().toLowerCase();
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
  }

  changeCity(data: Event) {
    this.options.filter = data;

    this.countyList = [];
    this.options.filteredData.map((item) => {
      if (!this.countyList.includes(item.county)) {
        this.countyList.push(item.county);
      }
    });
    this.filteredData = this.options.filteredData;
  }

  changeCounty(data) {
    this.options.filter = data;
    this.filteredData = this.options.filteredData;
  }
  
  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {

    if(!this.masterSelected) {
      this.topicCategory = [];
      this.category2_checkedList = [];
    }
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
    if(!this.masterSelected) {
      this.topicCategory = [];
      this.category2_checkedList = [];
    }

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
      this.checkedVillagesID.push(this.multiVillages_checkedList[i].village_id.toString());
    }
    if(this.checkedVillagesID.length > 0) this.processRequest();
  }

  deleteVillage(event, checkedItem) {
    const dialogRef = this.dialog.open(DialogComponent, {
      // width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {

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
        // topic: ["village","naturalenvironment","naturaldisasters", "fourthlastNames",
        // "firstavailabilityorpurchase","ethnicgroups","population", "military", "economy", 
        // "familyplanning", "education"],
        topic: this.defaultTopicList,
        year: []
      }
    );

    this.responseData = response;
    console.log("this.responseData", this.responseData)
    this.getTopicWithCategories();
    this.getYearWithTopic();
  }

  getUniqueListByKey(inputList:any[], key) {
    return [...new Map(inputList.map(item => [item[key], item])).values()]
  }

  getAllCurrentLastNames() {

    let currentLastNameRow = "";
    this.isNamesTab = true;
    // console.log("ming ", this.currentTopicData.data)
    this.allNamesData = this.currentTopicData.data;

    let village_info = {
      villageId: "",
      name: "",
      num: "",
      fiveLastNames:""
    };
  
    for(let i = 0; i < this.allNamesData.length; i++) {
      this.showAllNamesDataList.push({
        name: this.allNamesData[i].gazetteerName,
        num: this.allNamesData[i].totalNumberOfLastNameInVillage,
        fiveLastNames: `${this.allNamesData[i].firstLastNameId}${this.allNamesData[i].secondLastNameId}
        ${this.allNamesData[i].thirdLastNameId}${this.allNamesData[i].fourthLastNameId}
        ${this.allNamesData[i].fifthLastNameId}`
      })
    }
  
    this.showAllNamesDataListUnique = this.getUniqueListByKey(this.showAllNamesDataList, "name");

  }

  getTopicWithCategories() {
    //by default - hard coded
    this.topicCategory = [];
    let totalResults = [];
    //
    
    this.category1Set.clear();
    this.category2Set.clear();
    this.showAllNamesDataListUnique = [];
    // this.showAllNamesDataRow.clear();

    const checkedIndex = this.multiVillages_checkList.filter(item => item.isSelected === true);
    console.log("this.selected index",checkedIndex.length)

    if(this.currentSelectedTopic === undefined) {
      this.currentSelectedTopic = "村庄基本信息";
      this.closeSingleYear = true;
      this.closeYearRange = true;
      this.tooltip_start_year = this.tooltip_end_year = `current ${this.currentSelectedTopic} selection do NOT have year field data`
      
    }
    for(let index in this.responseData) {
      if(this.responseData[index].tableNameChinese === this.currentSelectedTopic) {
        this.currentTopicData = this.responseData[index];
        console.log("currentTopicData",this.currentTopicData);

        if(this.currentTopicData.data.length === 0) {
          this.noCategoryData = true;
          this.noCategoryNote = `current selected topic 
          ${this.currentTopicData.tableNameChinese} has no category data`;
        }

        else {
          this.noCategoryData = false;
          if(this.currentTopicData.year === undefined) {
            this.closeSingleYear = true;
            this.closeYearRange = true;
            this.tooltip_start_year = this.tooltip_end_year = `current ${this.currentTopicData.tableNameChinese} selection do NOT have year field data`
          }
          else{
            this.closeSingleYear = false;
            this.closeYearRange = false;
          }
          if(this.responseData[index].tableNameChinese === "姓氏")  this.getAllCurrentLastNames();
          else {
            this.isNamesTab = false;
            for(let item in this.responseData[index].data){
              this.category1Set.add(this.responseData[index].data[item].category1);
            }
          }
        }


    }
  }

    //   if(checkedIndex.length === 0) {
    //     this.category1Set.clear();
    //     this.category2Set.clear();
    // }
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

    console.log("this reponse", this.responseData)
    this.currentSelectedTopic = event.tab.textLabel;
    this.onLoadCurrentTabData(this.currentSelectedTopic);
    this.getTopicWithCategories();
    this.getYearWithTopic();
    // this.showAllNamesDataListUnique = [];
    //clear name sets

  }

  onLoadCurrentTabData(currentTab) {
    console.log("currentTab",currentTab)

    if(this.closeSingleYear && this.closeYearRange) {
      this.tooltip_start_year = this.tooltip_end_year 
      = `current ${currentTab} selection do NOT have year field data`
    }
    if(this.noCategoryData) {
      this.noCategoryNote = `current selected topic 
      ${currentTab} has no category data`;
    }
  }

  //TODO
  getYearWithTopic() {
    this.topicYear = [];
    this.totalYearOnly = [];

    // BUG
    if(this.responseData) {
      let matchIndex = this.responseData.findIndex(item => item.tableNameChinese === this.currentSelectedTopic);

      for(let eachID in this.checkedVillagesID) {
        if(this.responseData[matchIndex] && this.responseData[matchIndex].year) {
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
  }

  //TODO
  checkboxYear(event, selectedYear, checked) {
    // let selectedYear = year.toString();

    if(checked) {
      this.SingleYearIsChecked = true;
      this.checked_year_only.push(selectedYear);
      this.closeSingleYear = false;
      this.closeYearRange = true;
    }
    else{
      // this.closeYearRange = false;
      this.SingleYearIsChecked = false;
      let removeIndex = this.checked_year_only.indexOf(selectedYear);
      if(removeIndex > -1 ) this.checked_year_only.splice(removeIndex, this.checked_year_only.length)
    }


    if(this.checked_year_only.length > 0) {
      this.closeYearRange = true;
    }
    else{
      this.closeYearRange = false;
    }

    // if(selectedYear.length)
    // console.log(selectedYear)
    // console.log(event)


    const values = Object.keys(this.checked_year_only).map(it => this.checked_year_only[it]);


  }

  async postFinalRequest() {

    let resnew = await this.multiVillageFilterService.onPostMultiVillages(
      {
        //BUG 1.checkedall 2. fourthlastNames -- ask backend
          villageid: this.checkedVillagesID,
          // topic: ["gazetteerinformation","naturalenvironment","naturaldisasters", "fourthlastNames",
          //   "firstavailabilityorpurchase","ethnicgroups","population", "military", "economy", 
          //   "familyplanning", "education"],
          topic: this.finalPostTopicList.length > 0 ? this.finalPostTopicList : this.defaultTopicList,
          year: this.checked_year_only,
          year_range: this.inputed_year_range
          // year_range: [2009, 2012],
      }
    );
  }

    //if search button is clicked, go to results page
    async goToPage() {
      for(let item in this.displayTopicCategory) {
        this.finalPostTopicList.push(this.middleTabsMap.get(this.displayTopicCategory[item].selectedTopic))
        }
      
      // console.log("this.finalPostTopicList" , this.finalPostTopicList)
      
      if(this.finalPostTopicList.length === 0 && this.checked_year_only.length === 0) {
        //convert to get request backend
        this.processRequest();
      }
      else if(this.finalPostTopicList.length === 0 && this.checked_year_only.length > 0) {
        this.postFinalRequest();
      }
      else {
        this.postFinalRequest();
      }

      if(this.displayTopicCategory.length < 1) {

        for(let i = 0; i < this.defaultTopics_InCh.length; i++) {    
        this.displayTopicCategory.push({
        selectedTopic: this.defaultTopics_InCh[i],
        hasCategory: false
        }) 
      }

      }

      this.storeUserSelection();
      
      this.router.navigate(["/multi-village-search-result"]);
    }
  // options: MatListOption[] - call multi-times
  category1Selection(selectedCategory1List) {
    this.category2Set.clear();
    for(let i = 0; i < selectedCategory1List.length; i++) {
      for(let item in this.currentTopicData.data) {
        if(this.currentTopicData.data[item].category1 && this.currentTopicData.data[item].category1 === selectedCategory1List[i]) {
          if(this.currentTopicData.data[item].category2 && this.currentTopicData.data[item].category2 !== "null") {
          this.category2Set.add(this.currentTopicData.data[item].category2);
        }}
      }
    }

      this.displayTopicCategory.push({
        selectedTopic: this.currentSelectedTopic,
        category1List: selectedCategory1List,
        hasCategory: true
      })  
      this.displayTopicCategory = this.removeDuplicates(this.displayTopicCategory, "selectedTopic");




    
    




    // let results_c1 = [];
    // //BUG
    // // this.displayTopicCategory = [];
    // for(let index in this.topicCategory) {
    //   for(let item in checkedList) { 
    //     checkedList[item].isSelected = true; 
    //     if(results_c1.indexOf(checkedList[item].category1) === -1) {
    //       results_c1.push(checkedList[item].category1);
    //     }
    //   }
    //   this.category2_checkedList = checkedList;
    // }

    // if(results_c1.length > 0) {
    //   this.displayTopicCategory.push({
    //     selectedTopic: this.currentSelectedTopic,
    //     selectedCategoryList: results_c1
    //   })  
    // }

    // this.displayTopicCategory = this.removeDuplicates(this.displayTopicCategory, "selectedTopic");
    //     // console.log("topic select",this.displayTopicCategory);

    //TODO
    // window.localStorage.setItem("user selection", JSON.stringify(this.displayTopicCategory));
  }

  storeUserSelection() {
    window.localStorage.setItem("user selection", JSON.stringify(this.displayTopicCategory));
  }


  category2Selection(selectedCategory2List) {
    this.category3Set.clear();
    for(let i = 0; i < selectedCategory2List.length; i++) {
      for(let item in this.currentTopicData.data) {
        if(this.currentTopicData.data[item].category2 && this.currentTopicData.data[item].category2 === selectedCategory2List[i]) {
          if(this.currentTopicData.data[item].category3 && this.currentTopicData.data[item].category3 !== "null") {
          this.category3Set.add(this.currentTopicData.data[item].category3);
        }}
      }
    }
    // window.localStorage.setItem("user selection", JSON.stringify(this.displayTopicCategory));

    // this.displayTopicCategory.push({
    //   selectedTopic: this.currentSelectedTopic,
    //   category1List: selectedCategory1List
    // })  
    // this.displayTopicCategory = this.removeDuplicates(this.displayTopicCategory, "selectedTopic");

    // console.log("this.category3Set",this.category3Set)
  }
    //TODO  use dynamic db data - Later
    middleCheckBox(event: MatCheckboxChange) {
      const selectedText = event.source._elementRef.nativeElement.innerText;
      // console.log(this.responseData);
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
        // console.log("responseData", responseData);
      });
  }

  // onInputStartYearField(event: any) {
  //   this.startYearInput = event.target.value;
  //   console.log(event.target.value);
  // }
  // onInputEndYearField(event: any) {
  //   this.endYearInput = event.target.value;
  //   // console.log(event.target.value);
  // }

  async onPostInputYear() {
    // console.log("value", this.value1)
    this.inputed_year_range = [
      parseInt(this.startYearInput),
      parseInt(this.endYearInput),
    ];

    this.displayYearRange = `${this.startYearInput} --- ${this.endYearInput}`;


    if(this.startYearInput && this.endYearInput) {
      if(this.endYearInput > this.startYearInput) {
        this.closeSingleYear = true;
      }
      if(this.endYearInput === this.startYearInput) {
        this.closeSingleYear = true;
        this.checked_year_only.push(parseInt(this.startYearInput));
        this.inputed_year_range = [];
        this.displayYearRange = "";
      }
      // else this.closeSingleYear = false;

      if(this.endYearInput < this.startYearInput) 
      alert("end Year input should be larger or euqual to start year input");
      
    }
    else{
      this.closeSingleYear = false;
    }

    console.log("this.checked_year_only",this.checked_year_only)

    if(!this.startYearInput || !this.endYearInput) alert("please input year fields")

  
  }

  rightTopYearCheckBox(event: MatCheckboxChange) {
    this.singleYearSelected = event.source._elementRef.nativeElement.innerText;
    //IMPORTANT
    if (event.checked) {
      alert("check")
      // m;
      this.closeYearRange = true;
      // console.log("singleYearSelected", this.singleYearSelected);
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

  resetAll() {
    //left
    this.masterSelected = false;
    this.multiVillages_checkedList = [];
    //middle
    this.topicCategory = [];
    this.category2_checkedList = [];
    this.displayTopicCategory = [];

  }
}

// import {Component} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';

// /**
//  * @title Configurable paginator
//  */
// @Component({
//   selector: 'search-paginator',
//   templateUrl: 'search-paginator.html',
//   styleUrls: ['search-paginator.css'],
// })
// export class PaginatorConfigurableExample {
//   // MatPaginator Inputs
//   length = 100;
//   pageSize = 10;
//   pageSizeOptions: number[] = [5, 10, 25, 100];

//   // MatPaginator Output
//   pageEvent: PageEvent;

//   setPageSizeOptions(setPageSizeOptionsInput: string) {
//     if (setPageSizeOptionsInput) {
//       this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
//     }
//   }
// }
