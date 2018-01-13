// Data visualization assignment for CS 235
/* 
  Creates a map of USA and ties up the data for 
  leading causes of death yearwise with each state.
  
  dataset used: https://catalog.data.gov/dataset/age-adjusted-death-rates-for-the-top-10-leading-causes-of-death-united-states-2013
  description: data for 10 leading causes of death in USA since 1999-2015 with death toll and age adjusted death rate
  
  data sanitization: downloaded the native JSON and sanitized data by converting it into regular JSON format 
  using python script, attached both original(death_data.json) and new(causes_of_death.json) in the project. 
  Using causes_of_death.json
  
  Additional Libraries used: d3-svg-legend, d3-tooltip, datamaps.js, boostrap(CDN)

  Usage: Run `npm install` and then run npm start
  NOTE: ENSURE ACTIVE INTERNET CONNECTION FOR CDNs to work while running the application.
  open  localhost:8888 in browser to view the app.

  Data - Visualizations used:
  -> on map of US, color gradient showing highest to lowest death tolls in all states 
  -> tooltips on hover over the map showing the state specific details
  -> Clicking on state opens up a popup window showing diseases vs death rate in a bar graph
  -> year-wise overview on the left side of the canvas showing salient details for selected year
  -> Interactive changing of year

  Future Work/ Features to be implemented:
  -> Dynamic customizable Scatter plot between state vs year with each diseases represented as different colored circle
  -> and size of circle calculated based on death toll.


  Interesting insights from the current visualization, validating application's purpose:
  -> As we hover over the states and change years we notice that, during the 90s heart disease was the major cause of death
  since 2000s some states see an increased mortality rate due to cancer as cause of death which seems like an
  interesting trend. Possibly compare this data to pollution level data and carcinogens related data to actually
  get some valueable result. 

  Last Tested:
  23rd Oct, 2017
  
  Developed by: 
  Saketh Saxena for CS235 Homework 4
  
  */


// load all the data files, styles and d3 up front with
var style = require('./style.css');
var d3 = require('d3'),
d3tooltip = require('d3-tooltip'),
 d3legend = require('d3-svg-legend');
var data_obj = require('./causes_of_death.json');
var tooltip = d3tooltip(d3);

// datamaps.js library to genereate datamaps
// https://github.com/markmarkoh/datamaps
var Datamap = require("datamaps");

var data = [1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015];


// Appending values to dropdown menu
var select = d3.select('#inputContainer').append("label").attr("class","labelEl").text("Select Year")
                .append('select')
                .attr('class','selectEl')
                .on('change',draw);

var options = select
              .selectAll('option')
              .data(data)
              .enter()
              .append('option')
              .text(function (d) { return d; })
              .call(draw);


// clears current map and draws new svg by calling createmap
// each time year is changed
function draw() {
  var	selectValue = d3.select('select').property('value');
  d3.select('svg').remove();
  createMap(selectValue);
}


