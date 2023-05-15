const mapMainCategoryToSubCategoryConfig = {
    "自然环境": {data: [], target:"村庄基本信息", field:"自然环境"},
    "村志基本信息": {data: [], target:"村庄基本信息", field:"村志基本信息"},
    "自然灾害":{data: [], target:"村庄基本信息",field:"自然灾害" },
    "姓氏": {data: [], target:"村庄基本信息", field:"姓氏"},
    "第一次拥有或购买年份": {data: [], target:"村庄基本信息", field:"第一次拥有或购买年份"},
    "民族": {data: [], target:"村庄基本信息", field:"民族"},
    "教育":  {data: [], target:"村庄基本信息", field:"教育"},
    "计划生育": {data: [], target:"人口", field: "计划生育"},
};
const mapOldMainCategoryToItsSubCategory = {
    '计划生育' : "familyplanning",
};
const middleTabsMap = new Map([
    ["村庄基本信息", "village"],
    ["村志基本信息", "gazetteerinformation"],
    ["自然环境", "naturalenvironment"],
    ["自然灾害", "naturaldisasters"],
    ["姓氏", "fourthlastNames"],
    ["第一次拥有或购买年份", "firstavailabilityorpurchase"],
    ["民族", "ethnicgroups"],
    ["人口", "population"],
    ["军事政治", "military"],
    ["经济原始数据", "economy"],
    ["统一单位经济", "economyunity"],
    ["计划生育", "familyplanning"],
    ["教育", "education"]
]);

export default {middleTabsMap, mapMainCategoryToSubCategoryConfig};