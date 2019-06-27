// CONSTANTES POSITIONNEMENT
// ZONE1 : body and top cursors
// margin in panels
var margin = {top: 40, right: 40, bottom: 50, left: 40};
var padding_body  = {x: 40, y : 40} // Padding of the axis to not cross the axis
// Panel size
const w_main = 500; // Width and heigth of human body panel (including legend)
const h_main = 600;
const w_map = 500; // Width and height of human body
const h_map =  600 ;
const r_max = 50; 
const r_min = 3; // map r circle for draw in map
const w_legend = 50; // width and height of legend for human body
const h_legend = 600;
const w_lab = 250; // width and height of legend for human body
const h_lab = 20;

// ZONE 2 : trois graphes
var margin_graph = {top: 30, right: 50, bottom: 50, left: 60};

var margin_subChart = margin_graph
var corrections_stack = { demihistg: 15, demihistd: 15, bloclegende: 50}
var margin_histo_age_d_rate = margin_graph //{top: 20, right: 40, bottom: 100, left: 50};
var margin_line_chart = margin_graph // {top: 20, right: 40, bottom: 100, left: 50};
// zone utile au sein du svg hors legendes
const w_hist = 600; // width and height of histogram panel
const h_hist = 150;
const w_line = 600; // width and height of line chart panel
const h_line = 150;
const w_subChart = 600 - corrections_stack.demihistg - corrections_stack.demihistd;
const h_subChart = 200;

// Define ages category
var agesList = ['Y_LT1', 'Y1-4', 'Y5-9', 'Y10-14', 'Y15-19', 'Y20-24', 'Y25-29', 'Y30-34',
'Y35-39', 'Y40-44', 'Y45-49', 'Y50-54', 'Y55-59', 'Y60-64', 'Y65-69', 'Y70-74',
'Y75-79','Y80-84','Y_GE85'];
var agesList2 = ['Y0-1', 'Y01-4', 'Y05-9', 'Y10-14', 'Y15-19', 'Y20-24', 'Y25-29', 'Y30-34',
'Y35-39', 'Y40-44', 'Y45-49', 'Y50-54', 'Y55-59', 'Y60-64', 'Y65-69', 'Y70-74',
'Y75-79','Y80-84','Y_GE85'];

// recup des labels issus du code dans le index.html
var ageLabelsList = [];
for (var key in dict_lab_age) {
        ageLabelsList.push( dict_lab_age[key] );
}



// Data for legend size
let bubble_legend_values = [
	{ value : 0.1, label : "0.1"+ "\u2030" 	},
	{ value : 1., label : "1" + "\u2030" 	},
	{ value : 5., label : "5" + "\u2030" 	},
	{ value : 25., label : "25" + "\u2030"	},
];


// CREATION DES SVG
// Main SVG Panel
var svg_body = d3.select("#human-body")
				.append("svg")
				.attr("width", w_map)
				.attr("height", h_map)
				.attr("class", "humanbody")
            	.attr("id",'human-body-svg');

// SVG Panel for the human-bodylegend
var svg_legend  = d3.select("#human-body")
					.append("svg")
					.attr("class", "map-legend")
					.attr("id","map-legend")
					.attr("width", w_legend)
					.attr("height", h_legend)
					.attr("transform", "translate(0,0)")
// SVG Panel for icons legends
var svg_sex_selector  = d3.select("#cc-selector-text")
					.append("svg")
					.attr("width", w_lab)
					.attr("height", h_lab)
					.attr("transform", "translate(-75,10)")
// SVG Panel for the population histogram
var svg_stacked_ICD = d3.select("#stacked_ICD_age")
                    .append("svg")
                    .attr("width", w_subChart  + margin_subChart.left + margin_subChart.right + corrections_stack.demihistg + corrections_stack.demihistd + corrections_stack.bloclegende)
                    .attr("height", h_subChart + margin_subChart.top + margin_subChart.bottom);
					// TBD ajouter class ? id ?
					

// SVG Panel for the population histogram
var svg_histo_age_d_rate = d3.select("#histogram-age-d_rate")
				  	.append("svg")
					.attr("width", w_hist + margin_histo_age_d_rate.left + margin_histo_age_d_rate.right)
					.attr("height", h_hist + margin_histo_age_d_rate.top + margin_histo_age_d_rate.bottom)
					.attr("class", "histogram_age")
					.attr("id",'histogram-age-d_rate')
					//.attr("transform", "translate(30,10)"); //ICILA

// SVG Panel for the line chart					
var svg_line_chart = d3.select("#line_chart")
				  	.append("svg")
					.attr("width", w_line + margin_line_chart.left + margin_line_chart.right)
					.attr("height", h_line + margin_line_chart.top + margin_line_chart.bottom)
					.attr("class", "line_death") 
					.attr("id",'line_chart');



// HTML Tag for tooltip
var div_tooltip = d3.select("body")
					.append("div")
					.attr("class","tooltip")
					.attr("color","grey")
					.attr("fill-opacity","0")
					.attr("id",'id-tooltip');

var inputElems = d3.selectAll("input");

function moveTopCursor(id){
	document.getElementById("gdskill1").value = id;
	getLabelAge(id);
	param_age=dict_lab_age[id];
	update_map(param_age,param_sex,param_organ);
	update_map_histo_age_d_rate(param_age,param_sex,param_organ,param_icd10);
	update_map_line_chart(param_age,param_sex,param_organ,param_icd10);
	update_map_stack_chart(param_age,param_sex,param_organ);
}

