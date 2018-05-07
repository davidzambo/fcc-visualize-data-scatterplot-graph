const DATA_URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
    request = new XMLHttpRequest(),
    timeParse = d3.timeParse('%M:%S');

request.open('get', DATA_URL, true);
request.send();
request.onload = () => {
    const response = JSON.parse(request.response);
    generateContent(response);
    window.addEventListener('resize', () => generateContent(response));
};

const generateContent = data => {
    let margin;
    if (window.innerWidth > 901) {
        margin = {top: 100, right: 100, bottom: 100, left: 100};
    } else if (window.innerWidth > 700) {
        margin = {top: 50, right: 50, bottom: 50, left: 50};
    } else {
        margin = {top: 20, right: 30, bottom: 50, left: 30};
    }
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

    d3.select('.container').html('');

    d3.select('.container').append('h1').text('Doping in Professional Bicycle Racing');
    d3.select('.container').append('h3').text('35 Fastest times up Alpe d\'Huez');
    d3.select('.container').append('h4').text('Normalized to 13.8km distance');
    d3.select('.container').append('div')
        .attr('id', 'tooltip')
        .attr('class', 'hidden')
        .html('<p><strong>Name: </strong><span id="name"></span></p>\n' +
        '        <p><strong>Place: </strong><span id="place"></span></p>\n' +
        '        <p><strong>Time: </strong><span id="time"></span></p>\n' +
        '        <p><strong>Year: </strong><span id="year"></span></p>\n' +
        '        <p><strong>Details: </strong><span id="doping"></span></p>\n');


    const svg = d3.select('.container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%M:%S'));

    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
        .call(xAxis);

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', 0 - height / 2)
        .attr('y', 20 + margin.left)
        .attr('class', 'axis-label')
        .text('Ranking');

    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis);

    svg.append('text')
        .attr('x', width / 2 - (28 * 4))
        .attr('y', height - margin.bottom/3)
        .attr('class', 'axis-label')
        .text('Race time on 13.8km distance');


    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => margin.left + xScale(timeParse(d.Time)))
        .attr('cy', d => yScale(d.Place))
        .attr('r', 5)
        .attr('class', 'racer')
        .on('mouseover', function(d){
            const x = d3.select(this).attr('cx');
            const y = d3.select(this).attr('cy');
            d3.select('#name').text(`${d.Name} (${d.Nationality})`);
            d3.select('#place').text(d.Place + '.');
            d3.select('#time').text(d.Time);
            d3.select('#year').text(d.Year);
            d3.select('#doping')
                .text(d.Doping + ' ')
                .append('a')
                .attr('href', d.URL)
                .attr('target', '_blank')
                .text('Learn more');
            d3.select('#tooltip')
                .style('left', (x - margin.left / 2 - 5) + "px")
                .style('top', (y - 10) + "px")
                .classed('hidden', false);
        })
        .exit()
        .data(data)
        .enter()
        .append('text')
        .attr('x', (d, i) => (i < data.length / 2) ? margin.left + 10 + xScale(timeParse(d.Time)) : margin.left - 8 * (d.Name.length) + xScale(timeParse(d.Time)))
        .attr('y', d => 5 + yScale(d.Place))
        .text(d => d.Name);


    d3.select('.container')
        .append('footer')
        .html('<a href="https://www.dcmf.hu" target="_blank"><span>codedBy</span><img src="https://www.dcmf.hu/images/dcmf-letters.png" alt="dcmf-logo" /></a>');

}