<template>
  <div class="stateProfile">
    <b-container fluid>
      <b-row>
        <b-col md="3" xl="2" cols="12" class="sideBar">
          <b-nav vertical>
            <b-nav-item disabled class="sideBarState">{{ state }}</b-nav-item>
            <b-nav-item href="#houseIncome">Income</b-nav-item>
            <b-nav-item href="#expense">Life Expense</b-nav-item>
            <b-nav-item href="#education">Education</b-nav-item>
            <b-nav-item href="#industry">Industry</b-nav-item>
          </b-nav>
        </b-col>

        <b-col>
          <b-container fluid>
            <b-row class="ProfileHighlights">
              <b-col cols="3">
                <font-awesome-icon icon="hand-holding-usd" :size="iconSize" />
                <hr />
                <p>MEDIAN HOUSEHOLD INCOME</p>
                <p v-for="median in getMedianIncome($route.params.id)" :key="median.id">
                     $ {{median.MedianIncome}}
                    </p>
              </b-col>
              <b-col cols="3">
                <font-awesome-icon
                  icon="file-invoice-dollar"
                  :size="iconSize"
                />
                <hr />
                <p>AVERAGE LIFE EXPENSE</p>
                <p v-for="exp in getLifeExpense($route.params.id)" :key="exp.id">
                     $ {{exp.expense}}
                    </p>
              </b-col>
              <b-col cols="3">
                <font-awesome-icon icon="university" :size="iconSize" />
                <hr />
                <p>TOP 200 UNIVERSITY</p>
              </b-col>
              <b-col cols="3">
                <font-awesome-icon icon="industry" :size="iconSize" />
                <hr />
                <p>DOMINANT INDUSTRY</p>
                <p>{{ getDominantIndustry }}</p>
              </b-col>
            </b-row>
            <b-row>
              <b-col id ="houseIncome" style="text-align: start">
                <h2 class="section-heading">Household Income</h2>
                <div  class = "household" style = "margin-bottom:5px">
                 <b> Median Household Income </b>
                  <li v-for="median in getMedianIncome($route.params.id)" :key="median.id" style="margin-top:5px; margin-bottom:5px">
                     $ {{median.MedianIncome}}
                    </li>
                <b> Top3 Average Salaries by Race and Ethinicity   </b>

                  <li v-for="averageRace in getTop3Race()" :key ="averageRace.id"  style="margin-top:5px; margin-bottom:5px">
                    {{averageRace.race}} : $ {{averageRace.averageWage}}
                  </li>
                  </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col id='expense' style="text-align: start">
                <h2 class="section-heading">Life and Education Expense </h2>
                <b-row>
                  <b-col cols="12" md="6">
                    <b-row>
                      <b-col style="text-align: start">
                        <div id="lifeexpense" class="expen">
                          <b> Average Life Expense </b>
                          <p v-for="exp in getLifeExpense($route.params.id)" :key="exp.id" style="margin-top:5px; margin-bottom:5px">
                          Annual Average Life Expense: ${{exp.expense}}
                          </p>
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col cols="12" md="6">
                    <b-row>
                      <b-col style="text-align: start">
                        <div id="eduexpense" class="expen">
                          <b> Education Expense </b>
                          <li v-for="tuition in getEduExpense($route.params.id)" :key="tuition.id" style="margin-top:5px; margin-bottom:5px">
                            In-State Average Expense: ${{tuition.InState}}
                            </li>
                          <li v-for="tuition in getEduExpense($route.params.id)" :key="tuition.id" style="margin-top:5px; margin-bottom:5px">
                            Out-of-State Average Expense: ${{tuition.OutState}}
                            </li>
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row>
              <b-col id='education'>
                <h2 class="section-heading">Education</h2>
                <b-row>
                  <b-col cols="12" md="6">
                    <b-row>
                      <b-col style="text-align: start">
                        <p class="subtitle">University Name</p>
                        <div id="uniname" class="education">
                          <p v-for="(item, index) in universityInfo" :key="index" @click="trunUni(item[8])">
                            {{item[3]}}
                          </p>
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col cols="12" md="6">
                    <b-row>
                      <b-col style="text-align: start">
                        <p class="subtitle">Rank</p>
                        <div id="rank" class="education">
                          <p v-for="(item, index) in universityInfo" :key="index">
                            {{item[2]}}
                          </p>
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row>
              <b-col id="industry">
                <h2 class="section-heading">Industry</h2>
                <b-row>
                  <b-col cols="12" md="6">
                    <b-row>
                      <b-col style="text-align: start">
                        <p class="subtitle">Top 3 in weight distribution</p>
                        <div id="top3distribution" class="industry"></div>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        <svg style="max-height: 300" id="industryPie"></svg>
                      </b-col>
                    </b-row>
                  </b-col>
                  <b-col cols="12" md="6">
                    <b-row>
                      <b-col style="text-align: start">
                        <p class="subtitle">Top 3 By median income</p>
                        <div id="top3income" class="industry"></div>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        <svg style="max-height: 300" id="industryBar"></svg>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  
  name: "stateProfile",
  props: {
    state: String,
    data: {
      //this.data in component
      type: Array,
    },
  },
  components: {},
  data: function () {
    return {
      universityData: require("@/assets/university.json"),
      universityInfo: [],
      medianIncomes : require("@/assets/median-house-income.json"),
      wageByRaces : require("@/assets/averageWageByRace.json"),
      eduExpense: require("@/assets/education_expense.json"),
      lifeExpense: require("@/assets/avg_expense.json"),
      json: null,
      sortedIndustryDistribution: null,
      sortedIndustryIncome: null,
      iconSize: "3x"
    };
  },
  computed: {
    getDominantIndustry: function () {
      return Object.entries(
        this.$store.state.industryData.all[this.$route.params.id]["2019"][
          "industries"
        ]
      ).sort((a, b) => d3.descending(a[1], b[1]))[0][0];
    },
  },
  created() {
    window.addEventListener("resize", this.myEventHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.myEventHandler);
  },
  methods: {
    myEventHandler() {
      if (window.innerWidth<400){
        this.iconSize="2x";
      }else{
        this.iconSize="3x";
      }
    },
    getDominantIndustryList: function () {
      return Object.entries(
        this.$store.state.industryData.all[this.$route.params.id]["2019"][
          "industries"
        ]
      ).sort((a, b) => d3.descending(a[1], b[1]));
    },
    sortByMedian: function () {
      return Object.entries(
        this.$store.state.industryIncome.all[this.$route.params.id]["2019"][
          "industries"
        ]
      ).sort((a, b) => d3.descending(a[1], b[1]));
    },
    drawPieIndustry: function (total) {
      var industryData = this.sortedIndustryDistribution.map((d) => [
        d[0],
        d[1] / total,
      ]);
      var margin = { top: 50, left: 50, bottom: 50, right: 50 },
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      var svg = d3
        .select("#industryPie")
        .attr("viewBox", [
          0,
          0,
          width + margin.left + margin.right,
          height + margin.top + margin.bottom,
        ])
        .style("cursor", "pointer")
        .append("g")
        .attr(
          "transform",
          " translate(" +
            (margin.left + width / 2) +
            "," +
            (margin.top + height / 2) +
            ")"
        );
      var color = d3.scaleOrdinal(
        this.sortedIndustryDistribution.map((d) => d[0]),
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
      var pie = d3
        .pie()
        .value((d) => d[1])
        .sortValues(d3.descending);
      var radius = height / 2;
      var pathPie = d3.arc().outerRadius(radius).innerRadius(0);
      var arc = svg
        .selectAll(".arc")
        .data(pie(industryData), (d) => d.data[0])
        .enter()
        .append("g")
        .attr("class", "arc");
      arc
        .append("path")
        .attr("d", (d) => {
          return pathPie(d);
        })
        .attr("fill", (d) => color(d.data[0]))
        .attr("stroke", "white")
        .on("mouseover", function (event, d) {
          svg
            .append("text")
            .attr("class", "value")
            .text(d.data[0] + ": " + d3.format(".2%")(d.data[1]))
            .style("pointer-events", "none")
            .attr(
              "transform",
              "translate(" +
                (pathPie.centroid(d)[0] - 100) +
                "," +
                pathPie.centroid(d)[1] +
                ")"
            );
          d3.select(this).attr("fill", d3.rgb(color(d.data[0])).darker());
        })
        .on("mouseout", function (event, d) {
          d3.select(".value").remove();
          d3.select(this)
            .transition()
            .duration(1000)
            .attr("fill", color(d.data[0]));
        });
    },
    drawBarIndustry: function (id, title) {
      var data = this.sortedIndustryIncome;
      var industries = data.map((d) => d[0]);
      var margin = { top: 50, right: 30, bottom: 50, left: 70 };
      var width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
      var svg = d3
        .select("#" + id)
        .attr("viewBox", [
          0,
          0,
          width + margin.right + margin.left,
          height + margin.top + margin.bottom,
        ]);
      svg
        .append("text")
        .text(title)
        .style("text-anchor", "middle")
        .attr("x", (width + margin.right + margin.left) / 2)
        .attr("y", margin.top / 2)
        .style("font-size", "2rem");
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
        .domain([0, d3.max(data, (d) => d[1])])
        .range([height, 0])
        .nice();

      svg
        .append("g")
        .selectAll(".industryBar")
        .data(data, (d) => d[0])
        .enter()
        .append("rect")
        .classed("industryBar", true)
        .attr("x", (d) => x(d[0]))
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => height - y(d[1]))
        .attr("width", x.bandwidth())
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
      var xAxis = d3.axisBottom(x).ticks(0).tickFormat("").tickSize(0);
      var yAxis = d3.axisLeft().scale(y).ticks(5, "$~s");
      svg.append("g").attr("class", "y axis").call(yAxis);
      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.select(".y.axis").selectAll("text").style("font-size", "1rem");
    },
    renderIndustry: function () {
      var total = this.$store.state.industryData.all[this.$route.params.id][
        "2019"
      ].total;
      var top3distri = d3
        .select("#top3distribution")
        .selectAll(".top3distri")
        .data(this.sortedIndustryDistribution.slice(0, 3))
        .enter()
        .append("div");
      top3distri
        .append("p")
        .text((d) => d[0])
        .style("float", "left");
      top3distri.append("p").text((d) => d3.format(".02%")(d[1] / total));

      var top3income = d3
        .select("#top3income")
        .selectAll(".top3Income")
        .data(this.sortedIndustryIncome.slice(0, 3))
        .enter()
        .append("div");
      top3income
        .append("p")
        .text((d) => d[0])
        .style("float", "left");
      top3income.append("p").text((d) => d3.format("$.02s")(d[1]));
      this.drawBarIndustry(
        "industryBar",
        "Median Income of Industries in 2019"
      );
      this.drawPieIndustry(total);
    },
    findUni(){
      this.universityInfo = this.groupBy(this.universityData, function (item) {
        return item[5];
      });
      this.universityInfo = this.universityInfo[this.state]
      console.log(this.universityInfo)
      if(this.universityInfo == undefined) return
      this.universityInfo.sort((a,b) => {
        return a[2].replace('#','') - b[2].replace('#','')
      }),
      console.log(this.universityInfo)
    },
    groupBy (array, f) {
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
    },
    trunUni(url) {
      window.open(url)
    },
    getMedianIncome(id) {
      let data = this.medianIncomes
      return data.filter(item => {
        return item.id == id
      })
    },
    getAverageWage(id) {
      let data = this.wageByRaces
      return data.filter(item => {
        return item.id ==id
      })
    },
    getTop3Race() {
      let data = this.getAverageWage(this.$route.params.id).sort((t1,t2)=> t1.averageWage > t2.averageWage ? -1 :1);
      console.log('average wage', data)
      return data.slice(0,3)
    },
    getEduExpense(id){
      let data = this.eduExpense
      return data.filter(item => {
        return item.id == id
      })
    },
    getLifeExpense(id){
      let data = this.lifeExpense
      return data.filter(item => {
        return item.id == id
      })
    },
    },
    

  mounted: function () {
    // console.log(this.$route.params.id)
    // this.industryData = this.getDominantIndustry(
    this.sortedIndustryDistribution = this.getDominantIndustryList();
    this.sortedIndustryIncome = this.sortByMedian();
    this.renderIndustry();
    this.findUni();
    this.getTop3Race();
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.stateProfile{
  border-top: 1px solid #CDC9C9;
}
.sideBar {
  text-align: left;
  border-right: 1px solid #CDC9C9;
}
.sideBar ul{
    position: fixed;

}

.sideBar .sideBarState {
  font-weight: bold;
}

.nav-item {
  font-size: 20px;
}
.ProfileHighlights {
  /* text-align: left; */
  padding-bottom: 10px;
  padding-top: 20px;
}

.section-heading {
  font-size: 24px;
  padding: 0;
  margin-bottom: 12px;
  border-bottom: 1px solid #112e51;
  text-align: left;
}

.ProfileMetric {
  margin-bottom: 32px;
  margin-top: 32px;
}

.metric-end {
  border: 0.5px solid #4b636e;
  margin-top: 80px;
}
.subtitle {
  text-transform: capitalize;
  font-weight: bold;
}

.industry {
  text-align: end;
}

>>> #top3distribution div p {
  display: inline-block;
}

>>> #top3income div p {
  display: inline-block;
}

@media screen and (max-width: 700px) {
  .sideBar{
    display: none;
  }
  .sideBar ul{
    position: static;

}
}
</style>
