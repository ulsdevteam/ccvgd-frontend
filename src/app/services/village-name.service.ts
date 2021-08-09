import { Injectable } from '@angular/core';
import { HttpServiceService } from './http-service.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VillageNameService {
  constructor(private httpService: HttpServiceService) {}

  // auto-complete dropdown: only retrieve 100 village
  async getVillages(): Promise<VillageNameDisplay> {
    //Village[]{
    return this.httpService.get('namesearch');
  }

  // async getMultiVillages(): Promise<BasicVillageInformation> {
  //   return this.httpService.post('ccvg/advancesearch');
  // }

  // village name filter: by user input into post request
  async filterVillages(searchName: string): Promise<VillageNameDisplay> {
    return this.httpService.post('namesearch', { namefilter: searchName });
  }
}

export interface VillageNameDisplay {
  data: Village[];
}

/* single village search autocomplete display format*/
export interface Village {
  isSelected: boolean /*ui: backend dont need*/;
  name: string;
  province: string;
  city: string;
  county: string;
  id: string;
}

export interface VillageSearchResult {
  tables: TableData[];
}

// both category and table-display-V2 use this one
interface Category {
  description: string; //风灾
  type: string; //wind
}

export interface TableData {
  tableNameChinese: string;
  columnsName: ColumnsFormat[];
  field: string[];
  data: any[];

  topic: string;
  id: any;
  tableIsEmpty?: boolean; // check if the table is empty
  // table-display-V2
  treeFilter?: any;
  // table-display-v22
  multiselectFilter?: any;
  // table-display-V23
  lastnameFilter?: any;
  // table-display
  filterFormGroupName?: string;
  filters?: Category[];

  // type: 'single-search' | 'multi-search'
}

export interface ColumnsFormat {
  columnsHeaderChinese: string;
  columnsDef: string;
  cell: any;
}

/*---------------------------------------------------------------------------------------*/
/* 13 Table format */
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

export interface BasicGazetteerInformation {
  villageId: string;
  villageName: string;
  gazetteerId: number;
  gazetteerName: string;
  publishYear: number;
  publishType: string;
}

export interface NaturalDisaster {
  gazetteerName: string;
  gazetteerId: number;
  year: number;
  category1: Category;
}

export interface NaturalEnvironment {
  gazetteerName: string;
  gazetteerId: number;
  category1: string;
  data: number;
  unit: string;
}

/*计划生育familyplanning, 民族ethnic*/
export interface OneLevelResult {
  gazetteerName: string;
  gazetteerId: number;
  category1: string;
  startYear: number;
  endYear: number;
  data: number;
  unit: string;
}

/*军事政治military, 人口population*/
export interface TwoLevelResult {
  gazetteerName: string;
  gazetteerId: number;
  category1: string;
  category2: string;
  startYear: number;
  endYear: number;
  data: number;
  unit: string;
}

/*教育education, 经济economy*/
export interface ThreeLevelResult {
  gazetteerName: string;
  gazetteerId: number;
  category1: string;
  category2: string;
  category3: string;
  startYear: number;
  endYear: number;
  data: number;
  unit: string;
}

export interface LastName {
  gazetteerName: string;
  gazetteerId: number;
  firstLastNameId: string;
  secondLastNameId: string;
  thirdLastNameId: string;
  fourthLastNameId: string;
  fifthLastNameId: string;
  totalNumberOfLastNameInVillage: number;
}

export interface FirstAvalabilityOrPurchase {
  gazetteerName: string;
  gazetteerId: number;
  category1: string;
  year: number;
}
