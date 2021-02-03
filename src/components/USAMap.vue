<template>
  <svg id="map" ref="svg"></svg>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "USAMap",
  props: {
    json: {
      //this.data in component
      type: Object,
    },
  },
  methods: {
    barChart() {
      var json = this.$store.state.mapData;
      var currentComponent = this
      var w = 900;
      var h = 600;
      // var tempScale;

      //Define map projection
      var projection = d3.geoAlbersUsa().translate([0, 0]);

      //Define path generator
      var path = d3.geoPath().projection(projection);

      var color = d3.scaleSequential(d3.interpolatePiYG);

      var svg = d3.select("#map").attr("viewBox", `0 0 ${w} ${h}`);
      //Define what to do when panning or zooming
      var zooming = function (event) {
        //Log out d3.event.transform, so you can see all the goodies inside

        //New offset array
        var offset = [event.transform.x, event.transform.y];

        //Calculate new scale
        var newScale = event.transform.k * 2000;

        // //Update projection with new offset and scale
        projection.translate(offset).scale(newScale);

        // //Update all paths and circles
        svg.selectAll("path").attr("d", path);
        svg
          .selectAll(".state")
          .attr("x", function (d) {
            return path.centroid(d)[0];
          })
          .attr("y", function (d) {
            return path.centroid(d)[1];
          });
      };

      // Then define the zoom behavior
      var zoom = d3.zoom().on("zoom", zooming);

      //The center of the country, roughly
      var center = projection([-97.0, 39.0]);

      //Create a container in which all zoom-able elements will live
      var map = svg
        .append("g")
        .attr("id", "map")
        .call(zoom) //Bind the zoom behavior
        .call(
          zoom.transform,
          d3.zoomIdentity //Then apply the initial transform
            .translate(w / 2, h / 2)
            .scale(0.25)
            .translate(-center[0], -center[1])
        );

      //Create a new, invisible background rect to catch zoom events
      map
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h)
        .attr("opacity", 0);
      var states = map
        .selectAll("path")
        .data(json.features, (d) => d.properties.name)
        .enter()
        .append("g");
      states
        .append("path")
        .attr("d", path)
        .style("fill", (d, i) => {
          return color(parseFloat(i) / 51);
        })
        .on("mouseover", function () {
          // tempScale = d3.zoomTransform(this).k*2000
          // projection.scale(tempScale*1.2)
          d3.select(this).style(
            "fill",
            d3.rgb(d3.select(this).style("fill")).darker()
          );
          // projection.scale(tempScale)
        })
        .on("mouseout", function () {
          d3.select(this).style(
            "fill",
            d3.rgb(d3.select(this).style("fill")).brighter()
          );
        })
        .on("click",function(event,d){
            currentComponent.$router.push('/profile/'+d.properties.abbreviation)
          })
        
      states
        .append("text")
        .attr("class", "state")
        .attr("x", function (d) {
          return path.centroid(d)[0];
        })
        .attr("y", function (d) {
          return path.centroid(d)[1];
        })
        .text(function (d) {
          return d.properties.abbreviation;
        })
        .style("pointer-events", "none");
    },
  },
  mounted: function () {
    this.barChart();
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
</style>
