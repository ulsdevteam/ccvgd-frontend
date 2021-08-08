export interface Category {
  name: string;
  childCategories?: Category[];
}

export interface CheckBox {
  name: string,
  selected: boolean,
  subCheckBox?: CheckBox[]
}
