import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as echarts from 'echarts';
import { element } from 'protractor';
import { Village } from '../services/village-name.service';

@Component({
  selector: "app-muiti-village-results-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"],
})
export class Chart implements OnInit {

  localStorageData: any = {};
  chartData: any = [];
  data = [];

  population = [];
  man = [];
  woman = [];
  total = [];
  households = [];
  cultivatedArea = [];
  perCapitaIncome = [];
  births = [];
  deaths = [];
  birthRate = [];
  deathRate = [];

  totalShow = false;
  manShow = false;
  womanShow = false;
  householdsShow = false;
  birthsShow = false;
  deathsShow = false;
  birthRateShow = false;
  deathRateShow = false;
  cultivatedAreaShow = false;
  perCapitaIncomeShow = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // this.route.params.subscribe((params) => this.name = params.name);

    this.clearDate();

    this.localStorageData = JSON.parse(window.localStorage.getItem('chartGroupData'));

    this.chartData = this.sortData(JSON.parse(window.localStorage.getItem('chartData')));

    // console.log(this.localStorageData);
        
    // console.log(this.chartData);

    this.data = this.localStorageData.forEach(element => {
      if (element.name.includes("总人口 Total Population")) {
        this.filterItem(element.item, this.total);
        this.total = this.sortData(this.total);
        this.totalShow = true;
        this.createChart('total', "总人口 Total Population", "人数 Number of People", this.total);
      } else if (element.name.includes("男性人口 Male Population")) {
        this.filterItem(element.item, this.man);
        this.man = this.sortData(this.man);
        this.manShow = true;
        this.createChart('man', "男性人口 Male Population", "人数 Number of People", this.man);
      } else if (element.name.includes("女性人口 Female Population")) {
        this.filterItem(element.item, this.woman);
        this.woman = this.sortData(this.woman);
        this.womanShow = true;
        this.createChart('woman', "女性人口 Female Population", "人数 Number of People", this.woman);
      } else if (element.name.includes('户数 Number of Households')) {
        this.filterItem(element.item, this.households);
        this.households = this.sortData(this.households);
        this.householdsShow = true;
        this.createChart('households', "户数 Number of Households", "户数 Number of Households", this.households);
      } else if (element.name.includes('出生人数 Number of Births')) {
        this.filterItem(element.item, this.births);
        this.births = this.sortData(this.births);
        this.birthsShow = true;
        this.createChart('births', "出生人数 Number of Births", "人数 Number of People", this.births);
      } else if (element.name.includes('死亡人数 Number of Deaths')) {
        this.filterItem(element.item, this.deaths);
        this.deaths = this.sortData(this.deaths);
        this.deathsShow = true;
        this.createChart('deaths', "死亡人数 Number of Deaths", "人数 Number of People", this.deaths);
      } else if (element.name.includes('自然出生率 Birth Rate')) {
        this.filterItem(element.item, this.birthRate);
        this.birthRate = this.sortData(this.birthRate);
        this.birthRateShow = true;
        this.createChart('birthRate', "自然出生率 Birth Rate", "比率 Rate (%)", this.birthRate);
      } else if (element.name.includes('死亡率 Death Rate')) {
        this.filterItem(element.item, this.deathRate);
        this.deathRate = this.sortData(this.deathRate);
        this.deathRateShow = true;
        this.createChart('deathRate', "死亡率 Death Rate", "比率 Rate (%)", this.deathRate);
      } else if (element.name.includes('耕地面积 Cultivated Area')) {
        this.filterItem(element.item, this.cultivatedArea);
        this.cultivatedArea = this.sortData(this.cultivatedArea);
        this.cultivatedAreaShow = true;
        this.createChart('cultivatedArea', "耕地面积 Cultivated Area", "亩 mu", this.cultivatedArea);
      } else if (element.name.includes('人均收入 Per Capita Income')) {
        this.filterItem(element.item, this.perCapitaIncome);
        this.perCapitaIncome = this.sortData(this.perCapitaIncome);
        this.perCapitaIncomeShow = true;
        this.createChart('perCapitaIncome', "人均收入 Per Capita Income", "元 yuan", this.perCapitaIncome);
      }
    });
  }


  filterItem(source, result) {

    const map = new Map<string, Record<string, any>[]>();

    source.forEach(item => {
      if (map.has(item.gazetteerName) === false) {
        map.set(item.gazetteerName, [item]);
      }
      else if (map.has(item.gazetteerName) === true) {
        let temp = map.get(item.gazetteerName);
        temp.push(item);
        map.delete(item.gazetteerName);
        map.set(item.gazetteerName, temp);
      }
    });

    for (let [key, value] of map.entries()) {
      const name = key;
      const item = value;
      result.push({name, item});
    }
  }

  createChart(name, text, unit, sourceData) {
    // console.log(sourceData);
    let legend = [];
    sourceData.forEach(element => {
      legend.push(element.name);
    });
    // const xData: string[] = Array.from(new Set(this.chartData.map(item => item.startYear)));
    const xData: number[] = [];
    let index = 0;
    for (let i = 1949; i <= 2022; i++) {
      xData[index] = i;
      index++;
    }
    
    const config = {
      title: {
        text: text,
        top: '1%',
        left: 'center'
      },
      legend: {
        top: '10%',
        orient: 'vertical',
        right: 'right',
        data: legend
      },
      xAxis: [
        {
          name: 'year',
          data: xData
        }
      ],
      yAxis: [
        {
          name: unit,
          type: 'value'
        },
        // {
        //   name: "户数 Number of Households",
        //   type: 'value',
        // },
      ],
      series: sourceData.map(village => {
        const v = village.item;

        const data = new Array(xData.length).fill(null)
        
        v.forEach((element) => {
          data[Number(element.startYear)-Number(xData[0])] = element.data
        }) 

        // console.log('data',data);
        

        return {
          name: village.name,
          type: 'line',
          data: data
        }
      })
    }

    this.initChart(name, config);
  }

  clearDate() {
    this.population = [];
    this.man = [];
    this.woman = [];
    this.total = [];
    this.households = [];
    this.cultivatedArea = [];
    this.perCapitaIncome = [];
    this.births = [];
    this.deaths = [];
    this.birthRate = [];
    this.deathRate = [];
  }

  sortData(data: Record<string, any>[]) {
    return data.sort((a, b) => b.startYear - a.startYear < 0 ? 1 : -1 );
  }

  getMaxValue(data: Record<string, any>[]) {
    let maxValue = 0;
    data.forEach((item) => {
      if (item.data > maxValue) {
        maxValue = item.data;
      }
    })
    return maxValue;
  }

  initChart (name, chartConfig) {
    const { title, yAxis, xAxis, series, legend, visualMap } = chartConfig;
    const config = {
      title,
      tooltip: {
        trigger: 'axis'
      },
      legend,
      grid: {
        left: '10%',
        right: '18%',
        bottom: '10%'
      },
      xAxis,
      yAxis,
      toolbox: {
        right: 10,
        show: true,
        feature: {
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar', 'pie'] },
          restore: {},
          saveAsImage: {}
        }
      },
      dataZoom: [
        {
          start: 0,
          end: 100
        },
        {
          type: 'inside'
        }
      ],
      series,
      visualMap
    }

    const myChart = echarts.init(document.getElementById(name));

    myChart.setOption(config);
  }
}