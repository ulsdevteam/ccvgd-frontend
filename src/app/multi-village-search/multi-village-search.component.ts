import { Component, OnInit } from '@angular/core';
import {Village, VillageNameService} from '../services/village-name.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ProvinceCityCountyService}from '../services/province-city-county.service';

@Component({
  selector: 'app-multi-village-search',
  templateUrl: './multi-village-search.component.html',
  styleUrls: ['./multi-village-search.component.css']
})
export class MultiVillageSearchComponent implements OnInit {
  options: any[];
  displayedColumns: string[] = ['checked','name', 'province', 'city', 'county'];

  all: Array<Object>;
  provinceList: string[];

  constructor(private villageService: VillageNameService,
              private provinceCityCountyService: ProvinceCityCountyService) {
    this.options = [
      {checked: false, name: '太平店村', province: '河南省', city: '许昌市', county: '长葛市'},
      {checked: false, name: '太各庄村', province: '河北省', city: '唐山市', county: '丰南区'},
      {checked: false, name: '桑耳庄村', province: '河南省', city: '安阳市', county: '林州区'},
      {checked: false, name: '大吕庄村', province: '河南省', city: '安阳市', county: '滑县'},
      {checked: false, name: '叶店村', province: '湖北省', city: '武汉市', county: '黄陂区'},
      {checked: false, name: '云水村', province: '河南省', city: '焦作市', county: '孟州市'},
      {checked: false, name: '盘山村', province: '河南省', city: '安阳市', county: '林州市'},
      {checked: false, name: '百泉村', province: '河南省', city: '新乡市', county: '辉县市'},
      {checked: false, name: '北陈村', province: '河南省', city: '洛阳市', county: '吉利区'},

    ];

    this.provinceList = this.provinceCityCountyService.getAll();

  }

  ngOnInit(): void {
  }


}
