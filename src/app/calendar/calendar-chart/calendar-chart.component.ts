import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-calendar-chart',
  templateUrl: './calendar-chart.component.html',
  styleUrls: ['./calendar-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarChartComponent implements AfterViewInit, OnChanges {
  @Input() data!: { name: string, order: number, start: Date, middle: Date, end: Date }[];
  @Input() barColors: { name: string, color: string}[];
  @Input() itemClicked: (itemName: string) => void = _ => {};

  margin = { top: 30, right: 5, bottom: 5, left: 150 };
  width = 960 - this.margin.right - this.margin.left;
  height = 500 - this.margin.top - this.margin.bottom;

  public svg!: d3.Selection<SVGGElement, unknown, HTMLElement, undefined>;
  public isRendered = false;
  private zoom: d3.ZoomBehavior<Element, unknown>;
  private x: d3.ScaleTime<number, number, never>;
  private xAxis: d3.Selection<SVGGElement, unknown, HTMLElement, undefined>;
  private y: d3.ScaleBand<string>;

  @ViewChild('viz', {read: ElementRef, static: true}) svgContainerRef!: ElementRef<HTMLDivElement>;

  constructor() {
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isRendered) {
      this.delateChart();
    }
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isRendered) {
      this.delateChart();
      this.createChart();
      this.isRendered = true;
    }
  }

  ngAfterViewInit(): void {
    if (this.isRendered) {
      this.delateChart();
    }
    this.createChart();
    this.isRendered = true;
  }

  private delateChart() {
    d3.selectAll('#viz').select('svg').remove();
  }

  private isDataValid(): boolean {
    return this.data && this.data.length > 0;
  }

  private createChart(): void {
    if (!this.isDataValid()) {
      return;
    }

    this.width = window.innerWidth - this.margin.right - this.margin.left;
    this.height = window.innerHeight - this.margin.top - this.margin.bottom - 110;

    // When screen less than 500 .scaleExtent([15,32])
    this.zoom = d3.zoom()
                  .scaleExtent([5,32])
                  .extent([[this.margin.left, 0], [this.width - this.margin.right, this.height]])
                  .on('zoom', e => this.zoomed(e));


    let svgBase = d3.select('#viz')
    .append('svg')
    .attr('width', this.width + this.margin.right + this.margin.left)
    .attr('height', this.height + this.margin.top + this.margin.bottom);

    this.svg = svgBase.append('g')
    .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
    .attr('width', this.width)
    .attr('height', this.height);


    this.x = this.createXScale();
    this.y = this.createYScale();

    svgBase.call(this.zoom)
           .transition()
              .duration(750)
              .call(base => this.zoom.scaleTo(base, 5, [this.x(new Date()), 0]));

    let bar = this.svg.selectAll('.bar-group')
                 .data(this.data)
                 .enter()
                 .append('g')
                 .attr('class', 'bar-group');

    this.svg.append('rect')
            .attr('x', `-${this.margin.left}`)
            .attr('y', 0)
            .attr('width', this.margin.left)
            .attr('height', this.height)
            .style('fill', 'white');
    this.svg.append('rect')
            .attr('x', this.width)
            .attr('y', 0)
            .attr('width', this.margin.right)
            .attr('height', this.height)
            .style('fill', 'white');

    this.xAxis = this.svg.append('g').call(g => this.createXAxis(g, this.x));
    this.createYAxis(this.y);

    this.createBar('start-bar', bar, d => this.x(d.start), d => this.x(d.middle) - this.x(d.start), .55);
    this.createBar('end-bar', bar, d => this.x(d.middle), d => this.x(d.end) - this.x(d.middle), 1);

  }

  private createBar(className: string,
                    bar: d3.Selection<SVGGElement, { name: string; order: number; start: Date; middle: Date; end: Date; }, SVGGElement, unknown>,
                    xFunc: (data: { name: string; order: number; start: Date; middle: Date; end: Date; }) => number,
                    widthFunc: (data: { name: string; order: number; start: Date; middle: Date; end: Date; }) => number,
                    opacity: number) {
    return bar.append('rect')
      .attr('class', className)
      .attr('x', xFunc)
      .attr('y', d => this.y(d.name) + (this.getBarHeight(d.name) * (d.order - 1)))
      .attr('width', 0)
      .attr('height', d => this.getBarHeight(d.name))
      .style('fill', d => this.getFill(d.name))
      .style('opacity', 0)
      .transition()
      .duration(500)
      .attr('width', widthFunc)
      .style('opacity', opacity);
  }

  private zoomed(e) {
    const xz = e.transform.rescaleX(this.x);
    this.xAxis.call(g => this.createXAxis(g, xz));
    d3.selectAll('.start-bar')
      .attr('x', (d: {name: string; order: number; start: Date; middle: Date; end: Date;}) => xz(d.start))
      .attr('width', (d: {name: string; order: number; start: Date; middle: Date; end: Date;}) => xz(d.middle) - xz(d.start));
    d3.selectAll('.end-bar')
      .attr('x', (d: {name: string; order: number; start: Date; middle: Date; end: Date;}) => xz(d.middle))
      .attr('width', (d: {name: string; order: number; start: Date; middle: Date; end: Date;}) => xz(d.end) - xz(d.middle));
  }

  private getBarHeight(name: string) {
    return this.y.bandwidth() / this.countOfName(name);
  }

  private countOfName(name: string) {
    return this.data.filter(d => d.name === name).length;
  }

  private getFill(name: string) {
    const barColor = this.barColors.find(b => b.name === name);
    return barColor?.color ?? '#000000';
  }

  private createXScale() {
    const minDate = d3.min(this.data.map(d => d.start));
    const maxDate = d3.max(this.data.map(d => d.end));
    let xDomain = [minDate, maxDate];
    let xRange = [0, this.width];
    // Time scale for dates
    return d3.scaleTime()
      .domain(xDomain)
      .range(xRange)
      .nice();
  }

  private createXAxis(g, x: d3.ScaleTime<number, number, never>) {
    g.attr('class', 'x-axis-group')
     .call(d3.axisTop(x).tickSize(-this.height).ticks(d3.timeDay))
     .selectAll('text')
     .attr('x', 14);
  }

  private createYScale() {
    let yDomain = [...new Set(this.data.map(d => d.name))];
    let yRange = [this.height, 0];
    // Band scale for names
    return d3.scaleBand()
      .domain(yDomain)
      .range(yRange)
      .padding(0.1);
  }

  private createYAxis(y: d3.ScaleBand<string>) {
    this.svg.append('g')
    .attr('class', 'y-axis-group')
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll('text')
      .attr('y', (y.bandwidth() / 2) * -1)
      .style('font-size', 20)
      .style('font-family', 'Roboto')
      .attr('dy', '.6em')
      .attr('dx', -20)
      .call(this.wrap, this.margin.left - 20)


    // <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
    //   <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
    // </svg>
    d3.select('.y-axis-group').selectAll('.tick')
      .append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('class', 'bi bi-pencil-fill')
      .attr('height', y.bandwidth())
      .attr('width', 18)
      .attr('y', ((y.bandwidth() / 2) * -1))
      .attr('x', '-18px')
      .style('fill', '#808080')
      .on('click', (_, i: string) => this.itemClicked(i))
      .style('cursor', 'pointer')
      .append('path')
      .attr('d', 'M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z');
  }

  private wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = .8, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            dx = parseFloat(text.attr("dx")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .attr("dx", -20)
                            .text(word);
            }
        }
    });
}
}
