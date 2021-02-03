<template>
  <div class="home">
    <b-container fluid class="mapSVG">
      <b-row align-h="center">
        <b-col cols="12" md="10">
          <svg id="mapUSA"></svg>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson";

export default {
  name: "State",
  data: function () {
    return {
      mapData: null,
    };
  },
  components: {},
  mounted: function () {
    var currentComponent = this;
    var path = d3.geoPath();
    var graticule = d3.geoGraticule().step([10, 10]);
    var width = 960,
      height = 600;
    var svg = d3.select("#mapUSA").attr("viewBox", [0, 0, width, height]);
    var json = topojson.feature(
      this.$store.state.us,
      this.$store.state.us.objects.states
    );
    var that = this

    svg
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

    var states = svg
      .append("g")
      .selectAll(".states")
      .data(json.features, (d) => d.id)
      .enter();
    states
      .append("path")
      .attr("fill", "white")
      .attr("class", "states")
      .attr("d", path)
      .on("click", function (event, d) {
        currentComponent.$router.push("/profile/" + d.id);
      })
    states
      .append("text")
      .attr("class", "stateLabel")
      .attr("x", function (d) {
        return path.centroid(d)[0];
      })
      .attr("y", function (d) {
        return path.centroid(d)[1];
      })
      .text(function (d) {
        return that.$store.state.idToState[d.id].abbr;
      })
      .style("pointer-events", "none");

    // svg
    //   .append("g")
    //   .append("path")
    //   .datum(
    //     topojson.mesh(
    //       this.$store.state.us,
    //       this.$store.state.us.objects.counties,
    //       (a, b) => a !== b
    //     )
    //   )
    //   .attr("class", "counties-borders")
    //   .attr("d", path);
  },
};
</script>

<style scoped>
>>> text.state {
  /* need to add >>> to gets passed to d3 because vue creates new mapping */
  text-anchor: middle;
  alignment-baseline: middle;
  font-size: 12px;
  fill: black;
}

>>> .graticule {
  fill: none;
  stroke: black;
  stroke-width: 0.5px;
  stroke-opacity: 0.5;
}
>>> .states {
  stroke: black;
  stroke-width: 0.3px;
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
>>>.stateLabel{
  text-anchor: middle;
  alignment-baseline:center;
}
</style>
