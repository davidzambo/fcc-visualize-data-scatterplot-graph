const DATA_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
    request = new XMLHttpRequest(),
    margin = {top: 60, right: 60, bottom: 60, left: 60},
    timeParse = d3.timeParse('%M:%S'),
    mouse = {};

window.onmousemove = (e) => {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
};

request.open('get', DATA_URL, true);
request.send();
request.onload = () => {
    const response = JSON.parse(request.response);
    generateContent(response);
};

const generateContent = data => {
    const minTime = d3.min(data.map(d => timeParse(d.Time))),
        maxTime = d3.max(data.map(d => timeParse(d.Time))),
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom;

    const xScale = d3.scaleTime()
        .domain([minTime, maxTime])
        .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([data.length, 0])
        .range([margin.top, height - margin.bottom]);

    const svg = d3.select('.container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%M:%S'));

    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
        .call(xAxis);

    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis);

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => margin.left + xScale(timeParse(d.Time)))
        .attr('cy', d => yScale(d.Place))
        .attr('r', 5)
        .attr('class', 'racer')
        .on('mouseover', function(d){
            d3.select('#name')
                .attr('href', d.URL)
                .text(d.Name);
            d3.select('#nationality').text(d.Nationality);
            d3.select('#place').text(d.Place);
            d3.select('#time').text(d.Time);
            d3.select('#year').text(d.Year);
            d3.select('#doping').text(d.Doping);
            d3.select('#tooltip')
                .style('left', mouse.x+"px")
                .style('top', mouse.y+"px");

        });

}