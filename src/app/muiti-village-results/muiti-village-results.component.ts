import { MatTableDataSource } from "@angular/material/table";
import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MultiVillageFilterService } from "../services/multi-village-filter.service";
import { MatPaginator } from "@angular/material/paginator";
import { Router } from "@angular/router";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
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
})
export class MuitiVillageResultsComponent implements OnInit {
  @ViewChildren(MatPaginator) mainPaginator = new QueryList<MatPaginator>();
  // @Input() dataSource;
  // @ViewChild("mainPaginator") mainPaginator: MatPaginator;

  userInput: any = {};
  getAllResponses: any = {};

  inputSearchField: any;


  dataSource;

  searchResultData: any = {}
  displayResultsData: any[] = []

  userSelectionList: any[] = []

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


  constructor(private multiVillageFilterService: MultiVillageFilterService,private router: Router) {}





  ngOnInit(): void {
    this.userSelectionList = JSON.parse(window.localStorage.getItem("user selection"));
    this.getData();
    console.log("userSelectionList", this.userSelectionList)
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
    //TODO POST TO MUCH
    // console.log('get it !', await this.multiVillageFilterService.getUserList);
    this.userInput = await this.multiVillageFilterService.getUserList;
    console.log("this.userInput",this.userInput)
    // localStorage.setItem("userInput", this.userInput);


    this.searchResultData  = await this.multiVillageFilterService.onPostMultiVillages(this.userInput);
    console.log(this.searchResultData)

    if(this.searchResultData.code === 4001) {
      this.router.navigate(["/multi-village-search"]);
    }
  
        for(let index in this.searchResultData) {
          // this.searchResultData[index]
          console.log(this.searchResultData[index]);
          this.dataSource = this.searchResultData[index].data;
          for(let item in this.userSelectionList) {
            if(this.userSelectionList[item].selectedTopic === this.searchResultData[index].tableNameChinese) {
              console.log(this.searchResultData[index].data)

              const each_res = this.searchResultData[index].data.filter(i => 
                this.userSelectionList[item].selectedCategoryList.indexOf(i.category1) !== -1)

              this.displayResultsData.push({
                topicName: this.searchResultData[index].tableNameChinese,
                dataSource: new MatTableDataSource(each_res),
                displayedColumns: this.removeGazetteerId(this.searchResultData[index].field),
                selected_Categories: this.userSelectionList[item].selectedCategoryList
              })
            }
          }
        }
        this.mainPaginator.changes.subscribe(a => a.forEach((b, index) => 
        this.displayResultsData[index].dataSource.paginator = b));

        this.onlyGetSelectedCategoriesRow();
  }

  
    filterDataSource(event: Event, currentDataSource) {
      console.log("currentDataSource",currentDataSource)
    const filterValue = (event.target as HTMLInputElement).value;
    currentDataSource.filter = filterValue.trim().toLowerCase();
    if (currentDataSource.paginator) currentDataSource.paginator.firstPage();
  }

  onlyGetSelectedCategoriesRow() {}

  add(event: MatChipInputEvent, currentDataSource): void {
    const value = (event.value || '').trim();

    console.log("event.input.value",event)

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
