
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'villagesearch'
})
export class VillagesearchPipe implements PipeTransform {

  transform(items: Array<any>, provinceSearch: string, citySearch: string, countySearch: string, villageSearch: string){

    // console.log("items", items);
    // // console.log(provinceSearch);

    if(items && items!= undefined) {
      console.log(typeof items);
      return Object.values(items).filter(item => {
        // console.log(provinceName.city);
        const villageName = item.name;
        const province = item.province;
        const city = item.city;
        const county = item.county;

        console.log(`${villageName} ${province} ${city} ${county}`);
        console.log(province);
        if(provinceSearch && province.indexOf(provinceSearch) === -1) {
          return false;
        }
        if(citySearch && city.indexOf(citySearch) === -1) {
          return false;
        }
        if(countySearch && county.indexOf(countySearch) === -1) {
          return false;
        }
        if(villageSearch && villageName.indexOf(villageSearch) === -1) {
          return false;
        }

        return true;
      })

      // console.log("items", Object.entries(items));
      // return items.filter(provinceName => {
      //   // console.log(provinceSearch);
      //   console.log(typeof provinceSearch);
      //   // provinceName.indexOf(provinceSearch) === -1
      //   // if(provinceName && provinceName !== provinceSearch) {
      //   //   return false;
      //   // }
      //   // console.log(true);
      //   // return true;
      // })
    }
    else{
      console.log("no input");
      return items;
    }

  }
}
