<template>
    <div class="expenses">
    <div class="box">
      <div id="drawmap" style="width: 500px; height: 500px"></div>
      <!-- <div id="barchart" style="width: 500px; height: 500px"></div>
       -->
       <div class="compare">
        <p>Please choose two states to make a comparison:</p>
        <b-col md="12" cols="4" class="my-2">
              <b-row align-v="center">
                <b-col
                  class="mb-2 selectState mx-auto"
                  ><p class="my-0">{{ choseState[choseState.length - 1] }}</p></b-col
                >
              </b-row>
              <b-row align-v="center">
                <b-col
                  class="mb-2 selectState mx-auto"
                  ><p class="my-0">{{ choseState[1] ? choseState[0] : "" }}</p></b-col
                >
              </b-row>
            </b-col>
            <!-- <b-col md="12" cols="4" class="my-2">
              <b-button variant="outline-info" class="mb-2">
      <b-icon icon="search" aria-hidden="true"></b-icon> Compare
            </b-button>
            </b-col> -->
        <b-button variant="outline-info" class="mb-2" @click="compare"><b-icon icon="search" aria-hidden="true"></b-icon> compare</b-button>
      </div>
    </div>
    <!-- <div class="box1">
        <div style="width: 500px; height: 30px"><p>{{ choseState[choseState.length - 1] }}</p></div>
        <div style="width: 500px; height: 30px"><p>{{ choseState[1] ? choseState[0] : "" }}</p></div>
    </div> -->
    <div class="row">
        <div class="column"><p>{{ choseState[choseState.length - 1] }}</p></div>
        <div class="column"><p>{{ choseState[1] ? choseState[0] : "" }}</p></div>
    </div>

    <div class="box">
     <div id="piechart1" style="width: 500px; height: 500px"></div>
      <div id="piechart2" style="width: 500px; height: 500px"></div>
      <!-- <div id="piechart1" style="width: 500px; height: 500px"></div> -->
    </div>
    <div class="box">
        <div id="barchart1" style="width: 500px; height: 500px"></div>
        <div id="barchart2" style="width: 500px; height: 500px"></div>
    </div>
  </div>
</template>>

<script>
import * as d3 from "d3";
import echarts from 'echarts';
import Vue from 'vue'

Vue.prototype.$echarts = echarts

