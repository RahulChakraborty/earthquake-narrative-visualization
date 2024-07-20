// Load the data
d3.csv("data/earthquake_2.5_magnitude_week.csv").then(function(data) {
    // Parse the data
    data.forEach(function(d) {
        d.latitude = +d.latitude;
        d.longitude = +d.longitude;
        d.depth = +d.depth;
        d.mag = +d.mag;
    });

    // Set up the SVG
    const svg = d3.select("#visualization")
                  .append("svg")
                  .attr("width", 800)
                  .attr("height", 600);

    // Scene 1: Magnitude vs. Depth
    function scene1() {
        svg.selectAll("*").remove(); // Clear the SVG

        // Set up scales
        const xScale = d3.scaleLinear()
                         .domain([0, d3.max(data, d => d.mag)])
                         .range([50, 750]);
        const yScale = d3.scaleLinear()
                         .domain([0, d3.max(data, d => d.depth)])
                         .range([550, 50]);

        // Add axes
        svg.append("g")
           .attr("transform", "translate(0,550)")
           .call(d3.axisBottom(xScale));
        svg.append("g")
           .attr("transform", "translate(50,0)")
           .call(d3.axisLeft(yScale));

        // Add points
        svg.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", d => xScale(d.mag))
           .attr("cy", d => yScale(d.depth))
           .attr("r", 5)
           .attr("fill", "steelblue");

        // Add annotations
        svg.append("text")
           .attr("x", 50)
           .attr("y", 30)
           .text("Scene 1: Magnitude vs. Depth")
           .attr("font-size", "24px")
           .attr("fill", "black");
    }

    // Scene 2: Magnitude by Location
    function scene2() {
        svg.selectAll("*").remove(); // Clear the SVG

        // Set up scales
        const xScale = d3.scaleLinear()
                         .domain([d3.min(data, d => d.longitude), d3.max(data, d => d.longitude)])
                         .range([50, 750]);
        const yScale = d3.scaleLinear()
                         .domain([d3.min(data, d => d.latitude), d3.max(data, d => d.latitude)])
                         .range([550, 50]);

        // Add points
        svg.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", d => xScale(d.longitude))
           .attr("cy", d => yScale(d.latitude))
           .attr("r", d => d.mag)
           .attr("fill", "orange");

        // Add annotations
        svg.append("text")
           .attr("x", 50)
           .attr("y", 30)
           .text("Scene 2: Magnitude by Location")
           .attr("font-size", "24px")
           .attr("fill", "black");
    }

    // Scene 3: Depth by Location
    function scene3() {
        svg.selectAll("*").remove(); // Clear the SVG

        // Set up scales
        const xScale = d3.scaleLinear()
                         .domain([d3.min(data, d => d.longitude), d3.max(data, d => d.longitude)])
                         .range([50, 750]);
        const yScale = d3.scaleLinear()
                         .domain([d3.min(data, d => d.latitude), d3.max(data, d => d.latitude)])
                         .range([550, 50]);

        // Add points
        svg.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", d => xScale(d.longitude))
           .attr("cy", d => yScale(d.latitude))
           .attr("r", d => d.depth / 20)
           .attr("fill", "red");

        // Add annotations
        svg.append("text")
           .attr("x", 50)
           .attr("y", 30)
           .text("Scene 3: Depth by Location")
           .attr("font-size", "24px")
           .attr("fill", "black");
    }

    // Initial scene
    scene1();

    // Add buttons to switch between scenes
    d3.select("#scene1").on("click", scene1);
    d3.select("#scene2").on("click", scene2);
    d3.select("#scene3").on("click", scene3);
});
