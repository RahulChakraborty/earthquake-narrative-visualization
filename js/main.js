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

// Function to create detail box
function createDetailBox() {
    return d3.select("body").append("div")
        .attr("class", "detail-box")
        .style("position", "absolute")
        .style("text-align", "left")
        .style("width", "200px")
        .style("padding", "10px")
        .style("font", "12px sans-serif")
        .style("background", "white")
        .style("border", "1px solid #ccc")
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

    // svg.selectAll("text")
    //    .data(introText)
    //    .enter().append("text")
    //    .attr("x", 480)
    //    .attr("y", (d, i) => 100 + i * 30)
    //    .attr("text-anchor", "middle")
    //    .attr("font-size", "20px")
    //    .text(d => d);

    // svg.append("text")
    //    .attr("x", 480)
    //    .attr("y", 400)
    //    .attr("text-anchor", "middle")
    //    .attr("font-size", "18px")
    //    .attr("fill", "gray")
    //    .text("Use the 'Next' button to begin exploring the data.");


    const introContainer = svg.append("foreignObject")
       .attr("width", 960)
       .attr("height", 500)
       .append("xhtml:div")
       .attr("id", "intro");

    introContainer.selectAll("p")
       .data(introText)
       .enter().append("p")
       .attr("style", "text-align: center; font-size: 20px; margin: 20px 0;")
       .text(d => d);

    introContainer.append("img")
       .attr("src", "images/flower-image.png")
       .attr("alt", "Iris Flower Diagram")
       .attr("style", "width: 300px; margin-top: 20px;");

    introContainer.append("p")
       .attr("style", "text-align: center; font-size: 18px; margin: 20px 0; color: gray;")
       .text("The image shows the petal and sepal parts of an Iris flower.");

    introContainer.append("p")
       .attr("style", "text-align: center; font-size: 18px; color: gray;")
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

    const detailBox = createDetailBox();

    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.sepal_length))
       .attr("cy", d => y(d.sepal_width))
       .attr("r", 3)
       .attr("fill", "steelblue")
       .on("mouseover", function(event, d) {
            detailBox.transition()
                   .duration(200)
                   .style("opacity", .9);
            detailBox.html(`
                <strong>Details:</strong><br>
                Sepal Length: ${d.sepal_length}<br>
                Sepal Width: ${d.sepal_width}<br>
                Petal Length: ${d.petal_length}<br>
                Petal Width: ${d.petal_width}<br>
                Species: ${d.species}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY + 5) + "px");
       })
       .on("mouseout", function(d) {
            detailBox.transition()
                   .duration(500)
                   .style("opacity", 0);
       })
       .on("click", function(event, d) {
            detailBox.transition()
                   .duration(200)
                   .style("opacity", .9);
            detailBox.html(`
                <strong>Details:</strong><br>
                Sepal Length: ${d.sepal_length}<br>
                Sepal Width: ${d.sepal_width}<br>
                Petal Length: ${d.petal_length}<br>
                Petal Width: ${d.petal_width}<br>
                Species: ${d.species}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY + 5) + "px");
       });

    svg.append("text")
       .attr("x", 480)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "24px")
       .text("Sepal Length vs. Sepal Width");
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

    const detailBox = createDetailBox();

    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.petal_length))
       .attr("cy", d => y(d.petal_width))
       .attr("r", 3)
       .attr("fill", "steelblue")
       .on("mouseover", function(event, d) {
            detailBox.transition()
                   .duration(200)
                   .style("opacity", .9);
            detailBox.html(`
                <strong>Details:</strong><br>
                Sepal Length: ${d.sepal_length}<br>
                Sepal Width: ${d.sepal_width}<br>
                Petal Length: ${d.petal_length}<br>
                Petal Width: ${d.petal_width}<br>
                Species: ${d.species}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY + 5) + "px");
       })
       .on("mouseout", function(d) {
            detailBox.transition()
                   .duration(500)
                   .style("opacity", 0);
       })
       .on("click", function(event, d) {
            detailBox.transition()
                   .duration(200)
                   .style("opacity", .9);
            detailBox.html(`
                <strong>Details:</strong><br>
                Sepal Length: ${d.sepal_length}<br>
                Sepal Width: ${d.sepal_width}<br>
                Petal Length: ${d.petal_length}<br>
                Petal Width: ${d.petal_width}<br>
                Species: ${d.species}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY + 5) + "px");
       });

    svg.append("text")
       .attr("x", 480)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "24px")
       .text("Petal Length vs. Petal Width");
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

    const detailBox = createDetailBox();

    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.sepal_length))
       .attr("cy", d => y(d.petal_length))
       .attr("r", 3)
       .attr("fill", d => color(d.species))
       .on("mouseover", function(event, d) {
            detailBox.transition()
                   .duration(200)
                   .style("opacity", .9);
            detailBox.html(`
                <strong>Details:</strong><br>
                Sepal Length: ${d.sepal_length}<br>
                Sepal Width: ${d.sepal_width}<br>
                Petal Length: ${d.petal_length}<br>
                Petal Width: ${d.petal_width}<br>
                Species: ${d.species}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY + 5) + "px");
       })
       .on("mouseout", function(d) {
            detailBox.transition()
                   .duration(500)
                   .style("opacity", 0);
       })
       .on("click", function(event, d) {
            detailBox.transition()
                   .duration(200)
                   .style("opacity", .9);
            detailBox.html(`
                <strong>Details:</strong><br>
                Sepal Length: ${d.sepal_length}<br>
                Sepal Width: ${d.sepal_width}<br>
                Petal Length: ${d.petal_length}<br>
                Petal Width: ${d.petal_width}<br>
                Species: ${d.species}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY + 5) + "px");
       });

    svg.append("text")
       .attr("x", 480)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "24px")
       .text("Sepal Length vs. Petal Length Colored by Species");
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