export default {
    name: "Expense",
    data(){
      return {
      expenseData: require("@/assets/lifeExpense.json"),
      eduCostData: require("@/assets/education_expense.json"),
      mapData: require("@/assets/us.json"),
      lifeInfo:{},
      mapExpense: [],
      selected: [],
      isCompare: false,
      choseState: [],
      barData: [],
      pieData: [],
      data1: [],
      data2: [],
      lifeData: null,
      testdata: [{name: "a", value:80},//取绝对值
      {name: "b", value: 100},
          {name: "b", value: 200}],
    opinion: ['Grocery', 'Housing', 'Utilities', 'Transportation', 'Health', 'Misc.'], 
    // testnum : [1, 2, 3, 4, 5, 6],  
    };
    },
    methods: {
        
    usMap() {
        console.log(this.expenseData[0].value[0].value)
      let echarts = this.$echarts;
      let map = echarts.init(document.getElementById("drawmap"));
      echarts.registerMap("USA", this.mapData, {
        Alaska: {
          // Alaska
          left: -131,
          top: 25,
          width: 15,
        },
        Hawaii: {
          left: -110, // Hawaii
          top: 24,
          width: 5,
        },
      });
      let option = {
        title: {
          text: "USA Map",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: function (params) {
            console.log(params)
            var value = (params.value + "").split(".");
            // console.log(value)
            value = value.value;
            console.log(value)
            return params.seriesName + "<br/>" + params.name;
          },
        },
        toolbox: {
          show: true,
          left: "left",
          top: "top",
        },
        series: [
          {
            name: "USA Map",
            type: "map",
            roam: true,
            map: "USA",
            emphasis: {
              label: {
                show: true,
              },
            },
            
            textFixed: {
              Alaska: [20, -20],
            },
            data: this.expenseData,
          },
        ],
      };
      map.setOption(option);
      map.on("click", (params) => {
        console.log(params.data.name);
        this.choseState.push(params.data.name);
        this.barData.push(
          params.data.value
        );
    //     this.barData[0].farEach((item) =>
    //     this.data1.push(item.value)
    // )
        for(let key in this.barData[0]){
        this.data1.push(this.barData[0][key].value);
        }
        for(let key in this.barData[1]){
        this.data2.push(this.barData[1][key].value);
        }   

        // this.data1 = [1,2,3]
        // console.log(params.data1)
        // this.pieData.push({
        //   name: params.data1.name,
        //   value: params.data1.value,
        // });
        if (params.data.value) {
          this.selected.push(params.data.value);
        } else {
          this.selected.push([]);
        }
        this.selected.push()
        if (this.selected.length > 2) {
          this.selected = this.selected.filter((value, index) => {
            return index != 0;
          });
          this.choseState = this.choseState.filter((value, index) => {
            return index != 0;
          });
          this.barData = this.barData.filter((value, index) => {
            return index != 0;
          });
        }
        console.log(this.selected);
        this.isCompare = false;
        // this.drawUniInfo();
      });
    },
    compare(){
        this.isCompare = true;
        this.drawPie1('main');
        this.drawPie2('main');
        this.drawBar1();
        this.drawBar();
    },
    drawPie1 (id) {
          this.charts = this.$echarts.init(document.getElementById('piechart1'))
          this.charts.setOption({
            title: 
            {
              text: 'Life Expense PieChart Comparison',
              x: '15%',
              textAlign: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a}<br/>{b}:{c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              x: 'right',
              data: this.opinion
            },
            series: [
              {
                name: 'Life Expense Distribution',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                    testStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: this.barData[0]
              }
            ]
          })
        },
    drawPie2 (id) {
          this.charts = this.$echarts.init(document.getElementById('piechart2'))
          this.charts.setOption({
            tooltip: {
              trigger: 'item',
              formatter: '{a}<br/>{b}:{c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              data: this.opinion
            },
            series: [
              {
                name: 'Pie Chart',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                    testStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: this.barData[1]
              }
            ]
          })
        },
    drawBar1() {
      let histogramChart = echarts.init(document.getElementById('barchart1'))
        histogramChart.setOption({
          title: 
            {
              text: 'Life Expense BarChart Comparison',
              x: '15%',
              textAlign: 'center'
            },
          grid: {
            top: '80',
            width: '100%',
            bottom: '5%',
            left: 20,
            right: 0,
            containLabel: true
          },
          xAxis: 
            {
              type: 'category',
              name: 'Category',
              axisTick: {
                inside: true
              },
              splitLine: {
                show: true
              },
              data: this.opinion
            },
          yAxis: 
            {
              type: 'value',
              name: 'Expense Index',
              scale: true,
              axisTick: {
                inside: true
              }
            },
          series: 
            {
              type: 'bar',
              barWidth: '10%',
              data: this.data1,
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: 'right'
                  }
                }
              }
            }
        })
      },

  drawBar() {
      let histogramChart = echarts.init(document.getElementById('barchart2'))
        histogramChart.setOption({
          grid: {
            top: '80',
            width: '100%',
            bottom: '5%',
            left: 20,
            right: 0,
            containLabel: true
          },
          xAxis: 
            {
              type: 'category',
              name: 'Category',
              axisTick: {
                inside: true
              },
              splitLine: {
                show: true
              },
              data: this.opinion
            },
          yAxis: 
            {
              type: 'value',
              name: 'Expense Index',
              scale: true,
              axisTick: {
                inside: true
              }
            },
          series: 
            {
              type: 'bar',
              barWidth: '10%',
              data: this.data2,
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: 'right'
                  }
                }
              }
            }
        })
      }},
  mounted: function () {
    console.log('mounted');
    this.usMap();
    this.drawPie1('main');
    this.drawPie2('main');
    this.drawBar1();
    this.drawBar();
  }
}

</script>

<style lang="less" scoped>
.box {
  display: flex;
  & > div {
    border: 1px solid rgb(155, 145, 145);
    margin: 5px;
    border-radius: 10px;
    flex: 1;
    background-color: white;
  }
  & > .compare {
    width: 500px;
  }
}

.selectState:hover {
  background-color: #8b9add;
}

.selectState {
  max-width: 80%;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #8b9add;
  border-radius: 1rem;
}
.column {
//   margin-top: 10px;
  float: left;
  width: 50%;
  justify-content: center;
  align-items: center;
  font-family: 'Franklin Gothic Medium', Arial, sans-serif;
  font-size: 25px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>