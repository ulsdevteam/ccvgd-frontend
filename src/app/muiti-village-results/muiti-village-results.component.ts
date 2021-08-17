import { MatTableDataSource } from "@angular/material/table";
import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { MultiVillageFilterService } from "../services/multi-village-filter.service";
import { MatPaginator } from "@angular/material/paginator";
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
  // @ViewChild("economyPaginator3") economyPaginator3: MatPaginator;
  @ViewChild("firstPaginator") firstPaginator: MatPaginator;
  @ViewChild("secondPaginator") secondPaginator: MatPaginator;
  @ViewChild("economyPaginator3") economyPaginator3: MatPaginator;
  @ViewChild("populationPaginator4") populationPaginator4: MatPaginator;
  @ViewChild("militaryPaginator") militaryPaginator: MatPaginator;
  @ViewChild("dataSource6Paginator") dataSource6Paginator: MatPaginator;
  @ViewChild("dataSource7Paginator") dataSource7Paginator: MatPaginator;
  @ViewChild("dataSource8Paginator") dataSource8Paginator: MatPaginator;
  @ViewChild("dataSource9Paginator") dataSource9Paginator: MatPaginator;
  @ViewChild("dataSource10Paginator") dataSource10Paginator: MatPaginator;
  @ViewChild("dataSource11Paginator") dataSource11Paginator: MatPaginator
  @ViewChild("dataSource12Paginator") dataSource12Paginator: MatPaginator;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  userInput: any = {};
  getAllResponses: any = {};

  dataSource1;
  dataSource;
  dataSource2;
  dataSource3;
  dataSource4;
  dataSource5;
  dataSource6;
  dataSource7;
  dataSource8;
  dataSource9;
  dataSource10;
  dataSource11;
  dataSource12;


  dataSourceMap = new Map();

  //
  displayedColumns1: string[] = []
  displayedColumns2: string[] = []
  displayedColumns3: string[] = []
  displayedColumns4: string[] = []
  displayedColumns5: string[] = []
  displayedColumns6: string[] = []
  displayedColumns7: string[] = []
  displayedColumns8: string[] = []
  displayedColumns9: string[] = []
  displayedColumns10: string[] = []
  displayedColumns11: string[] = []
  displayedColumns12: string[] = []


  constructor(private multiVillageFilterService: MultiVillageFilterService) {
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

    this.multiVillageFilterService
      .onPostMultiVillages(this.userInput)
      .then((results) => {
        console.log("total result", results);

        this.displayedColumns1  = this.removeGazetteerId(results[0].field);
        this.displayedColumns2  = this.removeGazetteerId(results[1].field);
        this.displayedColumns3  = this.removeGazetteerId(results[2].field);
        this.displayedColumns4  = this.removeGazetteerId(results[3].field[0]);
        this.displayedColumns5  = this.removeGazetteerId(results[4].field);
        this.displayedColumns6  = this.removeGazetteerId(results[5].field);
        this.displayedColumns7  = this.removeGazetteerId(results[6].field);
        this.displayedColumns8  = this.removeGazetteerId(results[7].field);
        this.displayedColumns9  = this.removeGazetteerId(results[8].field);
        this.displayedColumns10  = this.removeGazetteerId(results[9].field);
        this.displayedColumns11  = this.removeGazetteerId(results[10].field);
        this.displayedColumns12  = this.removeGazetteerId(results[11].field);

        this.dataSource1 = new MatTableDataSource(results[0].data);
        this.dataSource2 = new MatTableDataSource(results[1].data);
        this.dataSource3 = new MatTableDataSource(results[2].data);
        this.dataSource4 = new MatTableDataSource(results[3].data);
        this.dataSource5 = new MatTableDataSource(results[4].data);
        this.dataSource6 = new MatTableDataSource(results[5].data);
        this.dataSource7 = new MatTableDataSource(results[6].data);
        this.dataSource8 = new MatTableDataSource(results[7].data);
        this.dataSource9 = new MatTableDataSource(results[8].data);
        this.dataSource10 = new MatTableDataSource(results[9].data);
        this.dataSource11 = new MatTableDataSource(results[10].data);
        this.dataSource12 = new MatTableDataSource(results[11].data);



        //BUG
        this.dataSource1.paginator = this.firstPaginator;
        this.dataSource2.paginator = this.secondPaginator;
        this.dataSource3.paginator = this.economyPaginator3;
        this.dataSource4.paginator = this.populationPaginator4;
        this.dataSource5.paginator = this.militaryPaginator;
        this.dataSource6.paginator = this.dataSource6Paginator;
        this.dataSource7.paginator = this.dataSource7Paginator;
        this.dataSource8.paginator = this.dataSource8Paginator;
        this.dataSource9.paginator = this.dataSource9Paginator;
        this.dataSource10.paginator = this.dataSource10Paginator;
        this.dataSource11.paginator = this.dataSource11Paginator;
        this.dataSource12.paginator = this.dataSource12Paginator;
      });
  }



  //for advance filter functions input
  filterDataSource1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
    if (this.dataSource1.paginator) this.dataSource1.paginator.firstPage();
  }

  filterDataSource2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    if (this.dataSource2.paginator) this.dataSource2.paginator.firstPage();
  }

  filterDataSource3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
    if (this.dataSource3.paginator) this.dataSource3.paginator.firstPage();
  }

  filterDataSource4(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource4.filter = filterValue.trim().toLowerCase();
    if (this.dataSource4.paginator) this.dataSource4.paginator.firstPage();
  }

  filterDataSource5(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource5.filter = filterValue.trim().toLowerCase();
    if (this.dataSource5.paginator) this.dataSource5.paginator.firstPage();
  }
}