// Creates Map to visualize data and adds relevant values to overview table
// Called each time year is changed
function createMap(year)
{

  year = parseInt(year)
  var list_of_states=["Alaska","Alabama","Arkansas","American Samoa","Arizona","California","Colorado","Connecticut","District of Columbia","Delaware","Florida","Georgia","Guam","Hawaii","Iowa","Idaho","Illinois","Indiana","Kansas","Kentucky","Louisiana","Massachusetts","Maryland","Maine","Michigan","Minnesota","Missouri","Mississippi","Montana","North Carolina","North Dakota","Nebraska","New Hampshire","New Jersey","New Mexico","Nevada","New York","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Virginia","Virgin Islands","Vermont","Washington","Wisconsin","West Virginia","Wyoming"];
  var abbrv_obj = {"Alabama":"AL","Alaska":"AK","American Samoa":"AS","Arizona":"AZ","Arkansas":"AR","California":"CA","Colorado":"CO","Connecticut":"CT","Delaware":"DE","Columbia":"DC","Micronesia":"FM","Florida":"FL","Georgia":"GA","Guam":"GU","Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Marshall Islands":"MH","Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND","Northern Mariana Islands":"MP","Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Palau":"PW","Pennsylvania":"PA","Puerto Rico":"PR","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT","Virgin Islands":"VI","Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY"};
  var total_deaths = [];
  var total_deaths_map = {};


  // Creating list of total deaths for the year
  list_of_states.forEach(function(currstate){
    var deaths = 0;
    data_obj.forEach(function(element){
        if(element.state === currstate && element.cause_name !== "All Causes" && element.year === year){
          deaths+=element.deaths;
        }        
    });
    total_deaths.push(deaths);
  });

// Adding total death toll for the year to overview table
  d3.select("#tot").text(d3.sum(total_deaths));
  
  // Creating a normalized color scale, this function returns a color based on the domain and range
  var color = d3.scaleQuantile()
                .domain([d3.min(total_deaths),d3.max(total_deaths)])
                .range(['#a8bccc','#95a7b5','#82929e','#707d88','#5d6871','#4a535a','#383e44','#25292d']);


                

// Creating a map for fill colors
// computing state with highest death toll
var state = "";
var max_val = 0;
  list_of_states.forEach(function(currstate, idx){

    if(total_deaths[idx]>max_val){
      max_val = total_deaths[idx];
      state = currstate;
    }
    total_deaths_map[abbrv_obj[currstate]] = {
      'fillColor':function(){
      return color(total_deaths[idx]);
    }
    };
  });

// adding state with highest death toll for given year
d3.select("#highest_state").text(state);

// Calculating number of deaths per disease for given year
var disease_map = {};
var causes = [];
data_obj.forEach(function(element,idx){
  if(disease_map[element.cause_name] == null){
    disease_map[element.cause_name] = 0;
    causes.push(element.cause_name);
  }
  disease_map[element.cause_name] += parseInt(element.deaths);
});



// Computing highest cause of death for a given year
 max_val = 0;
 var cause = "";
causes.forEach(function(element){
  if(disease_map[element] > max_val && element !== "All Causes"){
    max_val = disease_map[element];
    cause = element;
  }
});

// Adding highest cause of death to overview table
d3.select("#reason").text(cause);


// datamap object to create map of USA
  var map = new Datamap({
    element: document.getElementById('mapContainer'),
    scope: 'usa',
    fills: {
      'defaultFill': '#1B1B2A',   
    },
    data : total_deaths_map,
    
    geographyConfig:{
    
      // display details on mouseover using a popup
      popupTemplate:function (geo, data) {
        var max_rate = 0;
        var cause = "";
        var deaths = 0;
        var total_deaths = 0;
        var average_death_rate = 0;
        var counter = 0;
        data_obj.forEach(function(element) {
          if (element.state === geo.properties.name && element.year === year && element.cause_name !== "All Causes")
          {
            total_deaths+=element.deaths;
            average_death_rate+=element.age_adjusted_death_rates;
            counter+=1;
            if(max_rate < element.age_adjusted_death_rates){
              max_rate =  element.age_adjusted_death_rates;
              cause = element.cause_name;
              deaths = element.deaths;
            }
          }});
        
        var popup = ['<div class="hoverinfo"><strong>' + geo.properties.name+' ('+year+')<br></strong> Total number of deaths : '+total_deaths +
        '<br> Average death rate : '+Math.round(average_death_rate/counter*100)/100+'<br><hr><strong> Highest cause of death : '+
        cause+'</strong><br> No. of deaths : '+deaths+'<br> Age-adjusted death rate : '+max_rate+'<br> <small><i>Click for more details</i></small></div>'];
        return popup;
      },
    },

    done: function(datamap) {

      var states = datamap.svg.selectAll('.datamaps-subunit');
      states.attr('data-toggle','modal').attr('data-target','#myModal');
      d3.select('#myModal').on('shown.bs.modal', function () {
        $('#myInput').focus();
      });
      // show detail view when state is clicked
      states.on('click', function(geography) {
        openDetailView(year,geography.properties.name);
      });

      // Turn cursor to pointer when mouse over the svg
      datamap.svg.on('mouseover',function(d){
        d3.select(this).style('cursor','pointer');
      });


// Add legend to map 
      var mysvg = d3.select("svg");
      mysvg.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(5,20)");
    
    var legendLinear = d3legend.legendColor()
      .shapeWidth(10)
      .cells(10)
      .orient('vertical')
      .labelAlign("start")
      .scale(color)
      .title("Number of deaths");

      mysvg.select(".legendLinear")
           .call(legendLinear);
    },
  });

}

// To open detail view when state in map is clicked
// creates modal, data object with relevant disease name and corresponding death rate
// and calls barplot() to create a bar chart
var openDetailView = function(year,state_name){
  d3.select(".modal-title").html("");
  d3.select(".modal-body").html("");
  
  var total_deaths = 0;
  var max_rate = 0;
  var cause_of_death = '';
  var max_deaths = 0;
  var average_death_rate = 0;
  var counter = 0;
  var curr_detail_obj = [];
  year = parseInt(year);

  data_obj.forEach(function(element,idx){
    if(element.state === state_name && element.year === year && element.cause_name !== "All Causes" ){
      total_deaths += element.deaths;
      average_death_rate += element.age_adjusted_death_rates;
      counter += 1;
      if(element.age_adjusted_death_rates > max_rate){
        max_rate = element.age_adjusted_death_rates;
        cause_of_death = element.cause_name;

      }
      curr_detail_obj.push({'cause':element.cause_name,  'death_rate':element.age_adjusted_death_rates});
    }
  });

  d3.select(".modal-title").html(state_name+" ("+year+") - Diseases vs Death Rates");
  d3.select(".modal-body").append("div").html("Highest Cause of death : "+cause_of_death+"<br> Age-adjusted death rate : "+max_rate+"<br> Total deaths : "+total_deaths+"<br> Average death Rate : "+Math.round(average_death_rate/counter*100)/100+"<hr>");
  barPlot(curr_detail_obj);

};

// bar graph showing disease vs death rates relationship for selected state
// in a given year
function barPlot(data){
  
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 100, left: 40},
width = 1000 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;


// set the ranges for x and y
var x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
var y = d3.scaleLinear()
      .range([height, 0]);


// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".modal-body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")");


// Scale the range of the data in the domains
x.domain(data.map(function(d) { return d.cause; }));
y.domain([0, d3.max(data, function(d) { return d.death_rate; })]);




// append the rectangles for the bar chart with tooltip
svg.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d.cause); })
  .attr("width", x.bandwidth())
  .attr("y", function(d) { return y(d.death_rate); })
  .attr("height", function(d) { return height - y(d.death_rate); })      
  .on("mouseover", function(d) {
    var html = d.cause+" "+d.death_rate;
    tooltip.html(html);
    tooltip.show();
  })
  .on("mouseout", function(){
  tooltip.html("");
  tooltip.hide();
}
);

// add the x Axis with rotated labels
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("y", 0)
  .attr("x", 9)
  .attr("dy", ".25em")
  .attr("transform", "rotate(45)")
  .style("text-anchor", "start");

  // add the y Axis
svg.append("g")
  .call(d3.axisLeft(y));

}




