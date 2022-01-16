function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("./static/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("./static/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("./static/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    //console.log(sampleData); 
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterSample = sampleData.filter(sampleObj => sampleObj.id == sample);
    //console.log(filterSample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filterSample[0];
    //console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleIds = firstSample.otu_ids;
    var sampleLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    //console.log(sampleIds);
    //console.log(sampleLabels);
    //console.log(sampleValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = sampleIds.map(sampleObj => "OTU " + sampleObj)
    var yticks = yticks.slice(0,10).reverse();
    //console.log(yticks);
    var xticks = sampleValues.slice(0,10).reverse();
    //console.log(xticks)
    var hoverText = sampleLabels.slice(0,10).reverse();
    //console.log(hoverText)

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: xticks,
      y: yticks,
      text: hoverText,
      name: "otu ID",
      type: "bar",
      orientation: "h"
    };

    var barData = [trace];
      
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      plot_bgcolor: 'lightgrey',
      paper_bgcolor: 'lightgrey',
      font: {size: 16, bold:true}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

// Create Bubble charts

    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 

    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      x: sampleIds,
      y: sampleValues,
      text: sampleLabels,
      mode: "markers",
      marker: {
        color: sampleIds,
        colorscale: 'Portland',
        size: sampleValues
      }
    };
    bubbleData = [bubbleTrace];
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample", 
      font: {size: 18, bold:true},
      xaxis: {title: "OTU ID"},
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      hovermode: 'closest',
      plot_bgcolor: 'lightgrey',
      paper_bgcolor: 'lightgrey'
      };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    
    // Create gauge chart for belly button scrub frequency
  
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var sampleGaugeData = data.metadata;
    var filterGaugeSample = sampleGaugeData.filter(sampleObj => sampleObj.id == sample);
    //console.log(filterGaugeSample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var firstGaugeFilter = filterGaugeSample [0];

    // 3. Create a variable that holds the washing frequency.
    var sampleWashFreq = firstGaugeFilter.wfreq;
    //console.log(sampleWashFreq)
       
    // 4. Create the trace for the gauge chart.
    var traceGauge = {
      type: "indicator",
      value: sampleWashFreq,
      title: {text: "Scrubs per Week"},
      gauge: {
        axis:{range: [null, 10]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ],
      },
      mode: "gauge+number",
      
    }
    var gaugeData = [traceGauge];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 400,
      height: 400,
      margin: {l: 25, r: 25, b: 25},
      title: {text: "Belly Button Washing Frequency", font: {size: 24, bold:true}},
      plot_bgcolor: 'lightgrey',
      paper_bgcolor: 'lightgrey'
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}