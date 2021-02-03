<template>
  <div class="industryPage">
    <b-container fluid>
      <b-row>
        <b-col>
          <b-dropdown
            :text="'Filter By Year: ' + year"
            size="sm"
            id="yearFilter"
            class="m-2"
          >
            <b-dropdown-item id="2015" v-on:click="selectByYear"
              >2015</b-dropdown-item
            >
            <b-dropdown-item id="2016" v-on:click="selectByYear"
              >2016</b-dropdown-item
            >
            <b-dropdown-item id="2017" v-on:click="selectByYear"
              >2017</b-dropdown-item
            >
            <b-dropdown-item id="2018" v-on:click="selectByYear"
              >2018</b-dropdown-item
            >
            <b-dropdown-item id="2019" v-on:click="selectByYear"
              >2019</b-dropdown-item
            >
          </b-dropdown>
        </b-col>
        <b-col md="8" style="display: flex">
          <ul class="sexFilter mx-auto">
            <li>
              <input
                type="radio"
                name="selectSexFilter"
                v-on:click="selectBySex"
                id="all"
                checked
              />
              <label for="all"> All</label>
            </li>
            <li>
              <input
                type="radio"
                name="selectSexFilter"
                v-on:click="selectBySex"
                id="male"
              />
              <label for="male">Male</label>
            </li>
            <li>
              <input
                type="radio"
                name="selectSexFilter"
                v-on:click="selectBySex"
                id="female"
              />
              <label for="female"> Female</label>
            </li>
          </ul>
        </b-col>
        <b-col></b-col>
      </b-row>
      <b-row>
        <b-col style="display: flex; flex-wrap: wrap" class="part">
          <b-row align-v="center">
            <b-col class="mapDescription">
              <h3>Dominant Industry Map</h3>
              <p>
                The Map is colored to present the Dominant Industry of each
                state.
              </p>
              <p>Mouseover the State to get the detail information.</p>
              <cite style="font-size: 10px"
                >&#8212; Dominant Industry: Industry has the most employed
                workers.</cite
              >
            </b-col>
          </b-row>

          <b-row class="selectCompare">
            <b-col md="12" cols="4" class="my-2"
              ><h4>Select Two States to Compare</h4></b-col
            >
            <b-col md="12" cols="4" class="my-2">
              <b-row align-v="center" align-h="center">
                <b-col
                  v-bind:class="{ active: isActive1 }"
                  class="mb-2 selectState mx-auto"
                  v-on:click="selectModified = 0"
                  ><p class="my-0">{{ selectionToState1 }}</p></b-col
                >
              </b-row>
              <b-row align-v="center">
                <b-col
                  v-bind:class="{ active: isActive2 }"
                  class="mb-2 selectState mx-auto"
                  v-on:click="selectModified = 1"
                  ><p class="my-0">{{ selectionToState2 }}</p></b-col
                >
              </b-row>
            </b-col>
            <b-col md="12" cols="4" class="my-2">
              <b-button
                v-bind:disabled="comparable"
                pill
                variant="outline-secondary"
                v-on:click="compareState"
                >Compare</b-button
              >
            </b-col>
          </b-row>
        </b-col>
        <b-col class="part" lg="8" md="8"><svg id="chart"></svg></b-col>
      </b-row>
      <b-row v-bind:style="showVisualization">
        <b-col>
          <b-row align-v="stretch">
            <b-col class="part">
              <div>
                <p>
                  Compare Median Income of Two States by Industries for
                  {{ sex }}
                </p>
                <svg id="incomeCompare"></svg>
              </div>
            </b-col>
            <b-col class="part">
              <div>
                <div style="display: flex; align-items: center">
                  <b-dropdown
                    :text="'Filter By State: ' + selectionToState"
                    size="sm"
                    id="yearFilter"
                    class="m-2"
                  >
                    <b-dropdown-item
                      :id="selection_1"
                      v-on:click="selectForLine"
                      >{{ selectionToState1 }}</b-dropdown-item
                    >
                    <b-dropdown-item
                      :id="selection_2"
                      v-on:click="selectForLine"
                      >{{ selectionToState2 }}</b-dropdown-item
                    >
                  </b-dropdown>
                  Job Distribution Changes Over Year
                </div>

                <svg id="changeOverYear"></svg>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="part">
              <b-row align-v="center">
                <b-col align-v="center" cols="12" sm="4">
                  <div id="pieLegend" class="mx-auto">
                    <h4>Industry Distribution</h4>
                  </div>
                </b-col>
                <b-col align-v="center" cols="12" sm="4">
                  <svg id="industryPie"></svg>
                </b-col>
                <b-col align-v="center" cols="12" sm="4">
                  <svg id="industryPie2"></svg>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson";

