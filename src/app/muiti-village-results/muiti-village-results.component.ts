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

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  userInput: any = {};
  getAllResponses: any = {};

  //TODO
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  //TODO change the name here
  displayedColumns1: string[] = [
    // 'gazetteerId',
    "gazetteerName",
    "villageId",
    "villageName",
    "province",
    "city",
    "county",
    "category1",
    "data",
    "unit",
  ];
  dataSource1;

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

  //TODO
  displayedColumns2: string[] = [
    "villageName",
    "gazetteerName",
    "publishYear",
    "publishType",
  ];
  dataSource2;

  dataSource;

  //TODO
  displayedColumns3: string[] = [
    "gazetteerName",
    "category1",
    "category2",
    "category3",
    "startYear",
    "endYear",
    "data",
    "unit",
  ];
  dataSource3;
  dataSource4;
  dataSource5;

  dataSourceMap = new Map();

  constructor(private multiVillageFilterService: MultiVillageFilterService) {}

  ngOnInit(): void {
    this.getData();
  }

  async getData() {
    //TODO POST TO MUCH
    // console.log('get it !', await this.multiVillageFilterService.getUserList);
    this.userInput = await this.multiVillageFilterService.getUserList;

    this.multiVillageFilterService
      .onPostMultiVillages(this.userInput)
      .then((results) => {
        // console.log("total result", results);

        this.dataSource1 = new MatTableDataSource(results[0].data);
        this.dataSource2 = new MatTableDataSource(results[1].data);
        this.dataSource3 = new MatTableDataSource(results[2].data);
        this.dataSource4 = new MatTableDataSource(results[3].data);
        this.dataSource5 = new MatTableDataSource(results[4].data);

        this.dataSource1.paginator = this.firstPaginator;
        this.dataSource2.paginator = this.secondPaginator;
        this.dataSource3.paginator = this.economyPaginator3;
        this.dataSource4.paginator = this.populationPaginator4;
        this.dataSource5.paginator = this.militaryPaginator;
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
