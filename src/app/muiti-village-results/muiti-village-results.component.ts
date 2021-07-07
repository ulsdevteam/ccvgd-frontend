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
    ["第一次购买或拥有年份", "firstavailabilityorpurchase"],
    ["人口", "population"],
    ["军事政治", "military"],
    ["经济", "economy"],
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
    // this.multiVillageFilterService.getUserList.then((result) => {
    //   console.log('result!!', result);
    // });

    this.getData();
  }

  async getData() {
    // console.log('get it !', await this.multiVillageFilterService.getUserList);
    this.userInput = await this.multiVillageFilterService.getUserList;

    console.log("userInput", this.userInput.topic);

    console.log(
      "this is the searchResult from service 🙄",
      await this.multiVillageFilterService.onPostMultiVillages(this.userInput)
    );

    this.multiVillageFilterService
      .onPostMultiVillages(this.userInput)
      .then((results) => {
        console.log("total result", results);
        // console.log('result data', results[3].data);

        this.dataSource1 = new MatTableDataSource(results[0].data);
        this.dataSource2 = new MatTableDataSource(results[1].data);
        this.dataSource3 = new MatTableDataSource(results[2].data);
        this.dataSource4 = new MatTableDataSource(results[3].data);
        this.dataSource5 = new MatTableDataSource(results[4].data);
        // this.dataSource1.paginator = this.paginator;
        // this.dataSource2.paginator = this.paginator;

        // for (let i = 2; i < Object.keys(results).length; i++) {
        //   this.dataSourceMap.set(
        //     results[i].tableNameChinese,
        //     new MatTableDataSource(results[i].data)
        //   );

        //   this.dataSource = new MatTableDataSource(results[i].data);
        //   this.dataSource.paginator = this.paginator;
        // }

        this.dataSource1.paginator = this.firstPaginator;
        this.dataSource2.paginator = this.secondPaginator;
        this.dataSource3.paginator = this.economyPaginator3;
        this.dataSource4.paginator = this.populationPaginator4;
        this.dataSource5.paginator = this.militaryPaginator;
      });
  }
}
