function buildMetadata(sample) {
  // Elizabeth helped me get on track for this first part with using metadata "+ sample"
  // An earlier iteration tried to use var url = "/name" and then var meta = "/metadata/${url.name}" however, that was unsuccessful
  // I'm certain it can be done, I just am not skilled enough to figure out what I was missing to make that work

  // @TODO: Complete the following function that builds the metadata panel
  var url = "/metadata/" + sample;
  console.log(url);

  d3.json(url).then(function(response) {
    var metadata = [response];
    console.log(metadata);

    //map values from response
    var age = metadata.map(data => data.AGE);
    var bbtype = metadata.map(data => data.BBTYPE);
    var ethnicity = metadata.map(data => data.ETHNICITY);
    var gender = metadata.map(data => data.GENDER);
    var location = metadata.map(data => data.LOCATION);
    var sample = metadata.map(data => data.sample);

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.select("#sample-metadata").append("li").text(`AGE: ${age}`);
    d3.select("#sample-metadata").append("li").text(`BBTYPE: ${bbtype}`);
    d3.select("#sample-metadata").append("li").text(`ETHNICITY: ${ethnicity}`);
    d3.select("#sample-metadata").append("li").text(`GENDER: ${gender}`);
    d3.select("#sample-metadata").append("li").text(`LOCATION: ${location}`);
    d3.select("#sample-metadata").append("li").text(`SAMPLEID: ${sample}`);

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  }};

function buildCharts(sample) {
  var url = `/samples/${sample}`;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(data) {
    console.log(url);
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = [(
      y: data.sample_values,
      x: data.otu_ids,
      text: data.otu_labels,
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids;
      };
    )];
    var layout1 = {
      xaxis: {title: {text: "OTU IDS"}},
      yaxis: {title: {text: "Sampel Values"}},
      sort: true,
    };
    Plotly.newPlot("bubble",trace1,layout1);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace2 = [{
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      type: "pie",
      sort: true
    }];
    var layout = {
      title: "The Top 10 Samples",
    };
    Plotly.newPlot("pie",trace2,layout2);
  };
  )};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
