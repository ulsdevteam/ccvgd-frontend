import { MatTableDataSource } from "@angular/material/table";
import { Component, OnInit, ViewChild } from "@angular/core";
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
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

  //TODO
  displayedColumns2: string[] = [
    // 'villageId',
    "villageName",
    // 'gazetteerId',
    "gazetteerName",
    "publishYear",
    "publishType",
  ];
  dataSource2;

  //TODO
  displayedColumns3: string[] = [
    "gazetteerName",
    // 'gazetteerId',
    "category1",
    "category2",
    "category3",
    "startYear",
    "endYear",
    "data",
    "unit",
  ];
  dataSource3;

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

    console.log("userInput", this.userInput);
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
        // this.dataSource1.paginator = this.paginator;
        // this.dataSource2.paginator = this.paginator;
        this.dataSource3.paginator = this.paginator;
      });
  }
}
