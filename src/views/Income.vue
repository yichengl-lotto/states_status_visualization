
<template>
    <b-container fluid>
        <b-row style= "margin-top:50px">
        <b-col id ="stateMapCol">
            <p style="font-size:20px"><b>Gini Index of Income Inequality by State 2006-2018</b></p>
            <div class="year"></div>
            <div class="slider"></div>
            <svg id = "stateMap" ></svg>
        </b-col>
        <b-col>
            <p style="font-size:20px; margin-bottom:60px" ><b>Median Household Income by Counties </b></p>
           
            
            <p style="font-size:15px;margin-bottom:2px">Income Legend ($)</p>
            
            <b-row style="margin-left:40px;margin-right:40px">
            <b-col style="background-color: #F2F12D;height:10px;opacity:0.9"></b-col>
            <b-col style="background-color: #E6B71E;height:10px;opacity:0.9"></b-col>
            <b-col style="background-color: #CA8323;height:10px;opacity:0.9"></b-col>
            <b-col style="background-color: #B86B25;height:10px;opacity:0.9"></b-col>
            <b-col style="background-color: #A25626;height:10px;opacity:0.9"></b-col>
            <b-col style="background-color: #8B4225;height:10px;opacity:0.9"></b-col>
            <b-col style="background-color: #723122;height:10px;opacity:0.9"></b-col>
            </b-row>
             <b-row style="margin-left:40px;margin-right:40px">
                 <b-col style="font-size:10px;text-align:center;padding:0">20000</b-col>
                 <b-col style="font-size:10px;text-align:center; padding:0">40000</b-col>
                 <b-col style="font-size:10px;text-align:center;padding:0">60000</b-col>
                 <b-col style="font-size:10px;text-align:center;padding:0">80000</b-col>
                 <b-col style="font-size:10px;text-align:center;padding:0">100000</b-col>
                 <b-col style="font-size:10px;text-align:center;padding:0">120000</b-col>
                 <b-col style="font-size:10px;text-align:center;padding:0">150000</b-col>
             </b-row>
           
            
           <div id="mapchart" style=' height: 400px;'>
              
            
            
           </div>
        </b-col>
        </b-row>
    </b-container>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson";
import * as d3Collection from 'd3-collection';
import mapboxgl from "mapbox-gl";



