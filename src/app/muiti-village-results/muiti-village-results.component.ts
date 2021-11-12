import { MatTableDataSource } from "@angular/material/table";
import { Component, ElementRef, Inject, Input, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MultiVillageFilterService } from "../services/multi-village-filter.service";
import { MatPaginator } from "@angular/material/paginator";
import { Router } from "@angular/router";
import {COMMA, ENTER, P} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

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
  @ViewChild('TABLE') table: ElementRef;
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

  mapFromCHToEN = new Map([
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

  getVillageidForDownload: string;
  gazetteerinformationDisplay: any[] = []
  gazetteerinformation_datasource;
  gazetterinfo_displayColumns: any[] = []
  pageIsLoading: boolean = true;

  downloadAllUrl: string;

  constructor(private multiVillageFilterService: MultiVillageFilterService,private router: Router,
    public dialog: MatDialog) {}





  ngOnInit(): void {
    this.userSelectionList = JSON.parse(window.localStorage.getItem("user selection"));
    this.getData();
    // console.log("userSelectionList", this.userSelectionList)
  }

  removeVillageId(rawArray) {
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
    // console.log(this.userInput.topic.push("gazetteerinformation"))
    // console.log("this.userInput",this.userInput)

    this.searchResultData  = await this.multiVillageFilterService.onPostMultiVillages(this.userInput);

    console.log("this.searchResultData",this.searchResultData)

    if(this.searchResultData.length > 0) this.pageIsLoading = false;
    else this.pageIsLoading = true;

    if(this.pageIsLoading) {
      const dialogRef = this.dialog.open(PageLoadDialog, {
        width: '250px',
        data: this.pageIsLoading
      });

      console.log("dialogRef",dialogRef)
    }

    if(this.searchResultData.code === 4001) {
      this.router.navigate(["/multi-village-search"]);
      // this.pageIsLoading = false
    }
    if(this.searchResultData.data && this.searchResultData.data.length === 0) {
      alert(`后端返回报错 !  \n  error message: ${this.searchResultData.error}`);
      this.router.navigate(["/multi-village-search"]);
      // this.pageIsLoading = false;
    }


    // console.log("this.searchResultData[0].data",this.searchResultData[0].data)
    // console.log("1",this.searchResultData[1].data)
    // this.gazetteerinformation_datasource = new MatTableDataSource(this.searchResultData[0].data);
    // this.gazetterinfo_displayColumns =  this.removeVillageId(this.searchResultData[0].field);
    // console.log("displayResultsData",this.displayResultsData)
    
  

    console.log("data", this.searchResultData)
        for(let index in this.searchResultData) {
          this.dataSource = this.searchResultData[index].data;

          console.log(this.userSelectionList)

          for(let item in this.userSelectionList) {

            if(this.userSelectionList[item].selectedTopic === this.searchResultData[index].tableNameChinese
              || this.userSelectionList[item].selectedTopic === "村志基本信息"
              ) {

              //advance filter - display only user selected categories
              const each_res = this.userSelectionList[item].hasCategory === true ? this.searchResultData[index].data.filter(i => 
                this.userSelectionList[item].category1List.indexOf(this.convertToChinese(i.category1)) !== -1) : this.searchResultData[index].data;

              this.displayResultsData.push({
                topicName: this.searchResultData[index].tableNameChinese,
                dataSource: new MatTableDataSource(each_res),
                displayedColumns: this.removeVillageId(this.searchResultData[index].field),
                selected_Categories: this.userSelectionList[item]. hasCategory ? 
                this.userSelectionList[item].category1List : null,
                downloadUrl: `${environment.API_ROOT}advancesearch/download/?village=${this.userInput.villageid.toString()}&topic=${this.mapFromCHToEN.get(this.searchResultData[index].tableNameChinese)}`
              })
            }
          }
        }

        console.log(this.displayResultsData)
        this.mainPaginator.changes.subscribe(a => a.forEach((b, index) => 
        this.displayResultsData[index].dataSource.paginator = b));

        this.onlyGetSelectedCategoriesRow();
  }


  convertToChinese(word) {
    const getChineseWord = word
        .split('')
        .filter((char) => /\p{Script=Han}/u.test(char))
        .join('');
    
    // console.log("getChineseWord",getChineseWord)
    return getChineseWord;
  }

  
    filterDataSource(event: Event, currentDataSource) {
      // console.log("currentDataSource",currentDataSource)
    const filterValue = (event.target as HTMLInputElement).value;
    currentDataSource.filter = filterValue.trim().toLowerCase();
    if (currentDataSource.paginator) currentDataSource.paginator.firstPage();
  }

  downloadCurrentTopic(event, topicName) {
    // console.log("this.userInput",this.userInput)
    // console.log(topicName)

  }



  exportAsExcel(topicName)
    {
      console.log("table",this.table)
      console.log("topicName",topicName)
      console.log("this.table.nativeElement",this.table.nativeElement)
      const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `${topicName}`);
      /* save to file */
      XLSX.writeFile(wb, `${topicName}.xlsx`);
    }

//   exportAsExcel(topicName, dataSource) {
//     const workSheet = XLSX.utils.json_to_sheet(dataSource, {header:['dataprop1', 'dataprop2']});
//     const workBook: XLSX.WorkBook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
//     XLSX.writeFile(workBook, 'filename.xlsx');
// }

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



@Component({
  selector: 'PageLoadDialog',
  templateUrl: 'PageLoadDialog.html',
})
export class PageLoadDialog {

  constructor(
    public dialogRef: MatDialogRef<PageLoadDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}