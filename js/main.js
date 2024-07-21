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

    // Initialize the current scene index
    let currentSceneIndex = 0;

    // Scene functions
    function introScene() {
        svg.selectAll("*").remove(); // Clear the SVG

        // Introductory text
        svg.append("text")
           .attr("x", 50)
           .attr("y", 100)
           .text("Welcome to the Earthquake Data Visualization")
           .attr("font-size", "24px")
           .attr("fill", "black");

        svg.append("text")
           .attr("x", 50)
           .attr("y", 150)
           .text("This visualization will guide you through the key aspects of global earthquake data.")
           .attr("font-size", "18px")
           .attr("fill", "black");
    }

    function scene1() {
        svg.selectAll("*").remove(); // Clear the SVG

        // Set up scales
        const xScale = d3.scaleLog()
                         .domain([d3.min(data, d => d.mag), d3.max(data, d => d.mag)])
                         .range([50, 750]);
        const yScale = d3.scaleLog()
                         .domain([d3.min(data, d => d.depth), d3.max(data, d => d.depth)])
                         .range([550, 50]);

        // Add axes
        svg.append("g")
           .attr("transform", "translate(0,550)")
           .call(d3.axisBottom(xScale).ticks(10, ",.1f"));
        svg.append("g")
           .attr("transform", "translate(50,0)")
           .call(d3.axisLeft(yScale).ticks(10, ",.1f"));

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

        svg.append("text")
           .attr("x", 50)
           .attr("y", 70)
           .text("This scatter plot shows the relationship between the magnitude and depth of earthquakes.")
           .attr("font-size", "18px")
           .attr("fill", "black");
    }

    function scene2() {
        svg.selectAll("*").remove(); // Clear the SVG

        // Load and display the world map
        d3.json("https://d3js.org/world-50m.v1.json").then(function(world) {
            const projection = d3.geoMercator()
                                 .scale(150)
                                 .translate([400, 300]);
            const path = d3.geoPath().projection(projection);

            svg.append("path")
               .datum(topojson.feature(world, world.objects.countries))
               .attr("d", path)
               .attr("fill", "#ccc")
               .attr("stroke", "#333");

            // Add earthquake points
            svg.selectAll("circle")
               .data(data)
               .enter()
               .append("circle")
               .attr("cx", d => projection([d.longitude, d.latitude])[0])
               .attr("cy", d => projection([d.longitude, d.latitude])[1])
               .attr("r", d => Math.sqrt(d.mag))
               .attr("fill", "orange")
               .attr("opacity", 0.6);

            // Add annotations
            svg.append("text")
               .attr("x", 50)
               .attr("y", 30)
               .text("Scene 2: Global Earthquake Locations")
               .attr("font-size", "24px")
               .attr("fill", "black");

            svg.append("text")
               .attr("x", 50)
               .attr("y", 70)
               .text("This map shows the locations of earthquakes globally.")
               .attr("font-size", "18px")
               .attr("fill", "black");
        });
    }

    function scene3() {
        svg.selectAll("*").remove(); // Clear the SVG

        // Set up scales
        const xScale = d3.scaleLog()
                         .domain([d3.min(data, d => d.longitude), d3.max(data, d => d.longitude)])
                         .range([50, 750]);
        const yScale = d3.scaleLog()
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

        svg.append("text")
           .attr("x", 50)
           .attr("y", 70)
           .text("This scatter plot shows the depth of earthquakes by their geographic location.")
           .attr("font-size", "18px")
           .attr("fill", "black");
    }

    // Scene array
    const scenes = [introScene, scene1, scene2, scene3];

    // Function to render the current scene
    function renderScene(index) {
        scenes[index]();
    }

    // Initial render
    renderScene(currentSceneIndex);

    // Navigation buttons
    d3.select("#prev").on("click", function() {
        if (currentSceneIndex > 0) {
            currentSceneIndex--;
            renderScene(currentSceneIndex);
        }
    });

    d3.select("#next").on("click", function() {
        if (currentSceneIndex < scenes.length - 1) {
            currentSceneIndex++;
            renderScene(currentSceneIndex);
        }
    });
});