function inputChange() {
      //console.log(this.value);   // ** Highlight this.value **
      //console.log(this.name); 
      param_age = document.getElementById("hid_age").value;
      param_sex = document.querySelector('input[name="sex"]:checked').value;
      //param_sex = document.getElementById("sex").value;
      if (this.name=="sex") {
      	//console.log("1. traitement sex")
      	//console.log(this.name);  
      	//console.log(this.value);
      	//param_sex = this.value;
      	//console.log("1.1 param_age")
        tag = document.getElementById('human-body-svg');
        if (this.value=='F'){
                tag.style.backgroundImage = "url('images/body3f.png')";
        } else {
                tag.style.backgroundImage = "url('images/body3.png')";
        }

      }
      if (this.name=="gdskill1")
      { 	
      	//document.getElementById("sex").value;
      	//d3.select("hid_age").value
      	//param_age = getLabelAge2(d3.select(this.value))
      	//console.log("2. traitement age")
      	//console.log(this.name);  
      	//draw_map(getLabelAge2(this.value),"M");
      }
      //console.log("3. Before update drawing")
      console.log("params age sex org :",param_age,param_sex,param_organ); 
      //draw_map_axis();
      update_map(param_age,param_sex,param_organ);
      update_map_histo_age_d_rate(param_age,param_sex,param_organ,param_icd10);
      update_map_line_chart(param_age,param_sex,param_organ,param_icd10);
      update_map_stack_chart(param_age,param_sex,param_organ);
      //draw_legend_color();
      //draw_legend_bubble();
  }
  
inputElems.on("change", inputChange);

// when the input range changes update the circle 

var param_sex = document.querySelector('input[name="sex"]:checked').value;

//d3.select("sex").value
// console.log(param_sex); 
var param_age = document.getElementById("hid_age").value;
var param_year = 2008;
var param_icd10_hierarchy = "0";
var param_icd10 = "ALL";
var param_organ = "TOTAL";
var param_labelcause = "ALL";
//d3.select("hid_age")
//console.log(param_age); 
var b_selection_body=false

// define a SVG gradient element (CAREFUL if change , need to change the draw_legend_color accordingly)
var fColor_f = d3.scaleLinear().domain([0,0.2,0.5,1.,5.,15.])
  .range(["#E212F7","#E212F7"]) // "#942177" #DA4BC7","#DA4BC7","#DA4BC7", "#E212F7","#E212F7","#E212F7

var fColor_m = d3.scalePow().domain([0,0.2,0.5,1.,5.,15.])
  .range(["#F1F661","#DCE238","#DCE238", "#DCE238","#E2E818","#E2E818"]) // "#942177"
var fColor = "#E212F7"
var mColor = "#F1F661"

var age_selected_color = "#00ff00" //"#0202EE"



// Data load
d3.tsv("data/human_body.tsv")
	.row((d,i)=> {
		return {
			AGE: d.AGE,
			AGE_LABEL : d.AGE_LABEL,
			AGE_HIERARCHY: d.AGE_HIERARCHY,
			AGE_PARENT: d.AGE_PARENT,
			SEX: d.SEX,
			SEX_LABEL: d.SEX_LABEL,
			SEX_HIERARCHY : d.SEX_HIERARCHY,
			TIME: +d.TIME,
			ICD10_HIERARCHY: d.ICD10_HIERARCHY,
			ICD10_PARENT: d.ICD10_PARENT,
			ICD10: d.ICD10,
			ICD10_LABEL: d.ICD10_LABEL,
			Organ : d.Organ,
			Nb_death: +d.Nb_death,
			Pop: +d.Pop,
			Death_Rate: +d.Death_Rate,
			longitude: +d.x,
			latitude: +d.y,
            // Add for stacked ICD
            Sum_death_in_cat: +d.Sum_death_in_cat,
            ratio: +d.Nb_death / d.Sum_death_in_cat
		};
	})
	.get((error,rows) => {

		if (rows.length > 0){ // Data loaded succesfully

                let frows = rows.filter((row) => (//row.Death_Rate != 0 &&  // 
			!isNaN(row.Death_Rate) && !isNaN(row.longitude) && !isNaN(row.latitude) ));
                dataset = frows;
                // console.log(d3.extent(dataset, (row)=> row.longitude))
				// console.log("dataset:", dataset);
				//////////// For human body
                draw_map_axis();
                // console.log("Draw map appelée au chargement")
                draw_map(param_age,param_sex);
                draw_legend_bubble();
                draw_text_selector(param_sex);
		// No STACK ON FIRST OPENING, WAIT FOR ORGAN SELECTION
                //draw_stacked_ICD(param_age,param_sex,param_organ);
		}
	});

// Data load for Design 2 Zone 2
d3.tsv("data/human_body_v3.tsv")
	.row((d,i)=> {
		return {
			AGE: d.AGE,
			AGE_LABEL : d.AGE_LABEL,
			AGE_HIERARCHY: d.AGE_HIERARCHY,
			AGE_PARENT: d.AGE_PARENT,
			SEX: d.SEX,
			SEX_LABEL: d.SEX_LABEL,
			SEX_HIERARCHY : d.SEX_HIERARCHY,
			TIME: +d.TIME,
			ICD10_HIERARCHY: d.ICD10_HIERARCHY,
			ICD10_PARENT: d.ICD10_PARENT,
			ICD10: d.ICD10,
			ICD10_LABEL: d.ICD10_LABEL,
			Organ : d.Organ,
			Nb_death: +d.Nb_death,
			Pop: +d.Pop,
			Death_Rate: +d.Death_Rate,
			longitude: +d.x,
			latitude: +d.y,
			// Add for stacked ICD
            Sum_death_in_cat: +d.Sum_death_in_cat,
            ratio: +d.Nb_death / d.Sum_death_in_cat
		};
	})
	.get((error,rows) => {

		if (rows.length > 0){ // Data loaded succesfully

                let frows = rows.filter((row) => (!isNaN(row.Death_Rate)));
                dataset_histo_age_d_rate = frows;

                // console.log("Draw map histo_age_d_rate appelée au chargement")
                update_map_histo_age_d_rate(param_age,param_sex,param_organ,param_icd10);
		update_map_line_chart(param_age,param_sex,param_organ,param_icd10);
		}
	});

