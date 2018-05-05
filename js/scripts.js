const DATA_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
    request = new XMLHttpRequest(),
    margin = {top: 50, right: 50, bottom: 50, left: 50};

request.open('get', DATA_URL, true);
request.send();
request.onload = () => {
    const response = JSON.parse(request.response);
    generateContent(response);
};

const generateContent = data => {
    const minTime = d3.min(data.map(d => d.Seconds)),
        maxTime = d3.max(data.map(d => d.Seconds)),
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .domain([minTime, maxTime])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([data.length, 1])
        .range([margin.top, height - margin.bottom]);

    const svg = d3.select('.container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const xAxis = d3.axisBottom(xScale);

    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
        .call(xAxis);

    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis);

}