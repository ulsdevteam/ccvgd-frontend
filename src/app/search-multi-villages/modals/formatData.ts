export interface Category {
  name: string;
  childCategories?: Category[];
}

export interface CheckList {
  village_id: any,
  village_name: any,
  province: any,
  city: any,
  county: any,
  isSelected: boolean
}

export interface PostDataToSearch {
  villageid: any,
  topic:any,
  year?:any,
  year_range?:any
}