/*********************************************************************************************************/
/****************************************** Human body ***************************************************/
/*********************************************************************************************************/
function draw_map_axis(){

	// Scales for human body
	xScale_map = d3.scaleLinear()
					.domain([177,351])
					.range([-50,150]);
	
	
	yScale_map = d3.scaleLinear()
					.domain([500,350])
					.range([130,400]);
					

} // Define and draw the human body axis

function draw_map(param_age,param_sex) {
	console.log("draw map appelée ******************")
	// console.log(param_age)
	// console.log(param_sex)
	var newData = dataset.filter(function(d) { return (( d.Nb_death !=='0' && d.Organ !=='None' && d.ICD10_HIERARCHY === param_icd10_hierarchy && d.AGE_LABEL === param_age && d.SEX===param_sex && d.TIME==param_year)) });
	drScale =  d3.scalePow()
						.exponent(0.25)
						.domain([0.01,50])
						.clamp(true)
						.range([r_min,r_max]); // Scale circle size based on population and power law distribution

	dr2Scale = d3.scalePow()
					.domain(d3.extent(dataset, (row)=> row.Death_Rate)) // +1 therefore if density close to 0, Log value goes top 0 as well
					.range([1,r_max]); // Scale gradient color based on log density
	dr3Scale = d3.scalePow()
					.exponent(0.5)
					.clamp(true)
					.domain([0.1,3]) //(d3.extent(dataset, (row)=> row.Death_Rate)+1) // +1 therefore if density close to 0, Log value goes top 0 as well
					.range([0.4,0.9]);
	// console.log("Drawing params")
	// console.log(param_age)
	// console.log(param_sex)

	svg_body.selectAll("circle")
		.data(newData.sort(function(a,b) {return b.Death_Rate - a.Death_Rate;}) , function(d) { return d.longitude + "|"+d.latitude;})
		.enter()
		.append("circle")
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut)
		.attr("r",(d) => drScale(d.Death_Rate))
		.attr("cx", (d) => xScale_map(d.longitude))
		.attr("cy", (d) => yScale_map(d.latitude))
		.attr("class","circles_data")
		.attr("fill",mColor)//(d)=> fColor_f(dr2Scale(d.Death_Rate))) // dr2Scale(d.density))
		.attr("fill-opacity",(d)=>dr3Scale((1/(d.Death_Rate+0.5))))
		.attr("transform","translate(" + (180) + ","+ (margin.top + padding_body.y) +")")
		.attr("stroke","none")
		.on("click", function(d){
			console.log("Evt click entrée")
			if (!d3.select(this).classed("selected") ){
				console.log("Evt click change organe")
				d3.selectAll(".circles_data").transition().attr("fill",mColor)
   				d3.select(this).classed("selected", true)
	 			d3.select(this).transition().attr("fill",age_selected_color);
	 			b_selection_body = true;
	 			//tooltip_format(d3.select(this),0,"#00ff00")
  			}
  			else {
				console.log("Deselectionne organe")
   				d3.select(this).classed("selected", false);
   				d3.select(this).transition().attr("fill",mColor);
   				b_selection_body = false;
				delete_stack();
   			}
   			on_click_organ(d.Organ);
		})
}

function update_map_stack_chart(param_age,param_sex,param_organ) {
	// pas de strategie de transition
	delete_stack()
	if (param_organ !== 'TOTAL' ) {
		draw_stacked_ICD(param_age,param_sex,param_organ);}
}

