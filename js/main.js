let currentScene = 0;
const scenes = [renderIntro, renderSepalLengthWidth, renderPetalLengthWidth, renderSpeciesScatterPlot];
const svg = d3.select("#visualization")
              .attr("width", 960)
              .attr("height", 500);

let data; // Initialize data variable

const loadData = new Promise((resolve, reject) => {
    d3.csv('data/iris.csv').then(csvData => {
        csvData.forEach(d => {
            d.sepal_length = +d.sepal_length;
            d.sepal_width = +d.sepal_width;
            d.petal_length = +d.petal_length;
            d.petal_width = +d.petal_width;
        });
        data = csvData;
        resolve(data);
    }).catch(error => reject(error));
});

loadData.then(() => {
    updateScene(data);
}).catch(error => console.error('Error loading the data:', error));

function updateScene(data) {
    svg.selectAll("*").remove();
    scenes[currentScene](data);
}

// Function to create tooltip
function createTooltip() {
    return d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("text-align", "center")
        .style("width", "120px")
        .style("height", "28px")
        .style("padding", "2px")
        .style("font", "12px sans-serif")
        .style("background", "lightsteelblue")
        .style("border", "0px")
        .style("border-radius", "8px")
        .style("pointer-events", "none")
        .style("opacity", 0);
}

// Intro Scene: Explaining the Dataset
function renderIntro() {
    const introText = [
        "The Iris Flower Dataset",
        "This dataset contains 150 observations of iris flowers.",
        "Each observation includes measurements of sepal length, sepal width, petal length, and petal width.",
        "The dataset contains three species: Iris setosa, Iris versicolor, and Iris virginica.",
        "This visualization will guide you through different aspects of the dataset."
    ];

    svg.selectAll("text")
       .data(introText)
       .enter().append("text")
       .attr("x", 480)
       .attr("y", (d, i) => 100 + i * 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "20px")
       .text(d => d);

    svg.append("text")
       .attr("x", 480)
       .attr("y", 400)
       .attr("text-anchor", "middle")
       .attr("font-size", "18px")
       .attr("fill", "gray")
       .text("Use the 'Next' button to begin exploring the data.");
}

// Render Sepal Length vs Sepal Width Scene
function renderSepalLengthWidth(data) {
    const x = d3.scaleLinear().domain([4, 8]).range([50, 910]);
    const y = d3.scaleLinear().domain([2, 4.5]).range([450, 50]);

    svg.append("g")
       .attr("transform", "translate(0,450)")
       .call(d3.axisBottom(x));

    svg.append("g")
       .attr("transform", "translate(50,0)")
       .call(d3.axisLeft(y));

    const tooltip = createTooltip();

    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.sepal_length))
       .attr("cy", d => y(d.sepal_width))
       .attr("r", 3)
       .attr("fill", "steelblue")
       .on("mouseover", function(event, d) {
            tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
            tooltip.html(`Sepal Length: ${d.sepal_length}<br>Sepal Width: ${d.sepal_width}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY - 28) + "px");
       })
       .on("mouseout", function(d) {
            tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
       });

    svg.append("text")
       .attr("x", 480)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "24px")
       .text("Sepal Length vs. Sepal Width");

    // Manual Annotations
    // svg.append("text")
    //    .attr("x", x(5.5))
    //    .attr("y", y(3.5))
    //    .attr("dy", "-10")
    //    .attr("dx", "10")
    //    .attr("font-size", "12px")
    //    .attr("fill", "black")
    //    .text("Sepal length and width vary among species.");

    // svg.append("line")
    //    .attr("x1", x(5.5))
    //    .attr("y1", y(3.5))
    //    .attr("x2", x(6))
    //    .attr("y2", y(3.8))
    //    .attr("stroke", "black")
    //    .attr("stroke-width", 1);
}

// Render Petal Length vs Petal Width Scene
function renderPetalLengthWidth(data) {
    const x = d3.scaleLinear().domain([1, 7]).range([50, 910]);
    const y = d3.scaleLinear().domain([0, 2.5]).range([450, 50]);

    svg.append("g")
       .attr("transform", "translate(0,450)")
       .call(d3.axisBottom(x));

    svg.append("g")
       .attr("transform", "translate(50,0)")
       .call(d3.axisLeft(y));

    const tooltip = createTooltip();

    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.petal_length))
       .attr("cy", d => y(d.petal_width))
       .attr("r", 3)
       .attr("fill", "steelblue")
       .on("mouseover", function(event, d) {
            tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
            tooltip.html(`Petal Length: ${d.petal_length}<br>Petal Width: ${d.petal_width}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY - 28) + "px");
       })
       .on("mouseout", function(d) {
            tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
       });

    svg.append("text")
       .attr("x", 480)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "24px")
       .text("Petal Length vs. Petal Width");

    // Manual Annotations
    // svg.append("text")
    //    .attr("x", x(4))
    //    .attr("y", y(1.5))
    //    .attr("dy", "-10")
    //    .attr("dx", "10")
    //    .attr("font-size", "12px")
    //    .attr("fill", "black")
    //    .text("Petal length and width show significant variation.");

    // svg.append("line")
    //    .attr("x1", x(4))
    //    .attr("y1", y(1.5))
    //    .attr("x2", x(4.5))
    //    .attr("y2", y(1.8))
    //    .attr("stroke", "black")
    //    .attr("stroke-width", 1);
}

// Render Sepal Length vs Petal Length Scene Colored by Species
function renderSpeciesScatterPlot(data) {
    const x = d3.scaleLinear().domain([4, 8]).range([50, 910]);
    const y = d3.scaleLinear().domain([1, 7]).range([450, 50]);

    svg.append("g")
       .attr("transform", "translate(0,450)")
       .call(d3.axisBottom(x));

    svg.append("g")
       .attr("transform", "translate(50,0)")
       .call(d3.axisLeft(y));

    const color = d3.scaleOrdinal()
                    .domain(["setosa", "versicolor", "virginica"])
                    .range(["#ff7f0e", "#2ca02c", "#1f77b4"]);

    const tooltip = createTooltip();

    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.sepal_length))
       .attr("cy", d => y(d.petal_length))
       .attr("r", 3)
       .attr("fill", d => color(d.species))
       .on("mouseover", function(event, d) {
            tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
            tooltip.html(`Sepal Length: ${d.sepal_length}<br>Petal Length: ${d.petal_length}<br>Species: ${d.species}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY - 28) + "px");
       })
       .on("mouseout", function(d) {
            tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
       });

    svg.append("text")
       .attr("x", 480)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "24px")
       .text("Sepal Length vs. Petal Length Colored by Species");

    // // Manual Annotations
    // svg.append("text")
    //    .attr("x", x(5.5))
    //    .attr("y", y(3))
    //    .attr("dy", "-10")
    //    .attr("dx", "10")
    //    .attr("font-size", "12px")
    //    .attr("fill", "black")
    //    .text("Color indicates species, showing variation among them.");

    // svg.append("line")
    //    .attr("x1", x(5.5))
    //    .attr("y1", y(3))
    //    .attr("x2", x(6))
    //    .attr("y2", y(4))
    //    .attr("stroke", "black")
    //    .attr("stroke-width", 1);
}

// Triggers for navigation
d3.select("#prev").on("click", () => {
    currentScene = Math.max(0, currentScene - 1);
    loadData.then(data => updateScene(data));
});

d3.select("#next").on("click", () => {
    currentScene = Math.min(scenes.length - 1, currentScene + 1);
    loadData.then(data => updateScene(data));
});