export default {
    
    data() {
        return {
            stateSelect:[],
            state2:"",
            id1 :"",
            id2:"",
            toogle:true,
            //render:true,
            state1:"",
            zoomIndex:2.5
            
          
        }
    },

    methods :{
        drawMap() {
           var year=2006;
           var tooltip = d3.select('body').append('div')
            .attr('class', 'hidden tooltip')
            .style("opacity", 0)
            .style("position", "absolute")
            .style("font-size", "0.9em")
            .style("pointer-events", "none")
            .style("padding","7px")
            .style("background", "#fff")
            .style("border","1px solid #ccc")
            .style("border-radius", "4px")
            .style("-moz-box-shadow",  "3px 3px 10px 0px rgba(0, 0, 0, 0.25)")
            .style("-webkit-box-shadow","3px 3px 10px 0px rgba(0, 0, 0, 0.25)")
            .style("box-shadow","3px 3px 10px 0px rgba(0, 0, 0, 0.25)")

           var promises = [];

          promises.push(d3.json("states-albers-10m.json"));
          promises.push(d3.csv("giniIndexByYear.csv"));

          console.log(promises)
          var margin = {top: 20, right: 20, bottom: 20, left: 20},
	      width = document.getElementById('stateMapCol').clientWidth - margin.left - margin.right,
	      height = 500 - margin.top - margin.bottom,
	      formatPercent = d3.format(".1%");

         var svg = d3.select("#stateMap")
         .attr("viewBox", [0, 0, 975, 610])
	     .attr("width", width + margin.left + margin.right)
	     .attr("height", height + margin.top + margin.bottom)
	     .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        
        var legendText = ["", "0.4", "0.427", "0.453", "0.48", "0.507", "0.533", "0.55"];
        var legendColors = ["#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"];

        Promise.all(promises).then(function(values) {
            var us = values[0];
            var data = values[1];
            //console.log('data', data)
            //let states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))  //🚧  map id and state name
            var states = topojson.feature(us, us.objects.states);
            //console.log('states', states)
            data.forEach(function(d) {
		    d.year = +d.year;
		    d.id_c = +d.id_c;
		    d.gini = +d.gini;
            });
            var dataByStateByYear = d3Collection.nest()
		    .key(function(d) { return d.id; })
		    .key(function(d) { return d.year; })
            .map(data);
            console.log('dataByStateByYear',dataByStateByYear["$01"])

	       states.features.forEach(function(state) {
           state.properties.years = dataByStateByYear["$"+state.id]
           //state.properties.years.push(dataByStateByYear[+state.id])
           });
           console.log('states',states);
           var color = d3.scaleThreshold()
		   .domain([0.4, 0.4266, 0.4533, 0.48, 0.5066, 0.5333, 0.55])
           .range(["#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);
           
           var path = d3.geoPath()
         
           var stateShapes = svg.selectAll(".states")
		      .data(states.features)
		      .enter()
		      .append("path")
			  .attr("class", "states")
              .attr("d", path);
            
            console.log(stateShapes)
            
            stateShapes.on("mouseover", function(event,d){
                tooltip.transition()
                .duration(200)
                .style("opacity", .9);
                tooltip.html("<p style='margin: 0;padding: 0;'>"+d.properties.years["$"+year][0].state+"</p>"
                    +"<p style='margin: 0;padding: 0;'>Median Income: "+d.properties.years["$"+year][0].medianIncome+"</p>"
                    +"<p style='margin: 0;padding: 0;'>Gini Index: " + d.properties.years["$"+year][0].gini + "</p>"   
                 )

                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px")
            })
            .on("mouseout", function(event,d) {
			tooltip.transition()
			.duration(200)
			.style("opacity", 0);
        })
        .on("click", (event,d) => {
                //console.log(this)
                if(this.toogle) {
                    this.state1 = d.properties.years["$"+year][0].state
                    this.id1 = d.properties.years["$"+year][0].id
                    this.toogle = false                   

                }
                else {
                    this.state2 = d.properties.years["$"+year][0].state
                    this.id2 = d.properties.years["$"+year][0].id
                    this.toogle = true
                }
                console.log('id1',this.id1)
                console.log('id2', this.id2)
        });
         
        var legend = svg.append("g")
		.attr("id", "legend");

	var legenditem = legend.selectAll(".legenditem")
		.data(d3.range(8))
		.enter()
		.append("g")
			.attr("class", "legenditem")
			.attr("transform", function(d, i) { return "translate(" + i * width/10 + ",0)"; });

	legenditem.append("rect")
		.attr("x", width/1.5)
		.attr("y", -50)
		.attr("width", width/10)
		.attr("height", 20)
		.attr("class", "rect")
		.style("fill", function(d, i) { return legendColors[i]; });

	legenditem.append("text")
		.attr("x", width/1.5)
		.attr("y", -10)
		.style("text-anchor", "middle")
		.text(function(d, i) { return legendText[i]; });

    function update(year){
		slider.property("value", year);
		d3.select(".year").text(year);
		stateShapes.style("fill", function(d) {
            console.log("$"+year)
			return color(d.properties.years["$"+year][0].gini)
        })
        
	}

	var slider = d3.select(".slider")
		.append("input")
			.attr("type", "range")
			.attr("min", 2006)
			.attr("max", 2018)
			.attr("step", 1)
			.on("input", function() {
				 year = this.value;
				update(year);
            });
    update(2006);
        
    }.bind(this))
    
},
    drawMapBox() {
        var counties;
        var states1;
        var popup = new mapboxgl.Popup({
        offset: [0, -7],
        closeButton: false,
        closeOnClick: false
      });
        d3.json("income_final.json").then(function(d){
            counties = topojson.feature(d, d.objects.counties)
            console.log('counties',counties)
            states1 = topojson.feature(d,d.objects.states)
            console.log('mapbox', states1)
        mapboxgl.accessToken = 'pk.eyJ1IjoibG90dG8xNCIsImEiOiJja2dxOXd1OW8wc3BlMnpwZ3AzaHVsMzY3In0.hNeaBsiLzh2WpUjINskyfg';
		var map = new mapboxgl.Map({
		container: 'mapchart', // container id
		style: 'mapbox://styles/mapbox/streets-v11', // style URL
		center: [-98.32,39.5], // starting position [lng, lat]
		zoom: this.zoomIndex// starting zoom
		});
  map.on('load', function () {
  map.addSource('footprints_source', { 
    type: 'geojson', 
    data: counties
  });
  map.addSource('state_line_source', {
    type:'geojson',
    data: states1
  })
  
  map.addLayer({
    'id': 'footprints',
    'type': 'fill',
    'source': 'footprints_source',
    'layout': {},
    'paint': {
        'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'income'],
           
            20000,
            '#F2F12D',
            40000,
            '#E6B71E',
            60000,
            '#CA8323',
            80000,
            '#B86B25',
            100000,
            '#A25626',
            120000,
            '#8B4225',
            140000,
            '#723122'
            
            ],
      'fill-opacity': 0.9
    }
  });
  map.addLayer({
      'id':'state_line',
      'type':'line',
      'source': 'state_line_source',
      'layout' : {},
      'paint' : {
          'line-color' :'#fff',
          'line-opacity' : 0.5,
          'line-width': 3
          
      }
  });
  map.addLayer({
      'id':'county_line',
      'type':'line',
      'source': 'footprints_source',
      'layout' : {},
      'paint' : {
          'line-color' :'#000',
          'line-opacity' : 0.1,
          
      }
  });
  
  /*map.on('mouseenter','state_line',function(d){
       map.getCanvas().style.cursor = 'pointer';
      var coordinates = d.features[0].geometry.coordinates[0][0]];
      
      console.log('coordinate',coordinates)
      var county = d.features[0].properties.name
      console.log('county name',county)
       while (Math.abs(d.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += d.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      popup.setLngLat(coordinates).setHTML("<p>"+county+"</p>")
      .addTo(map);
  });
  map.on('mouseleave','state_line', function(){
      map.getCanvas().style.cursor='';
      popup.remove();
  })*/
});
        }.bind(this))
        console.log(this);
        
 

       
            
            
        
    },
    
    },
    mounted: function() {
        this.drawMap()
        this.drawMapBox()
    },

    

       

}
</script>

<style scoped>
svg>>> .states {
  fill: pink;
  stroke: #fff;
  stroke-linejoin: round;
}
svg>>> path:hover {
	fill-opacity: .5;
}

.legend {
        width:60px;
        margin-top:30px;
        background-color: #fff;
        border-radius: 3px;
        bottom: 30px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
        padding: 10px;
        position: relative;
        right: 10px;
        z-index: 1;
        }
         
        .legend h4 {
        margin: 0 0 10px;
        }
         
        .legend span {
        border-radius: 50%;
        
        height: 10px;
        margin-right: 5px;
        width: 10px;
        }
    #mapChart {
    position: relative;
    
    
   
    }

   
.mapboxgl-popup {
max-width: 400px;
font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
}

</style>