function update_map(param_age,param_sex) {
	//rejoin data
	//svg_body.remove();
	console.log("Redrawing3 ***********************")
	// console.log(param_age)
	// console.log(param_sex)
	var newData = dataset.filter(function(d) { return ((d.Nb_death !=='0' && d.Organ !=='None' && d.ICD10_HIERARCHY === param_icd10_hierarchy && d.AGE_LABEL === param_age && d.SEX===param_sex && d.TIME==param_year)) });
	// console.log(newData);
	
	if (param_sex == 'M') {
		color_tr = fColor_m
		color_d = mColor
		color_legend = "#939710"
    }
	else {
        color_tr = fColor_f
        color_d = fColor
        color_legend = "#9B08A9"
	}
	var circle = svg_body.selectAll("circle")
                       .data(newData, function(d) { return d.longitude + "|"+d.latitude;});
                    
    circle.exit().remove();//remove unneeded circles
    circle.enter().append("circle")
        .attr("r",(d) => drScale(d.Death_Rate));
        
	//update all circles to new positions
    circle.transition()
    	.duration(2000)
    	.ease(d3.easeQuad,4)
		.attr("r",(d) => drScale(d.Death_Rate))
		.attr("cx", (d) => xScale_map(d.longitude))
		.attr("cy", (d) => yScale_map(d.latitude))
		.attr("fill",color_d)//(d)=> fColor_f(dr2Scale(d.Death_Rate))) // dr2Scale(d.density))
		.attr("fill-opacity", (d)=>dr3Scale((1/(d.Death_Rate+0.5))))
		.attr("transform","translate(" + (180) + ","+ (margin.top + padding_body.y) +")")
		.attr("stroke","none")
		.attr("class","circles_data")
	circle
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut)
		.on("click", function(d){
			console.log("Evt click entrée")
			if (!d3.select(this).classed("selected") ){
				console.log("Evt click ok")
				d3.selectAll(".circles_data").transition().attr("fill",color_d)
				//div_tooltip.transition()
			   	//	.style("opacity","0");
   				d3.select(this).classed("selected", true);
	 			d3.select(this).transition().attr("fill","#00ff00");
	 			//tooltip_format(d3.select(this).d,0,"#00ff00");
	 			b_selection_body = true;
  			}
  			else {
   				d3.select(this).classed("selected", false);
   				d3.select(this).transition().attr("fill",color_d);
   				b_selection_body = false;
   				div_tooltip.transition()
			   		.duration(2000)
			   		.style("opacity","0");
   			}
   			on_click_organ(d.Organ);
	 		
		})
    // Legend update
    draw_legend_bubble()
    draw_text_selector(param_sex)

}

function on_click_organ(param_organ_new){	
	if (b_selection_body) {
		console.log("selected confirmed")
		param_organ = param_organ_new;
		param_icd10 = "ALL"
	}
	else { 
		console.log("selection denied")
		param_organ = "TOTAL";
	}
	console.log("param_organ = " + param_organ)

	update_map_histo_age_d_rate(param_age,param_sex,param_organ,param_icd10);
	update_map_line_chart(param_age,param_sex,param_organ,param_icd10);
	update_map_stack_chart(param_age,param_sex,param_organ);
}

function delete_stack(){
	svg_stacked_ICD.selectAll("*").remove();
}

function draw_text_selector(param_sex){
	// console.log("On y est")
        
	pos_y = 10
	pos_x_m = 70//38
	pos_x_f = 174//142
	dsp_text_m = "Male"
	dsp_text_f = "Female"
	if (param_sex == 'M') {
		color_legend_m = fColor_m
		color_legend_f = "#3d3d5c"
	}
	else {
		color_legend_m = "#3d3d5c"
		color_legend_f = fColor_f
	}
 
	svg_sex_selector.selectAll("text").remove()
	svg_sex_selector
		.append("text")
        .attr("x", function(d, i){
                xText = pos_x_m; // Female (140,10), Male (38,10)
                return xText;
              })             
        .attr("y",function(d){
                yText = pos_y;
                return yText;
              })
        //.attr("text-anchor", "middle") 
        .text(dsp_text_m)
        .attr("stroke", "none")
        .attr("stroke-width", "0.0001px")
        .style("fill",color_legend_m)
		.style("font-family","'Source Sans Pro', sans-serif")
		.attr("font-weight",50)
		.attr("font-size","12px");
	svg_sex_selector
		.append("text")
        .attr("x", function(d, i){
                xText = pos_x_f; // Female (140,10), Male (38,10)
                return xText;
              })             
        .attr("y",function(d){
                yText = pos_y;
                return yText;
              })
        //.attr("text-anchor", "middle") 
        .text(dsp_text_f)
        .attr("stroke", "none")
        .attr("stroke-width", "0.0001px")
        .style("fill",color_legend_f)
		.style("font-family","'Source Sans Pro', sans-serif")
		.attr("font-weight",50)
		.attr("font-size","12px");
	
                            
        //.attr("transform", "translate(" + xText + "," + yText + ") rotate(90)")
}
function draw_legend_bubble(){

	let y_padding = (padding_body.y*2 + 50)//+ h_rect + 100
	if (param_sex == 'M') {
		color_legend = "#939710"
    }
	else {
        color_legend = "#9B08A9"
	}
	// draw circles
	svg_body.
		selectAll("legend")
		.data(bubble_legend_values)
		.enter()
		.append("circle")
			.attr("cx", 50)//padding_body.x+5)
			.attr("cy", (d) => y_padding-drScale(d.value))
			.attr("r", (d)=> drScale(d.value))
		.attr("fill","none")
		.attr("stroke",color_legend);

	// draw dashed lines
	svg_body
	  .selectAll("legend")
	  .data(bubble_legend_values)
	  .enter()
	  .append("line")
		.attr('x1', 50)
		.attr('x2', 90) //(d) => padding_body.x + 25 //+ drScale(d.value))
		.attr('y1', (d) => y_padding -drScale(d.value)*2 )
		.attr('y2', (d) => y_padding -drScale(d.value)*2 )
		.attr('stroke', 'white')
		.style('stroke', ('2,2'));

	// draw legend text
	svg_body
	  .selectAll("legend")
	  .data(bubble_legend_values)
	  .enter()
	  .append("text")
		.attr("x", padding_body.x + 55) //(d) => padding_body.x + 15 +  drScale(d.value))
		.attr("y", (d)=> y_padding - drScale(d.value)*2 )
		.text((d)=> d.label)
        .style("fill","white")
        .attr("stroke-width", "0.0001px")
		.style("font-family","'Source Sans Pro', sans-serif")
		.attr("font-size","11px");
	svg_body
		.append("text")
        .attr("x", padding_body.x-25)             
        .attr("y", y_padding - drScale(25.)*2.5)
        //.attr("text-anchor", "middle") 
        .text("Death rate")
        .attr("stroke", "none")
        .attr("stroke-width", "0.0001px")
        .style("fill","white")
		.style("font-family","'Source Sans Pro', sans-serif")
		.attr("font-weight",50)
		.attr("font-size","12px") 
        .style("text-decoration", "underline") ;

}

