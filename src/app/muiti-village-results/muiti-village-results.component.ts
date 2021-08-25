import { MatTableDataSource } from "@angular/material/table";
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MultiVillageFilterService } from "../services/multi-village-filter.service";
import { MatPaginator } from "@angular/material/paginator";
import { Router } from "@angular/router";
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


  constructor(private multiVillageFilterService: MultiVillageFilterService,private router: Router) {
    console.log("call again")
    // this.userInput = localStorage.getItem("userInput");
    // this.getData();
  }

  ngOnInit(): void {
    this.getData();
  }

  removeGazetteerId(rawArray) {
    let resultsDisplay = [];
    for(let item in rawArray) {
      if(rawArray[item] !== "gazetteerId") {
        resultsDisplay.push(rawArray[item]);
      }
    }
    return resultsDisplay;
  }

  

  async getData() {
    //TODO POST TO MUCH
    // console.log('get it !', await this.multiVillageFilterService.getUserList);
    this.userInput = await this.multiVillageFilterService.getUserList;
    localStorage.setItem("userInput", this.userInput);


    this.searchResultData  = await this.multiVillageFilterService.onPostMultiVillages(this.userInput);

    if(this.searchResultData.code === 4001) {
      this.router.navigate(["/multi-village-search"]);
    }
  
        for(let index in this.searchResultData) {
          // this.searchResultData[index]
          console.log(this.searchResultData[index]);
          this.dataSource = this.searchResultData[index].data;
          this.displayResultsData.push({
            topicName: this.searchResultData[index].tableNameChinese,
            dataSource: new MatTableDataSource(this.searchResultData[index].data),
            displayedColumns: this.searchResultData[index].field,
          })
        
        }
        this.mainPaginator.changes.subscribe(a => a.forEach((b, index) => 
        this.displayResultsData[index].dataSource.paginator = b));
  }

  
    filterDataSource(event: Event, currentDataSource) {
    const filterValue = (event.target as HTMLInputElement).value;
    currentDataSource.filter = filterValue.trim().toLowerCase();
    if (currentDataSource.paginator) currentDataSource.paginator.firstPage();
  }

}
