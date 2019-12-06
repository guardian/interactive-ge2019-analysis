import React, { Component, createRef } from 'react'
import * as d3 from "d3"
import Tooltip from './tooltip'
import DemoFilters from './demoFilters'
import {linearRegression, linearRegressionLine} from 'simple-statistics'
import { parseFilters } from './util';
 
class Scatter extends Component {
    wrapper = createRef();
    
    constructor(props) {
        super(props)

        const padding = 0
        const width = 60
        const height = width * props.heightWidthRatio

        this.state = {
            width,
            height,
            padding,
            filteredData: props.data,
            markers: [],
            hovered: {obj: null, marker: false},
            ttCoords: { x: 0, y: 0 },
            xScale: d3.scaleLinear().domain(props.xDomain).range([padding, width - padding]),
            yScale: d3.scaleLinear().domain(props.yDomain).range([height - padding, padding]),
            voronoi: []
        }
    }

    setHovered = (hovered, ttCoords) => this.setState({ hovered, ttCoords })

    hover = (ons, x, y, marker)  => {
        const hovered = this.props.resultsDict[ons]
        // this.props.setHovered(obj, { x, y })
        this.setHovered({obj: hovered, marker: marker}, { x, y })
    }

    applyFilters = (externalFilters) => {
        const { x, y } = this.props
        const { width, height, xScale, yScale } = this.state
        const filteredDemo = this.props.data.filter(d => d[x] && d[y] && typeof (d[x]) === "number" && typeof (d[y]) === "number").filter(d => {
            return !isNaN(d[x]) && !isNaN(d[y])
        })

        const ms = this.props.markers.map(m => m.ons)
        const preMarkerFiltered = externalFilters ? parseFilters(filteredDemo, externalFilters) : parseFilters(filteredDemo, this.props.filters)

        const filteredData = preMarkerFiltered.filter(d => ms.indexOf(d.ons_id) > -1 ? false : d)

        const markers = this.props.markers.map(m => {
            const obj = preMarkerFiltered.find(d => d.ons_id === m.ons)

            return Object.assign({}, obj, { marker: m.n })
        })


        const voronoi = d3.voronoi()
            .extent([[0, 0], [width, height]])
            .x(d => xScale(d[x]))
            .y(d => yScale(d[y]))
            .polygons(filteredData.concat(markers))

        this.setState({ filteredData, markers, voronoi: voronoi.map(v => Object.assign({}, v, { path: "M" + v.join("L") + "Z"})) })
    }

    render() {
        const { i, regressionLine = false, x, y, xDomain, xLabel, yLabel, yDomain, xTicks, yTicks, heightWidthRatio = 1, xTickTransform = (c) => c, yTickTransform = (c) => c, xMajorTicks, yMajorTicks } = this.props
        const { markers, filteredData, hovered, ttCoords, xScale, yScale, width, height, voronoi } = this.state
        
        const lrdata = filteredData.map(d => ([d[x], d[y]]))
        const lr = linearRegression(lrdata)
        const line = linearRegressionLine(lr)

        const minX = d3.min(lrdata, d => d[0])
        const maxX = d3.max(lrdata, d => d[0])
    
        const r = 3.5;
        
        return <div class="ge-scatter-plot" ref={this.wrapper}>
            <DemoFilters filters={this.props.filters} applyFilters={(externalFilters) => this.applyFilters(externalFilters)} data={this.props.data} />
            {hovered && <Tooltip constituency={hovered.obj} x={ttCoords.x} y={ttCoords.y} />}
            <svg width={width} height={height} onMouseLeave={() => this.hover(null, 0, 0, false)}>
                <g class="axis--x axis">
                    {xTicks.map(d => <g className={xMajorTicks.includes(d) ? `major-tick` : ``}>
                        <line y1={yScale(yDomain[0])} y2={yScale(yDomain[1])} x1={xScale(d)} x2={xScale(d)}></line>
                        <text x={xScale(d)} y={yScale(yDomain[0])}>{xTickTransform(d)}</text>
                    </g>)}
                    <text className={`ge-scatter-label`} y={yScale(yDomain[0]) + 16} x={0}>{xLabel}</text>
                </g>
                <g class="axis--y axis">
                    {yTicks.map(d => <g className={yMajorTicks.includes(d) ? `major-tick` : ``}>
                        <line x1={xScale(xDomain[0])} x2={xScale(xDomain[1])} y1={yScale(d)} y2={yScale(d)}></line>
                        <text y={yScale(d)} x={xScale(xDomain[0])}>{yTickTransform(d)}</text>   
                    </g>)}
                    <text className={`ge-scatter-label`} y={yScale(yTicks[yTicks.length -1]) - 16} x={0}>{yLabel}</text>
                </g>
                <g>
                    {filteredData.map(d => {
                        const cx = xScale(d[x])
                        const cy = yScale(d[y])
                        return <circle id={`${d.ons_id}`} cx={cx} cy={cy} r={r} className={`ge-fill--${d["y2017_winner"].toLowerCase()} ge-stroke--${d["y2017_winner"].toLowerCase()}`} />
                    })}
                </g>
                {regressionLine && 
                    <g>
                        <line x1={xScale(minX)} y1={yScale(line(minX))} x2={xScale(maxX)} y2={yScale(line(maxX))} stroke="#000" stroke-width="3"></line>
                    </g>
                }
                <g>
                {markers.map(d =>
                    {
                        const cx = xScale(d[x])
                        const cy = yScale(d[y])
                        return (
                            <g>
                                <circle id={`${d.ons_id}`} cx={cx} cy={cy} r={r * 2.5} className={`ge-scatter-marker ge-fill--${d["y2017_winner"].toLowerCase()} ge-stroke--${d["y2017_winner"].toLowerCase()}`}></circle>
                                <text x={cx} y={cy} class='gv-marker-text' dominant-baseline="central" >{d.marker}</text>
                            </g>
                        )
                    }
                )}
                </g>
                {hovered.obj && <circle cx={xScale(hovered.obj[x])} cy={yScale(hovered.obj[y])} r={hovered.marker ? r * 2.5 : r} class='circle-selected' />}
                <g>
                    {
                        voronoi.map(area => {
                            const cx = xScale(area.data[x])
                            const cy = yScale(area.data[y])
                            const isMarker = area.data.marker !== undefined
                            const offset = isMarker ? 25 : 30

                            return <path d={area.path} class='ge-scatter-voronoi' onMouseEnter={() => { this.hover(area.data.ons_id, cx, cy + offset, isMarker)}} />
                        })
                    }
                </g>
            </svg>
        </div>
    }


    componentDidMount() {
        const { heightWidthRatio } = this.props
        const width = this.wrapper.current.getBoundingClientRect().width;
        const height = heightWidthRatio * width
        const padding = this.state.padding
        const xScale = d3.scaleLinear().domain(this.props.xDomain).range([padding, width - padding]);
        const yScale = d3.scaleLinear().domain(this.props.yDomain).range([height - padding, padding]);

        
        this.setState({ width, height, xScale, yScale }, () => this.applyFilters())
    }

    componentDidUpdate(prevProps) {
        if (prevProps.filters !== this.props.filters) this.applyFilters()
    }
}

export default Scatter