function handleMouseOver(d, i) {
        div_tooltip.transition()
                   .duration(0)
                   .style("opacity","0");
        tooltip_format(d,i,"#cdd0d4")
}

function handleMouseOut(d, i) {
		div_tooltip.transition()
			   .duration(2000)
			   .style("opacity","0");
}

/*********************************************************************************************************/
/****************************************** Death Rate Design 2 Zone 2 ***********************************/
/*********************************************************************************************************/

function update_map_histo_age_d_rate(param_age,param_sex,param_organ,param_icd10){
	console.log("update map histo_age_d_rate")

	svg_histo_age_d_rate.attr("transform", "translate(" + margin_histo_age_d_rate.left + ","+ margin_histo_age_d_rate.top + ")")
	svg_histo_age_d_rate.selectAll("*").remove();

	xChart = d3.scaleBand().range([0, w_hist]);	
	yChart = d3.scaleLinear().range([h_hist, 0]);
	
	var newData_histo_age_d_rate = dataset_histo_age_d_rate.filter(function(d) { return ((d.Organ === param_organ && d.SEX===param_sex 
									&& d.TIME==param_year && d.AGE!=="TOTAL" && d.ICD10 === param_icd10)) });
	var max_y_domain = d3.max(newData_histo_age_d_rate, function(d){ return +d.Death_Rate;})

	//set domain for the x, y axis
	xChart.domain(newData_histo_age_d_rate.map(function(d){ return d.AGE; }) );
	yChart.domain([0, max_y_domain]);
	
	//get the width of each bar 
	var barWidth = w_hist / newData_histo_age_d_rate.length;
	console.log("updating histogram")


	//now actually give each rectangle the corresponding data
	var nodes = svg_histo_age_d_rate.selectAll("g")
		//.remove()
		//.exit()
		.data(newData_histo_age_d_rate)
		.enter()
		.append("g")
		.on("click", function(d){
                        console.log("click rect histogramme ",d.AGE_LABEL);
                        moveTopCursor(ageLabelsList.indexOf(d.AGE_LABEL))
                }); // on click commun au groupe des 2 rectangles : le "jaune" et aussi le transparent au dessus sinon on n'a pas assez de place pour cliquer

	nodes.append("rect")
		.attr("class", "bar")
		.attr("transform", "translate(" + margin_histo_age_d_rate.left + "," 
										+ margin_histo_age_d_rate.top + ")")
		.attr("x", function(d, i){ return i * barWidth + 1 })
		.attr("y", function(d){ return yChart( d.Death_Rate); })
		.attr("height", function(d){ return h_hist - yChart(d.Death_Rate); })
		.attr("width", barWidth - 1)
		.attr("fill", function(d, i){ 
			// console.log("Age = " + d.AGE_LABEL)
			// console.log("Death_Rate = " + d.Death_Rate)
			//console.log("SEX", )
			if(param_age === d.AGE_LABEL){
				return age_selected_color
			}
			else{
				if(param_sex === "M"){
					return mColor;
				}else{
					return fColor;
				}
			}
			
                })
                
	nodes.append("rect")
                .attr("class", "bar")
                .attr("transform", "translate(" + margin_histo_age_d_rate.left + "," + margin_histo_age_d_rate.top + ")")
                .attr("x", function(d, i){ return i * barWidth + 1 })
                .attr("y", 0)//function(d){ return h_hist - yChart( d.Death_Rate); })
                .attr("height", function(d){ return yChart(d.Death_Rate) - 2; })
                .attr("width", barWidth - 1)
                .attr("fill", 'transparent')


        //set up axes
        chart = svg_histo_age_d_rate
        //        .attr("transform", "translate(" + margin_histo_age_d_rate.left + "," + margin_histo_age_d_rate.top + ")");

	// left axes
	var yAxis = d3.axisLeft(yChart);

	chart.selectAll(".yAxis")
		.selectAll("g")
		.remove()
		.exit()
	chart.append("g")
		.attr("class", "yAxis")
		.attr("transform", "translate(" + margin_histo_age_d_rate.left + "," + margin_histo_age_d_rate.top + ")")
		.call(yAxis.ticks(6) )//.tickFormat(d3.format(".0s")))

        //bottom axis
        var xAxis = d3.axisBottom(xChart);

	chart.selectAll(".xAxis")
                .selectAll("g")
                .remove()
                .exit()
        chart.append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(" + margin_histo_age_d_rate.left + ","
                                                                                + (margin_histo_age_d_rate.top + h_hist) + ")")
                .call(xAxis)
                .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("transform", function(d){
                                return "rotate(-65)";
                        });

	var txt = "all causes"
        if(param_icd10 !== 'ALL' ){txt = "ICD10 " + param_icd10}

	chart.append("text")
                .attr("transform", "translate(15," +  h_hist + ") rotate(-90)")
                .text("Death rate (‰)");
	chart.append("text")
                .attr("transform", "translate(" + (w_hist/4 ) + "," + (margin_histo_age_d_rate.top/2)+ ")") // (h_hist/4) + ")")
                .text("Death rate per age group for " + txt);




}

