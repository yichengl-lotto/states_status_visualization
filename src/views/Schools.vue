<template>
  <div class="schools">
    <div class="box">
      <div id="map" style="width: 500px; height: 500px"></div>
      <div id="uniInfo" style="width: 500px; height: 500px"></div>
    </div>
    <div class="box">
      <div class="compare">
        <p>select two state to compare</p>
        <p>{{ state[state.length - 1] }}</p>
        <p>{{ state[1] ? state[0] : "" }}</p>
        <button @click="compare">compare</button>
      </div>
      <div id="pie" style="width: 500px; height: 500px"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Schools",
  data() {
    return {
      mapData: require("@/assets/us.json"),
      universityData: require("@/assets/university.json"),
      // university infor
      universityInfo: {},
      // # of university
      mapUniversity: [],
      // chosen university
      chooseUni: [],
      // compare or not
      isCompare: false,
      // compare states
      state: [],
      // pie
      pieData: [],
    };
  },
  mounted() {
    this.setUniversityData();
    this.drawMap();
    this.drawPie();
  },
  methods: {
    drawMap() {
      let echarts = this.$echarts;
      let map = echarts.init(document.getElementById("map"));
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
        "Puerto Rico": {
          // Puerto Rico
          left: -76,
          top: 26,
          width: 2,
        },
      });
      let option = {
        title: {
          text: "USA",
          left: "right",
        },
        tooltip: {
          trigger: "item",
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: function (params) {
            var value = (params.value + "").split(".");
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,");
            return params.seriesName + "<br/>" + params.name + ": " + value;
          },
        },
        visualMap: {
          left: "right",
          min: 1,
          max: 25,
          inRange: {
            color: [
              "#313695",
              "#4575b4",
              "#74add1",
              "#abd9e9",
              "#e0f3f8",
              "#ffffbf",
              "#fee090",
              "#fdae61",
              "#f46d43",
              "#d73027",
              "#a50026",
            ],
          },
          text: ["High", "Low"], 
          calculable: true,
        },
        toolbox: {
          show: true,
          left: "left",
          top: "top",
        },
        series: [
          {
            name: "Number of Universities",
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
            data: this.mapUniversity,
          },
        ],
      };
      map.setOption(option);
      map.on("click", (params) => {
        console.log(params);
        this.state.push(params.data.name);
        this.pieData.push({
          value: params.data.list.length,
          name: params.data.name,
        });
        if (params.data.list) {
          this.chooseUni.push(params.data.list);
        } else {
          this.chooseUni.push([]);
        }
        if (this.chooseUni.length > 2) {
          this.chooseUni = this.chooseUni.filter((value, index) => {
            return index != 0;
          });
          this.state = this.state.filter((value, index) => {
            return index != 0;
          });
          this.pieData = this.pieData.filter((value, index) => {
            return index != 0;
          });
        }
        console.log(this.chooseUni);
        this.isCompare = false;
        this.drawUniInfo();
      });
    },
    setUniversityData() {
      this.universityInfo = this.groupBy(this.universityData, function (item) {
        return item[5];
      });
      this.mapData.features.forEach((item) => {
        this.mapUniversity.push({
          name: item.properties.name,
          value: this.universityInfo[item.properties.name]
            ? this.universityInfo[item.properties.name].length
            : 0,
          list: this.universityInfo[item.properties.name],
        });
      });
    },
    // classify according to state
    groupBy(array, f) {
      const groups = {};
      array.forEach(function (o) {
        const group = JSON.stringify(f(o)).substring(
          1,
          JSON.stringify(f(o)).length - 1
        );
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return groups;
      // return Object.keys(groups).map(function (group) {
      //   return { group: groups[group] };
      // });
    },
    drawUniInfo() {
      let data1 = [];
      if (this.chooseUni[this.chooseUni.length - 1].length > 0) {
        data1 = this.chooseUni[this.chooseUni.length - 1].map((item) => {
          return [item[6], item[7], item[3], item[8], item[5]];
        });
      }
      let data2 = [];
      if (this.chooseUni[1] && this.chooseUni[0].length > 0 && this.isCompare) {
        data2 = this.chooseUni[0].map((item) => {
          return [item[6], item[7], item[3], item[8], item[5]];
        });
      }

      let uniInfo = this.$echarts.init(document.getElementById("uniInfo"));
      let option = {
        title: {
          text: "Compare",
        },
        xAxis: {
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          scale: true,
        },
        tooltip: {
          padding: 10,
          backgroundColor: "#222",
          borderColor: "#777",
          borderWidth: 1,
          formatter: function (param) {
            return `<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">
              ${param.data[2]}
              </div>
              Tuition:${param.data[0]}<br>
              Enrollment:${param.data[1]}
              `;
          },
        },
        series: [
          {
            data: data1,
            type: "scatter",
            symbolSize: 20,
            /* emphasis: {
              label: {
                show: true,
                formatter: function (param) {
                  return param.data[2];
                },
                position: "top",
              },
            }, */
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(120, 36, 50, 0.5)",
              shadowOffsetY: 5,
              color: new this.$echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                {
                  offset: 0,
                  color: "rgb(251, 118, 123)",
                },
                {
                  offset: 1,
                  color: "rgb(204, 46, 72)",
                },
              ]),
            },
          },
          {
            data: data2,
            type: "scatter",
            symbolSize: 20,
            /* emphasis: {
              label: {
                show: true,
                formatter: function (param) {
                  return param.data[2];
                },
                position: "top",
              },
            }, */
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(25, 100, 150, 0.5)",
              shadowOffsetY: 5,
              color: new this.$echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                {
                  offset: 0,
                  color: "rgb(129, 227, 238)",
                },
                {
                  offset: 1,
                  color: "rgb(25, 183, 207)",
                },
              ]),
            },
          },
        ],
      };
      uniInfo.setOption(option);
      uniInfo.on("click", (params) => {
        console.log(params);
        location.href = params.data[3];
      });
    },
    compare() {
      this.isCompare = true;
      this.drawUniInfo();
      this.drawPie();
    },
    drawPie() {
      let pie = this.$echarts.init(document.getElementById("pie"));
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: this.pieData,
        },
        series: [
          {
            name: "Pie Chart",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.pieData,
          },
        ],
      };
      pie.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  display: flex;
  & > div {
    border: 1px solid #ccc;
    margin: 5px;
    border-radius: 10px;
    flex: 1;
  }
  & > .compare {
    width: 500px;
  }
}
</style>