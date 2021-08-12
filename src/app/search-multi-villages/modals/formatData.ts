export interface Category {
  category? : string
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


export interface Year {
  currentTopic: string,
  total_year_only?: [],
  total_year_range?: []
}