/*********************************************************************************************************/
/****************************************** Death Rate Design 2 Zone 3 ***********************************/
/*********************************************************************************************************/

function update_map_line_chart(param_age,param_sex,param_organ,param_icd10) {

	console.log("draw map line chart appelée ******************")

	svg_line_chart.attr("transform", "translate(" + margin_line_chart.left + ","+ margin_line_chart.top + ")")
	svg_line_chart.selectAll("*").remove();
	

	var newData_line_chart = dataset_histo_age_d_rate.filter(function(d) { return ((d.Organ === param_organ && 
		d.AGE_LABEL===param_age && d.SEX===param_sex && d.ICD10 === param_icd10)) });

	var max_y_domain_line_chart = d3.max(newData_line_chart, function(d){ return +d.Death_Rate;})
	var min_y_domain_line_chart = d3.min(newData_line_chart, function(d){ return +d.Death_Rate;})

	//set range domain for the x, y axis
	xChart_line_chart = d3.scaleLinear().range([0, w_line]);	
	yChart_line_chart = d3.scaleLinear().range([h_line, 0]);

	xChart_line_chart.domain([d3.min(newData_line_chart, function(d){ return +d.TIME;}),
							  d3.max(newData_line_chart, function(d){ return +d.TIME;})]);
	yChart_line_chart.domain([min_y_domain_line_chart, max_y_domain_line_chart]);
	
	// console.log("updating line chart")
	// console.log("Nb value = " + newData_line_chart.length)
	// console.log("param_sex : " + param_sex)
	
	//now actually give each rectangle the corresponding data
	var line = d3.line()
    .x(function(d) { return xChart_line_chart(d.TIME); }) // set the x values for the line generator
    .y(function(d) { return yChart_line_chart(d.Death_Rate); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

	//Bind the dataset with the line generator
	svg_line_chart.selectAll(".line")
		.remove()
		.exit()
	svg_line_chart.append("g")
		.append("path")
		.datum(newData_line_chart)
		.attr("transform", "translate(" + margin_line_chart.left + "," 
										+ margin_line_chart.top + ")")
		.attr("class", "line")
		.attr("d", line)
		.attr("stroke", function(d){ 
			if(param_sex === "M"){
				return mColor;
			}else{
				return fColor;
			}
		})
		.attr("stroke-width", 5)

	// Circle for each datapoint
	svg_line_chart.selectAll(".dot")
		.remove()
		.exit()
		.data(newData_line_chart)
		.enter()
		.append("circle")
		.attr("class", "dot")
		.attr("transform", "translate(" + margin_line_chart.left + "," 
										+ margin_line_chart.top + ")")
		.attr("cx", function(d) { return xChart_line_chart(d.TIME) })
		.attr("cy", function(d) { return yChart_line_chart(d.Death_Rate) })
		.attr("r", 5)
		.attr("fill", function(d){ 
			if(param_sex === "M"){
				return mColor;
			}else{
				return fColor;
			}
		});

	
	// LES AXES

	chart_line_chart = svg_line_chart
	//.attr("transform", "translate(" + margin_line_chart.left + "," + margin_line_chart.top + ")");

	var xAxis_line_chart = d3.axisBottom(xChart_line_chart);
	var yAxis_line_chart = d3.axisLeft(yChart_line_chart);

	//set up axes
	//left axis
	chart_line_chart.selectAll(".yAxis_line_chart")
		.selectAll("g")
		.remove()
		.exit();

	chart_line_chart.append("g")
		.attr("class", "yAxis_line_chart")
		.attr("transform", "translate(" + (margin_line_chart.left ) + "," + margin_line_chart.top + ")")
		.call(yAxis_line_chart.ticks(6) );//.tickFormat(d3.format(".0")));

        //bottom axis
        chart_line_chart.selectAll(".xAxis_line_chart")
		.selectAll("g")
                .remove()
                .exit();
	
	chart_line_chart.append("g")
                .attr("class", "xAxis_line_chart")
                .attr("transform", "translate(" + margin_line_chart.left + ","
                                                                                + (margin_line_chart.top + h_line) + ")")
                .call(xAxis_line_chart.ticks(8).tickFormat(d3.format("0")));
                        
        //add labels
        chart_line_chart.append("text")
               .attr("transform", "translate(15 ," +  h_line + ") rotate(-90)")
               .text("Death rate (‰)");
               
	var txt = "all causes"
	if(param_icd10 !== 'ALL' ){txt = "ICD10 " + param_icd10}
 
        chart_line_chart.append("text")
                .attr("transform", "translate(" + (w_line/4 ) + "," + (margin_line_chart.top/2)+ ")") // (h_line/4) + ")")
	.text("Death rate evolution per year for "+ txt );

		
}




/************************************* UTILITIES ***********************************************/
// format thousandsx
function tooltip_format(d,i,color) {
		console.log(d.longitude,d.latitude,d.Organ)

//290 330 Prostate human-body.js:848:11
//265 330 Genitourinary system human-body.js:848:11
//310 300 Lymphatic system
//295 400 Stomach human-body.js:848:11
//290 450 Heart human-body.js:848:11
//278 490 Oesophagus
//415 375 Skin
	
		div_tooltip.transition()
				.duration(800)
				.style("opacity", .9);

        str_html_1 = "<tr><td align=\"right\">"
        str_html_2 = "Organ: </td><td style=\"white-space:nowrap;\">" + d.Organ + "</td></tr>"
                + "<tr><td align=\"right\">Year: </td><td>"+ d.TIME + "</td></tr>"
                + "<tr><td align=\"right\">Death rate: </td><td>" + d.Death_Rate.toFixed(2) + "&#8240;</td></tr>"
                + "<tr><td align=\"right\">Number of death : </td><td>" + humanizeNumber(d.Nb_death) + "</td></tr>"
                + "<tr><td align=\"right\">Ref. Population : </td><td>" + humanizeNumber(d.Pop) + "</td></tr></table>";

	div_tooltip.style("width",820-d.longitude)
        if (d.longitude > 350){
            str_html = "<table class =\"tab_tooltip\" style=\"border-bottom: 1px solid " + color + ";\">" + str_html_1 + "&nbsp;".repeat((520-d.longitude)/2) + str_html_2
                    div_tooltip
                        .html(str_html)
                        .style("color",color)
                        .style("left", (xScale_map(d.longitude) + 350) + "px" ) /////DECA was 197
                        .style("top", (yScale_map(d.latitude) + 195) + "px");
        }
        else {
        	if (d.latitude<490){
	    str_html = "<table class =\"tab_tooltip\" style=\"border-bottom: 1px solid " + color + ";\">" + str_html_1 + "&nbsp;".repeat((520-d.longitude)/2) + str_html_2
                    div_tooltip
                        .html(str_html)
                        .style("color",color)
                        .style("left", (xScale_map(d.longitude)+ 380) + "px" )
                        .style("top", (yScale_map(d.latitude) + 195) + "px");
            } else { 
		// 
                // (d.latitude<490 && d.longitude<350 )
                str_html = "<table class =\"tab_tooltip\" style=\"border-top: 1px solid " + color + ";\">" + str_html_1 + "&nbsp;".repeat((520-d.longitude)/2) + str_html_2
                div_tooltip
                    .html(str_html)
                    .style("left", (xScale_map(d.longitude)+380) + "px" )
                    .style("top", (yScale_map(d.latitude)+315)+ "px");
            }
        }
}
function humanizeNumber(n) {
  n = n.toString()
  while (true) {
    var n2 = n.replace(/(\d)(\d{3})($|,|\.)/g, '$1,$2$3')
    if (n == n2) break
    n = n2
  }
  return n
}

/*********************************************************************************************************/
/********************************* START Stacked Chart ICD ***********************************************/
/*********************************************************************************************************/


// append the svg object to the body of the page
function draw_stacked_ICD(param_age,param_sex,param_organ) {
	// svg_stacked_ICD.attr("transform", "translate(" + (margin_subChart.left + corrections_stack.demihistg) + "," + margin_subChart.top + ")");
svg_stacked_ICD.attr("transform", "translate(" + margin_subChart.left + "," + margin_subChart.top + ")");

// add title    
svg_stacked_ICD.append("text")
.attr("x", (w_subChart / 2))             
.attr("y", margin_subChart.top/2)
.attr("text-anchor", "middle")
.style("font-size", "15px")
.text(param_organ+ ": Repartition of death accross the ages");
					
	// Add X axis
	var x_ch1 = d3.scalePoint()
			.domain(agesList)
			.range([ 0, w_subChart ]);
	var x_ch2 = d3.scalePoint()
                        .domain(agesList2)
                        .range([ 0, w_subChart ]);

	function L22L1(entree){
		return agesList2[agesList.indexOf(x_ch1(entree))]
	};


	svg_stacked_ICD.append("g")
			.attr("transform", "translate(" + (margin_subChart.left + corrections_stack.demihistg)  + "," + (h_subChart + margin_subChart.top) + ")")
			.call(d3.axisBottom(x_ch2))//L22L1))
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", function(d){
				return "rotate(-65)";
			})

			// Add Y axis
	var y_ch1 = d3.scaleLinear()
			.domain([0, 1.])
			.range([h_subChart, 0]);
	svg_stacked_ICD.append("g")
	.attr("transform", "translate(" + (margin_subChart.left)  + "," + margin_subChart.top + ")")
	.call(d3.axisLeft(y_ch1));
	svg_stacked_ICD.append("text")
			.attr("transform", "translate( 15 ," +  (h_subChart) + ") rotate(-90)")
			//.attr("transform", "translate(" + (margin_subChart.left - 30) + "," +  (h_subChart) + ") rotate(-90)")
			.style("font-size", "15px")
			.text("Share of a death cause");

	console.log("draw_stacked appelée ******************")
//	console.log(param_age)
	// console.log(param_sex)
	var filteredData = dataset.filter(function(d) { return (d.Organ==param_organ && d.SEX==param_sex && 
            d.TIME==param_year && d.AGE !="TOTAL" && d.ICD10 !== "ALL") });

	// console.log("filteredData: ", filteredData);
	
	var nest = d3.nest()
	.key(function(d) { return d.ICD10; })
	.entries(filteredData);
	// console.log("nest: ", nest);

    // Get ICD10 uniques
    var headerNames = d3.values(nest).map(function(d) { return d.key; });
		// console.log("headerNames", headerNames);
		var idxALL = headerNames.indexOf("ALL");
		// console.log("idxALL: ", idxALL)
		if (idxALL > -1) {
			headerNames.splice(idxALL, 1);
		}
		// console.log(headerNames);

    // Transform data from nested to pivot table (code adapted from 
    // https://stackoverflow.com/questions/19757638/how-to-pivot-a-table-with-d3-js)
		var nestNew = d3.nest()
		.key(function(d) { return d.AGE; }).sortKeys(function(a,b) { return agesList.indexOf(a) - agesList.indexOf(b); })
		.rollup(function(newVar) {     
				var mkKey = function (c, v) {
						return {
							name: c,
							value: v
						};
				}
				var pivoted = newVar.map(function (d) { return mkKey(d.ICD10, d.ratio); });
				return Array.prototype.concat.apply([], [pivoted]);
		})
		.entries(filteredData);
// console.log("nestNew: ", nestNew);

var pivotedData = [];

nestNew.forEach(function (kv1) {
	var d = kv1.key;
			var obj = {
				AGE: d
	};
	
	kv1.value.forEach(function (d){
		// if(d.value==0){console.log("Nest 0 found")}
		obj[d.name] = d.value;
	})
	pivotedData.push(obj);
});
// console.log("pivotedData: ", pivotedData)


// Stack data
var stackedData = d3.stack()
		.keys(headerNames)
		(pivotedData);

// console.log("stacked data b4 cleaning: ", stackedData);

		// Replace Nan by 0
//console.log("Nest example / This is the stack result: ", stackedData)
stackedData.forEach(d => { d.forEach(e => {
					if(e[0] !== e[0]){
    						e[0] = 0;}
					if(e[1] !== e[1]){
						e[1] = 0;}	
					})
		});
// console.log("stacked data after cleaning: ", stackedData);

// color palette
var color = d3.scaleOrdinal(d3.schemeCategory20c)
		.domain(headerNames);

// Add to svg stacked area
svg_stacked_ICD.selectAll("mylayers") // why ????
	.remove()
	.exit()
	.data(stackedData)
	.enter()
	.append("path")
	.style("fill", function(d) { return color(d.key); })
	.attr("d", d3.area()
	.curve(d3.curveMonotoneX) // Smooth curve // yes c'est plus joli avec ca
	.x(function(d) {
		// console.log("d",d);
		// console.log("AGE: ", d.data.AGE);
		//console.log("x():", x_ch1(d.data.AGE))
		return x_ch1(d.data.AGE); 
		})
		.y0(function(d) { //console.log("y(d[0]):", y_ch1(d[0])); 
				return y_ch1(d[0]); })
		.y1(function(d) { //console.log("y(d[1]):", y_ch1(d[1])); 
				return y_ch1(d[1]); 
		})
	)
	.attr("transform", "translate(" + (margin_subChart.left + corrections_stack.demihistg) + "," + margin_subChart.top + ")")
	.on("click",function(d){
		console.log("affiche d.key",d.key);
		//console.log(d3.select(this)._groups[0][0].__data__.ICD10_LABEL);
		param_icd10 = d.key
		update_map_histo_age_d_rate(param_age,param_sex,param_organ,param_icd10)
		update_map_line_chart(param_age,param_sex,param_organ,param_icd10)
	});

// Add legend
var legend = svg_stacked_ICD.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.attr("text-anchor", "start")
		.selectAll("g")
		.data(headerNames.reverse() )
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate("+( - corrections_stack.bloclegende)+"," + ((i * 25) + margin_subChart.top) + ")"; });

var OFFSET = margin_subChart.top;
OFFSET = 0;

legend.append("rect")
		.attr("x", w_subChart + corrections_stack.bloclegende + margin_subChart.right + corrections_stack.demihistg + 15)
		.attr("y", OFFSET)
		.attr("width", 20)
		.attr("height", 20)
		.attr("fill", color)
		.on("click",function(d){
			console.log("click on stack legend color ",d);
			param_icd10 = d
			update_map_histo_age_d_rate(param_age,param_sex,param_organ,param_icd10)
			update_map_line_chart(param_age,param_sex,param_organ,param_icd10)
});

legend.append("text")
		.attr("x", w_subChart + corrections_stack.bloclegende + margin_subChart.right + corrections_stack.demihistg + 40)
		.attr("y", OFFSET + 9.5)
		.attr("dy", "0.32em")
		.text(function(d) { return d; })
                .on("click",function(d){
                        console.log("click on stack legend text ",d);
                        param_icd10 = d
                        update_map_histo_age_d_rate(param_age,param_sex,param_organ,param_icd10)
                        update_map_line_chart(param_age,param_sex,param_organ,param_icd10)
});             

// selection_color  rectangle around the selected age
// SI on voulait que l'interieur soit actif il faudrait non plus un objet rect mais 4 lignes car cet objet au premier plan desactive les actions.
// pour l'instant c'est voulu de ne pas permettre de bouger l'age via le stack, on a besoin de pouvoir cliquer dans les zones 

var idx = ageLabelsList.indexOf(param_age);
var yelxabs = 0;
var yelwidth = 0;
if ( idx === 19 ){yelwidth = w_subChart; yelxabs = margin_subChart.left + corrections_stack.demihistg;}
else {yelxabs = margin_subChart.left + corrections_stack.demihistg -10 + idx * w_subChart/18; yelwidth=20;}
console.log("param_age=",param_age, ageLabelsList.indexOf(param_age))

svg_stacked_ICD.append("g").append("rect")
        .attr("x", yelxabs )
        .attr("y", margin_subChart.top -1 )
        .attr("width", yelwidth )
        .attr("height", h_subChart + 2 )
        .attr("fill", 'transparent' )
        .attr("stroke",age_selected_color )
        .attr("stroke-width", 3 );


};

/*************************************************************************************************************/
/******************************************** END Stacked Chart ICD ******************************************/
/*************************************************************************************************************/
