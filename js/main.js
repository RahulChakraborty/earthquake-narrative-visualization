let currentScene = 0;
const scenes = [renderIntro, renderSepalLengthWidth, renderPetalLengthWidth, renderSpeciesScatterPlot];
const svg = d3.select("#visualization")
              .attr("width", 960)
              .attr("height", 500);

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

    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.sepal_length))
       .attr("cy", d => y(d.sepal_width))
       .attr("r", 3)
       .attr("fill", "steelblue");

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

    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.petal_length))
       .attr("cy", d => y(d.petal_width))
       .attr("r", 3)
       .attr("fill", "steelblue");

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

    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.sepal_length))
       .attr("cy", d => y(d.petal_length))
       .attr("r", 3)
       .attr("fill", d => color(d.species));

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
    updateScene(data);
});

d3.select("#next").on("click", () => {
    currentScene = Math.min(scenes.length - 1, currentScene + 1);
    updateScene(data);
});