export default {
  name: "Home",
  data: function () {
    return {
      year: "2019",
      sex: "all",
      us: null,
      color: null,
      path: null,
      industryData: null,
      svg: null,
      selection_1: "",
      selection_2: "",
      selectModified: 0,
      isActive1: true,
      isActive2: false,
      svgExist: false,
      pathPie: null,
      lineChartSelect: null,
      whole: true,
    };
  },
  computed: {
    showVisualization: function () {
      return { visibility: this.svgExist ? "visible" : "hidden" };
    },
    comparable: function () {
      if (this.selection_1 != "" && this.selection_2 != "") {
        return false;
      } else {
        return true;
      }
    },
    selectionToState: function () {
      if (this.lineChartSelect) {
        return this.industryData[this.sex][this.lineChartSelect][this.year]
          .state;
      } else {
        return "";
      }
    },
    selectionToState1: function () {
      if (this.selection_1 != "") {
        return this.industryData[this.sex][this.selection_1][this.year].state;
      } else {
        return "";
      }
    },
    selectionToState2: function () {
      if (this.selection_2 != "") {
        return this.industryData[this.sex][this.selection_2][this.year].state;
      } else {
        return "";
      }
    },
  },
  watch: {
    sex: function () {
      this.updateMap();
      if (this.svgExist) {
        this.updateCompareChart();
        this.updateChangeOverYear();
      }
    },
    year: function () {
      this.updateMap();
      if (this.svgExist) {
        this.updateCompareChart();
        this.updateChangeOverYear();
      }
    },
    selectModified: function (val) {
      if (val == 0) {
        this.isActive1 = true;
        this.isActive2 = false;
      } else {
        this.isActive1 = false;
        this.isActive2 = true;
      }
    },
    lineChartSelect: function (val, oldVal) {
      if (oldVal != null && val != oldVal) {
        this.updateChangeOverYear();
      }
    },
  },
  methods: {
    selectForLine: function (d) {
      this.lineChartSelect = d.target.id;
    },
    selectByYear: function (d) {
      this.year = d.target.id;
    },
    selectBySex: function (d) {
      this.sex = d.target.id;
    },
    getDominantIndustry: function (d) {
      if (this.$store.state.idToState[d.id]) {
        d.properties.abbr = this.$store.state.idToState[d.id].abbr;
        d.properties.name = this.$store.state.idToState[d.id].name;
      } else {
        console.log(d.id);
      }
      if (
        this.industryData.all[d.id] &&
        this.industryData[this.sex][d.id][this.year]
      ) {
        d.properties.dominant = Object.entries(
          this.industryData[this.sex][d.id][this.year]["industries"]
        )
          .filter((d) => d[0] != "Health care and social assistance")
          .sort((a, b) => d3.descending(a[1], b[1]))[0][0];
        return this.color(d.properties.dominant);
      } else {
        return "white";
      }
    },
    select: function (d) {
      if (d.id != this.selection_1 && d.id != this.selection_2) {
        if (this.selectModified == 0) {
          this.selection_1 = d.id;
        } else {
          this.selection_2 = d.id;
        }
        this.selectModified = (this.selectModified + 1) % 2;
      }
    },
    updateMap: function () {
      this.svg
        .selectAll(".states")
        .attr("fill", this.getDominantIndustry)
        .select("title")
        .text((d) => d.properties.dominant);
    },
    drawCompareChart: function () {
      this.lineChartSelect = this.selection_1;
      var data1 = this.industryIncome[this.sex][this.selection_1][this.year];
      var data2 = this.industryIncome[this.sex][this.selection_2][this.year];
      var industries = Object.keys(
        this.industryIncome[this.sex][this.selection_1][this.year].industries
      );
      var margin = { top: 50, right: 30, bottom: 50, left: 70 };
      var width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
      var svg = d3
        .select("#incomeCompare")
        .attr("viewBox", [
          0,
          0,
          width + margin.right + margin.left,
          height + margin.top + margin.bottom,
        ]);
      svg = svg
        .append("g")
        .attr("transform", " translate(" + margin.left + " " + margin.top + ")")
        .attr("viewbox", [0, 0, width, height]);

      var x = d3
        .scaleBand()
        .domain(industries)
        .range([0, width])
        .paddingInner(0.2)
        .paddingOuter(0.1);

      var y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(
            Object.values(data1.industries).concat(
              Object.values(data2.industries)
            )
          ),
        ])
        .range([height, 0])
        .nice();

      svg
        .append("g")
        .selectAll(".selection1")
        .data(Object.entries(data1.industries), (d) => d[0])
        .enter()
        .append("rect")
        .classed("selection1", true)
        .attr("x", (d) => x(d[0]))
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => height - y(d[1]))
        .attr("width", (x.bandwidth() / 2) * 0.9)
        .attr("fill", "#FC766AFF")
        .on("mouseover", function () {
          d3.select(this).attr(
            "fill",
            d3.rgb(d3.select(this).attr("fill")).darker()
          );
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "#FC766AFF");
        })
        .append("title")
        .text((d) => d[0] + ": " + d3.format("$")(d[1]));
      svg
        .append("g")
        .selectAll(".selection2")
        .data(Object.entries(data2.industries), (d) => d[0])
        .enter()
        .append("rect")
        .classed("selection2", true)
        .attr("x", (d) => x(d[0]) + x.bandwidth() / 2)
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => height - y(d[1]))
        .attr("width", (x.bandwidth() / 2) * 0.9)
        .attr("fill", "#5B84B1FF")
        .on("mouseover", function () {
          d3.select(this).attr(
            "fill",
            d3.rgb(d3.select(this).attr("fill")).darker()
          );
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "#5B84B1FF");
        })
        .append("title")
        .text((d) => d[0] + ": " + d3.format("$")(d[1]));

      var legendWidth = 20;
      var legend = svg
        .selectAll(".legendBar")
        .data([this.selection_1, this.selection_2])
        .enter()
        .append("g");
      legend
        .append("rect")
        .attr("x", width - 100)
        .attr("y", (_, i) => {
          return (legendWidth + 5) * i + 10;
        })
        .attr("width", legendWidth)
        .attr("height", legendWidth)
        .attr("fill", (_, i) => (i == 0 ? "#FC766AFF" : "#5B84B1FF"));
      legend
        .append("text")
        .attr("x", width - 100 + legendWidth + 10)
        .attr("y", (_, i) => {
          return (legendWidth + 5) * i + 10;
        })
        .text((d) => {
          return this.industryData[this.sex][d][this.year].state;
        })
        .attr("class", "legendText");

      var xAxis = d3.axisBottom(x).ticks(0).tickFormat("").tickSize(0);
      var yAxis = d3.axisLeft().scale(y).ticks(5, "$~s");
      svg.append("g").attr("class", "y axis").call(yAxis);
      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.select(".y.axis").selectAll("text").style("font-size", "1rem");
      this.drawPieChart();
      this.drawChangeOverYear();
    },
    updateCompareChart: function () {
      var data1 = this.industryIncome[this.sex][this.selection_1][this.year];
      var data2 = this.industryIncome[this.sex][this.selection_2][this.year];
      var margin = { top: 50, right: 30, bottom: 50, left: 70 };
      var height = 600 - margin.top - margin.bottom;
      this.lineChartSelect = this.selection_1;
      var svg = d3.select("#incomeCompare");

      var y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(
            Object.values(data1.industries).concat(
              Object.values(data2.industries)
            )
          ),
        ])
        .range([height, 0])
        .nice();

      var yAxis = d3.axisLeft().scale(y).ticks(5, "$~s");
      svg
        .transition()
        .duration(1000)
        .select(".y.axis")
        .call(yAxis)
        .style("font-size", "1rem");

      svg
        .selectAll(".selection1")
        .data(Object.entries(data1.industries), (d) => d[0])
        .transition()
        .duration(1000)
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => height - y(d[1]))
        .select("title")
        .text((d) => d[0] + ": " + d3.format("$")(d[1]));

      svg
        .selectAll(".selection2")
        .data(Object.entries(data2.industries), (d) => d[0])
        .transition()
        .duration(1000)
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => height - y(d[1]))
        .select("title")
        .text((d) => d[0] + ": " + d3.format("$")(d[1]));

      svg
        .selectAll(".legendText")
        .data([this.selection_1, this.selection_2])
        .text((d) => {
          return this.industryData[this.sex][d][this.year].state;
        });
      this.updateWaffles();
    },
    compareState: function () {
      if (this.svgExist) {
        this.updateCompareChart();
      } else {
        this.drawCompareChart();
        this.svgExist = true;
      }
    },
    waffles: function (data) {
      var total = Object.entries(data).reduce((a, b) => a + b[1], 0);
      var chartData = Object.entries(data).map((d) => ({
        industry: d[0],
        amount: d[1],
        ratio: (d[1] / total) * 100,
      }));
      var array = [];
      const max = chartData.length;
      var index = 0,
        curr = 1,
        accu = Math.round(chartData[0].ratio),
        waffle = [];
      for (var y = 9; y >= 0; y--) {
        for (var x = 0; x < 10; x++) {
          if (curr > accu && index < max - 1) {
            index++;
            var r = Math.round(chartData[index].ratio);
            while (r === 0 && index < max) {
              r = Math.round(chartData[++index].ratio);
            }
            accu += r;
          }
          waffle.push({
            x,
            y,
            index,
            industry: chartData[index].industry,
            amount: chartData[index].amount,
            ratio: chartData[index].ratio,
          });
          curr++;
        }
      }
      array.push(waffle);

      return array;
    },
    waffleChart: function (id) {
      var selection = "industryPie" == id ? this.selection_1 : this.selection_2;
      var stateName = this.$store.state.idToState[selection];
      var data = this.industryData[this.sex][selection][this.year].industries;
      var total = Object.entries(data).reduce((a, b) => a + b[1], 0);
      var chartData = Object.entries(data).map((d) => ({
        industry: d[0],
        amount: d[1],
        ratio: (d[1] / total) * 100,
      }));
      var whole = this.whole;
      var isRect = true;
      var sequence = (length) =>
        Array.apply(null, { length: length }).map((d, i) => i);
      var width = 1024;
      var height = 800;
      var padding = {
        x: 10,
        y: 40,
      };
      var waffleSize = whole ? (width < height ? width : height) : 150;
      var scale = d3
        .scaleBand()
        .domain(sequence(10))
        .range([0, waffleSize])
        .padding(0.1);

      var wafflesData = this.waffles(data);
      const svg = d3
        .select("#" + id)
        .style("cursor", "default")
        .attr("viewBox", [0, 0, width, height + 100]);

      svg
        .append("text")
        .attr("class", "stateName")
        .text(stateName.name)
        .attr("x", padding.x)
        .attr("y", padding.y)
        .style("font-size", 30);

      const g = svg
        .selectAll(".waffle")
        .data(wafflesData)
        .join("g")
        .attr("transform", "translate(" + padding.x + "," + padding.y + ")")
        .attr("viewBox", [0, 0, width, height])
        .attr("class", "waffle");

      const cellSize = scale.bandwidth();
      const half = cellSize / 2;
      const cells = g
        .append("g")
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("class", "waffles")
        .attr("fill", (d) => this.color(d.industry));

      cells
        .attr("x", (d) => scale(d.x))
        .attr("y", (d) => (whole ? 0 : scale(d.y)))
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("width", cellSize)
        .attr("height", cellSize);

      cells.append("title").text((d) => {
        return `${d.industry}\n${d.amount} (${d.ratio.toFixed(1)}%)`;
      });

      cells
        .transition()
        .duration((d) => d.y * 100)
        .ease(d3.easeBounce)
        .attr(isRect ? "y" : "cy", (d) => scale(d.y) + (isRect ? 0 : half));
    },
    drawPieChart: function () {
      this.waffleChart("industryPie");
      this.waffleChart("industryPie2");
      var industries = Object.keys(
        this.industryData[this.sex][this.selection_1][this.year].industries
      );
      var pielegend = d3
        .select("#pieLegend")
        .style("text-align", "end")
        .style("font-size", "15px")
        .selectAll(".legendLabel")
        .data(industries)
        .enter()
        .append("div");
      pielegend
        .html(
          (d) =>
            `${d}<span class="dot" style="background-color: ${this.color(
              d
            )}"></span>`
        )
        .on("mouseover", highlight)
        .on("mouseout", restore);
      var that = this;
      function highlight(e, d, restore) {
        const i = pielegend.nodes().indexOf(e.currentTarget);
        var cells = d3.selectAll(".waffles");
        cells
          .transition()
          .duration(500)
          .attr("fill", (d) =>
            d.index === i ? that.color(industries[d.index]) : "#ccc"
          );
      }

      function restore() {
        var cells = d3.selectAll(".waffles");
        cells
          .transition()
          .duration(500)
          .attr("fill", (d) => that.color(industries[d.index]));
      }
    },
    updateWaffles: function () {
      var data = [
        this.industryData[this.sex][this.selection_1][this.year].industries,
        this.industryData[this.sex][this.selection_2][this.year].industries,
      ];
      data = data.map((d) => this.waffles(d));
      d3.selectAll(".stateName")
        .data([
          this.industryData[this.sex][this.selection_1][this.year].state,
          this.industryData[this.sex][this.selection_2][this.year].state,
        ])
        .text((d) => d);
      d3.select("#industryPie")
        .data(data[0])
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .transition()
        .duration(1000)
        .attr("fill", (d) => this.color(d.industry))
        .select("title")
        .text((d) => {
          return `${d.industry}\n${d.amount} (${d.ratio.toFixed(1)}%)`;
        });

      d3.select("#industryPie2")
        .data(data[0])
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .transition()
        .duration(1000)
        .attr("fill", (d) => this.color(d.industry))
        .select("title")
        .text((d) => {
          return `${d.industry}\n${d.amount} (${d.ratio.toFixed(1)}%)`;
        });
    },
    drawChangeOverYear: function () {
      var parseTime = d3.timeParse("%Y");
      var margin = { top: 50, left: 50, bottom: 50, right: 50 },
        width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
      var svg = d3
        .select("#changeOverYear")
        .attr("viewBox", [
          0,
          0,
          width + margin.left + margin.right,
          height + margin.top + margin.bottom,
        ])
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("viewBox", [0, 0, width, height]);
      var year = ["2015", "2016", "2017", "2018", "2019"].map((d) =>
        parseTime(d)
      );
      var value = this.generateLineData(parseTime);
      var dataset = value[0],
        max = value[1];

      var line = d3
        .line()
        .x(function (d) {
          return x(d.year);
        })
        .y(function (d) {
          return y(d.percent);
        });
      var x = d3.scaleTime().rangeRound([0, width]).domain(d3.extent(year));
      var y = d3.scaleLinear().rangeRound([height, 0]).domain([0, max]);

      var lines = svg
        .selectAll(".lineChart")
        .data(dataset, (d) => d[0].category)
        .enter()
        .append("g")
        .attr("class", "lineChart");
      lines
        .append("path")
        .attr("d", line)
        .attr("class", "line")
        .style("stroke", (d) => {
          return this.color(d[0].category);
        })
        .on("mouseover", function (event, d) {
          d3.select(this).style("stroke-width", 5);
          console.log(event);
          svg
            .append("text")
            .text(d[0].category)
            .attr("id", "lineTooltip")
            .attr("x", event.offsetX)
            .attr("y", event.offsetY)
            .style("pointer-events", "none")
            .style("font-size", "12");
        })
        .on("mouseout", function () {
          //Remove the tooltip
          d3.select(this).style("stroke-width", 2);
          d3.select("#lineTooltip").remove();
        });

      var xAxis = d3.axisBottom(x).ticks(5);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      var yAxis = d3.axisLeft().scale(y).ticks(5, "%");
      svg
        .append("g")
        .attr("class", "y axis")
        .attr("id", "linechart")
        .call(yAxis);
    },
    updateChangeOverYear: function () {
      var margin = { top: 50, left: 50, bottom: 50, right: 50 },
        width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
      var parseTime = d3.timeParse("%Y");
      var value = this.generateLineData(parseTime);
      var dataset = value[0],
        max = value[1];
      var year = ["2015", "2016", "2017", "2018", "2019"].map((d) =>
        parseTime(d)
      );
      var line = d3
        .line()
        .x(function (d) {
          return x(d.year);
        })
        .y(function (d) {
          return y(d.percent);
        });
      var x = d3.scaleTime().rangeRound([0, width]).domain(d3.extent(year));
      var y = d3.scaleLinear().rangeRound([height, 0]).domain([0, max]);
      d3.selectAll(".lineChart")
        .data(dataset, (d) => d[0].category)
        .transition()
        .duration(1000)
        .select("path")
        .attr("d", line);
      var yAxis = d3.axisLeft().scale(y).ticks(5, "%");
      d3.transition().duration(1000).select("#linechart").call(yAxis);
    },
    generateLineData: function (parseTime) {
      var year = ["2015", "2016", "2017", "2018", "2019"];
      var data = {};
      var total;
      var i;
      for (i in year) {
        total = this.industryData[this.sex][this.lineChartSelect][year[i]]
          .total;
        Object.entries(
          this.industryData[this.sex][this.lineChartSelect][year[i]].industries
        )
          .map((d) => [d[0], d[1] / total])
          .forEach(function (d) {
            if (data[d[0]]) {
              data[d[0]][year[i]] = d[1];
            } else {
              data[d[0]] = {};
              data[d[0]][year[i]] = d[1];
            }
          });
      }
      var dataset = [];
      var max = 0;
      Object.keys(data).forEach(function (d) {
        var tempArray = [];
        Object.entries(data[d]).forEach(function (temp) {
          tempArray.push({
            category: d,
            percent: temp[1],
            year: parseTime(temp[0]),
          });
          if (temp[1] > max) {
            max = temp[1];
          }
        });
        dataset.push(tempArray);
      });
      return [dataset, max];
    },
  },
  components: {},
  mounted: function () {
    var promises = [];
    promises.push(d3.json("us-10m.v1.json"));
    promises.push(d3.json("industryBySex.json"));
    promises.push(d3.json("industryBySexMedianIncome.json"));
    var that = this;
    var width = 960,
      height = 600;
    this.svg = d3
      .select("#chart")
      .attr("viewBox", [0, 0, width, height])
      .attr("fill", "white");
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "hidden tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("font-size", "0.9em")
      .style("pointer-events", "none")
      .style("padding", "7px")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("-moz-box-shadow", "3px 3px 10px 0px rgba(0, 0, 0, 0.25)")
      .style("-webkit-box-shadow", "3px 3px 10px 0px rgba(0, 0, 0, 0.25)")
      .style("box-shadow", "3px 3px 10px 0px rgba(0, 0, 0, 0.25)");
    Promise.all(promises).then(function (values) {
      that.us = values[0];
      var json = topojson.feature(that.us, that.us.objects.states);
      that.industryData = values[1];
      that.industryIncome = values[2];
      that.color = d3.scaleOrdinal(
        Object.keys(that.industryData.all["01"]["2019"].industries),
        [
          "#e6194b",
          "#3cb44b",
          "#ffe119",
          "#4363d8",
          "#f58231",
          "#911eb4",
          "#46f0f0",
          "#f032e6",
          "#bcf60c",
          "#fabebe",
          "#008080",
          "#e6beff",
          "#9a6324",
          "#fffac8",
          "#800000",
          "#aaffc3",
          "#808000",
          "#ffd8b1",
          "#000075",
          "#808080",
        ]
      );
      that.$store.commit("setIndustryColor", that.color);

      that.path = d3.geoPath();
      var graticule = d3.geoGraticule().step([10, 10]);

      that.svg
        .append("g")
        .append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr(
          "d",
          d3
            .geoPath()
            .projection(d3.geoAlbersUsa().fitSize([width, height], json))
        );

      var states = that.svg
        .append("g")
        .selectAll(".states")
        .data(
          topojson.feature(that.us, that.us.objects.states).features,
          (d) => d.id
        )
        .enter();
      states
        .append("path")
        .attr("fill", that.getDominantIndustry)
        .attr("class", "states")
        .attr("d", that.path)
        .on("click", function () {
          that.select(this.__data__);
        })
        .on("mouseover", function (event, d) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(
              "<h4 style='margin: 0;padding: 0;'>" +
                d.properties.name +
                "</h4>" +
                "<h5 style='margin: 0;padding: 0;'>Dominant Industry: " +
                d.properties.dominant +
                "</h5>"
            )

            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function (event, d) {
          tooltip.transition().duration(1000).style("opacity", 0);
        });

      that.svg
        .append("g")
        .append("path")
        .datum(
          topojson.mesh(that.us, that.us.objects.counties, (a, b) => a !== b)
        )
        .attr("class", "counties-borders")
        .attr("d", that.path);
      states
        .append("text")
        .attr("class", "stateLabel")
        .attr("x", function (d) {
          return that.path.centroid(d)[0];
        })
        .attr("y", function (d) {
          return that.path.centroid(d)[1];
        })
        .text(function (d) {
          return d.properties.abbr;
        })
        .style("pointer-events", "none");
    });
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&display=swap");
.industryPage {
  font-family: "Libre Baskerville", serif;
}
>>> .graticule {
  fill: none;
  stroke: black;
  stroke-width: 0.5px;
  stroke-opacity: 0.5;
}
>>> .states {
  stroke: white;
  stroke-width: 1px;
}
>>> .states:hover {
  fill: red;
}

>>> .counties-borders {
  fill: none;
  stroke: black;
  stroke-width: 0.3px;
  stroke-linejoin: round;
  stroke-linecap: round;
  pointer-events: none;
}
>>> .stateLabel {
  text-anchor: middle;
  alignment-baseline: center;
  fill: black;
}

.mapDescription p {
  text-align: left;
}
.sexFilter {
  list-style-type: none;
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 0;
  margin: 0;
  align-items: center;
}

.sexFilter li {
  display: inline-flex;
  align-items: center;
}

.sexFilter li > * {
  padding: 5px;
  margin: 0;
}

.active {
  background-color: #d8bfd8;
}
.selectCompare {
  align-self: center;
  align-items: center;
  width: 100%;
}

.selectState:hover {
  background-color: #d8bfd8;
}

.selectState {
  max-width: 80%;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d8bfd8;
  border-radius: 1rem;
}

>>> .dot {
  height: 10px;
  width: 10px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  margin-left: 10px;
}

>>> .part {
  background-color: white;
  margin: 5px;
  border: 1px solid grey;
  border-radius: 5px;
  justify-content: center;
}

>>> .legendText {
  alignment-baseline: hanging;
}

>>> .line {
  fill: none;
  stroke-width: 2;
}
>>> .pieState {
  font-size: 2rem;
}

@media screen and (max-width: 400px) {
  .sexFilter {
    max-width: 100%;
  }
}
</style>