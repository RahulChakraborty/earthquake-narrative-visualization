let currentScene = 0;
const scenes = [renderIntro, renderSepalLengthWidth, renderPetalLengthWidth, renderSpeciesScatterPlot];
const svg = d3.select("#visualization")
              .attr("width", 960)
              .attr("height", 500);

let data; // Initialize data variable

const loadData = new Promise((resolve, reject) => {
    d3.csv('data/Iris.csv').then(csvData => {
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
        .style("width", "250px")
        .style("padding", "10px")
        .style("font", "12px sans-serif")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("border-radius", "8px")
        .style("pointer-events", "none")
        .style("opacity", 0);
}

// Function to get image URL based on species
function getImageUrl(species) {
    const imageUrls = {
        setosa: 'images/iris_setosa.png',
        versicolor: 'images/iris-versicolor.jpg',
        virginica: 'images/iris_virginica.jpg'
    };
    return imageUrls[species.toLowerCase()];
}

// Function to calculate regression line
function calculateRegressionLine(data, xAttr, yAttr) {
    const xMean = d3.mean(data, d => d[xAttr]);
    const yMean = d3.mean(data, d => d[yAttr]);
    const numerator = d3.sum(data, d => (d[xAttr] - xMean) * (d[yAttr] - yMean));
    const denominator = d3.sum(data, d => Math.pow(d[xAttr] - xMean, 2));
    const slope = numerator / denominator;
    const intercept = yMean - (slope * xMean);

    const xMin = d3.min(data, d => d[xAttr]);
    const xMax = d3.max(data, d => d[xAttr]);
    const yMin = intercept + slope * xMin;
    const yMax = intercept + slope * xMax;

    return { line: [[xMin, yMin], [xMax, yMax]], slope, intercept };
}

// Function to add regression line
function addRegressionLine(svg, x, y, data, xAttr, yAttr) {
    const regression = calculateRegressionLine(data, xAttr, yAttr);
    const regressionLine = regression.line;
    const slope = regression.slope;
    const intercept = regression.intercept;

    svg.append("line")
        .attr("x1", x(regressionLine[0][0]))
        .attr("y1", y(regressionLine[0][1]))
        .attr("x2", x(regressionLine[1][0]))
        .attr("y2", y(regressionLine[1][1]))
        .attr("stroke", "red")
        .attr("stroke-width", 2);

    svg.append("text")
        .attr("x", 700)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "red")
        .text(`y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`);
}

// Function to add legend
function addLegend(svg, color) {
   const legend = svg.selectAll(".legend")
       .data(color.domain())
       .enter().append("g")
       .attr("class", "legend")
       .attr("transform", (d, i) => `translate(0,${i * 20})`);

   legend.append("rect")
       .attr("x", 860)
       .attr("y", 350)
       .attr("width", 18)
       .attr("height", 18)
       .style("fill", color);

   legend.append("text")
       .attr("x", 880)
       .attr("y", 358)
       .attr("dy", ".35em")
       .style("text-anchor", "start")
       .text(d => d);
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

    const color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica"])
    .range(["#ff7f0e", "#2ca02c", "#1f77b4"]);

    svg.append("g")
       .attr("transform", "translate(0,450)")
       .call(d3.axisBottom(x));

    svg.append("g")
       .attr("transform", "translate(50,0)")
       .call(d3.axisLeft(y));

    svg.append("text")
       .attr("x", 480)
       .attr("y", 490)
       .attr("text-anchor", "middle")
       .attr("font-size", "16px")
       .text("Sepal Length (cm)");

    svg.append("text")
       .attr("x", -225)
       .attr("y", 15)
       .attr("transform", "rotate(-90)")
       .attr("text-anchor", "middle")
       .attr("font-size", "16px")
       .text("Sepal Width (cm)");

    addRegressionLine(svg, x, y, data, 'sepal_length', 'sepal_width');

    const detailBox = createDetailBox();

    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.sepal_length))
       .attr("cy", d => y(d.sepal_width))
       .attr("r", 3)
       .attr("fill",  d => color(d.species))
       .on("mouseover", function(event, d) {
            detailBox.transition()
                   .duration(200)
                   .style("opacity", .9);
            detailBox.html(`
                <strong>Details:</strong><br>
                <img src="${getImageUrl(d.species)}" alt="${d.species}"><br>
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
                <img src="${getImageUrl(d.species)}" alt="${d.species}"><br>
                Sepal Length: ${d.sepal_length}<br>
                Sepal Width: ${d.sepal_width}<br>
                Petal Length: ${d.petal_length}<br>
                Petal Width: ${d.petal_width}<br>
                Species: ${d.species}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY + 5) + "px");
       });

   
    addLegend(svg, color);

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

    const color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica"])
    .range(["#ff7f0e", "#2ca02c", "#1f77b4"]);

    svg.append("g")
       .attr("transform", "translate(0,450)")
       .call(d3.axisBottom(x));

    svg.append("g")
       .attr("transform", "translate(50,0)")
       .call(d3.axisLeft(y));

    svg.append("text")
       .attr("x", 480)
       .attr("y", 490)
       .attr("text-anchor", "middle")
       .attr("font-size", "16px")
       .text("Petal Length (cm)");

    svg.append("text")
       .attr("x", -225)
       .attr("y", 15)
       .attr("transform", "rotate(-90)")
       .attr("text-anchor", "middle")
       .attr("font-size", "16px")
       .text("Petal Width (cm)");

    addRegressionLine(svg, x, y, data, 'petal_length', 'petal_width');

    const detailBox = createDetailBox();

    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.petal_length))
       .attr("cy", d => y(d.petal_width))
       .attr("r", 3)
       .attr("fill",  d => color(d.species))
       .on("mouseover", function(event, d) {
            detailBox.transition()
                   .duration(200)
                   .style("opacity", .9);
            detailBox.html(`
                <strong>Details:</strong><br>
                <img src="${getImageUrl(d.species)}" alt="${d.species}"><br>
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
                <img src="${getImageUrl(d.species)}" alt="${d.species}"><br>
                Sepal Length: ${d.sepal_length}<br>
                Sepal Width: ${d.sepal_width}<br>
                Petal Length: ${d.petal_length}<br>
                Petal Width: ${d.petal_width}<br>
                Species: ${d.species}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY + 5) + "px");
       });


    addLegend(svg, color);
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

        svg.append("text")
                    .attr("x", 480)
                    .attr("y", 490)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "16px")
                    .text("Sepal Length (cm)");
             
        svg.append("text")
                    .attr("x", -225)
                    .attr("y", 15)
                    .attr("transform", "rotate(-90)")
                    .attr("text-anchor", "middle")
                    .attr("font-size", "16px")
                    .text("Petal Length (cm)");

    addRegressionLine(svg, x, y, data, 'sepal_length', 'petal_length');

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
                <img src="${getImageUrl(d.species)}" alt="${d.species}"><br>
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
                <img src="${getImageUrl(d.species)}" alt="${d.species}"><br>
                Sepal Length: ${d.sepal_length}<br>
                Sepal Width: ${d.sepal_width}<br>
                Petal Length: ${d.petal_length}<br>
                Petal Width: ${d.petal_width}<br>
                Species: ${d.species}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY + 5) + "px");
       });

   addLegend(svg, color);


    svg.append("text")
       .attr("x", 480)
       .attr("y", 30)
       .attr("text-anchor", "middle")
       .attr("font-size", "24px")
       .text("Sepal Length vs. Petal Length");
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
