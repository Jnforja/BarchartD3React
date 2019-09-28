import * as d3 from 'd3';

const MARGIN = { top: 10, bottom: 50, left: 70, right: 10 };
const WIDTH = 800;
const HEIGHT = 500;

export default class D3Chart {
  constructor(element) {
    const vis = this;

    vis.svg = d3
      .select(element)
      .append('svg')
      .attr('width', WIDTH + MARGIN.left + MARGIN.right)
      .attr('height', HEIGHT + MARGIN.top + MARGIN.bottom)
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

    vis.xLabel = vis.svg
      .append('text')
      .attr('x', WIDTH / 2)
      .attr('y', HEIGHT + 50)
      .attr('text-anchor', 'middle');

    vis.svg
      .append('text')
      .attr('x', -(HEIGHT / 2))
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .text(`Height in cm`)
      .attr('transform', 'rotate(-90)');

    vis.xAxisGroup = vis.svg
      .append('g')
      .attr('transform', `translate(0,${HEIGHT})`);

    vis.yAxisGroup = vis.svg.append('g');

    Promise.all([
      d3.json('https://udemy-react-d3.firebaseio.com/tallest_men.json'),
      d3.json('https://udemy-react-d3.firebaseio.com/tallest_women.json')
    ]).then(dataset => {
      const [men, women] = dataset;
      vis.menData = men;
      vis.womenData = women;
      vis.update('men');
    });
  }

  update(gender) {
    const vis = this;
    vis.data = gender === 'men' ? vis.menData : vis.womenData;
    vis.xLabel.text(`The world's tallest ${gender}`);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(vis.data, d => d.height) * 0.95,
        d3.max(vis.data, d => d.height)
      ])
      .range([HEIGHT, 0]);

    const x = d3
      .scaleBand()
      .domain(vis.data.map(d => d.name))
      .range([0, WIDTH])
      .padding(0.4);

    vis.xAxisGroup
      .transition()
      .duration(500)
      .call(d3.axisBottom(x));
    vis.yAxisGroup
      .transition()
      .duration(500)
      .call(d3.axisLeft(y));

    // DATA JOIN
    const rects = vis.svg.selectAll('rect').data(vis.data);

    // EXIT
    rects
      .exit()
      .transition()
      .duration(500)
      .attr('y', HEIGHT)
      .attr('height', 0)
      .remove();

    // UPDATE
    rects
      .transition()
      .duration(500)
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.height))
      .attr('width', x.bandwidth)
      .attr('height', d => HEIGHT - y(d.height));

    // ENTER
    rects
      .enter()
      .append('rect')
      .attr('x', d => x(d.name))
      .attr('width', x.bandwidth)
      .attr('y', HEIGHT)
      .attr('fill', 'grey')
      .transition()
      .duration(500)
      .attr('y', d => y(d.height))
      .attr('height', d => HEIGHT - y(d.height));
  }
}
