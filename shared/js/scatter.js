import React, {Component, createRef} from 'react'
import * as d3 from "d3"
import {linearRegression, linearRegressionLine} from 'simple-statistics'
 
class Scatter extends Component {
    wrapper = createRef();
    
    constructor(props) {
        super(props)
        this.state = {
            width : 60,
            padding: 0,
            filteredData: [],
            markers: []
        }
    }

    render() {
        const { i, regressionLine = false, x, y, xDomain, xLabel, yLabel, yDomain, xTicks, yTicks, heightWidthRatio = 1, xTickTransform = (c) => c, yTickTransform = (c) => c, xMajorTicks, yMajorTicks } = this.props
        const { markers, filteredData } = this.state

        // const filteredData = data.filter(d => {
        //     return d[x] !== "NA" && d[y] !== "NA"
        // })

        const { width, padding } = this.state
        const height = width*heightWidthRatio
        const xScale = d3.scaleLinear().domain(xDomain).range([padding, width - padding]);
        const yScale = d3.scaleLinear().domain(yDomain).range([height - padding, padding]);
        const lrdata = filteredData.map(d => ([d[x], d[y]]))
        const lr = linearRegression(lrdata)
        const line = linearRegressionLine(lr)

        const minX = d3.min(lrdata, d => d[0])
        const maxX = d3.max(lrdata, d => d[0])
    
        const r = 3.5;

        return <div class="ge-scatter-plot" ref={this.wrapper}>
            <svg width={width} height={height}>
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
                    {filteredData.map(d => <circle id={`${d.ons_id}`} cx={xScale(d[x])} cy={yScale(d[y])} r={r} className={`ge-fill--${d["y2017_winner"]} ge-stroke--${d["y2017_winner"]}`}></circle>)}
                </g>
                {regressionLine && 
                    <g>
                        <line x1={xScale(minX)} y1={yScale(line(minX))} x2={xScale(maxX)} y2={yScale(line(maxX))} stroke="#000" stroke-width="3"></line>
                    </g>
                }
                <g>
                {markers.map(d =>
                    <g>
                        <circle id={`${d.ons_id}`} cx={xScale(d[x])} cy={yScale(d[y])} r={r * 2.5} className={`ge-scatter-marker ge-fill--${d["y2017_winner"]} ge-stroke--${d["y2017_winner"]}`}></circle>
                        <text x={xScale(d[x])} y={yScale(d[y])} class='gv-marker-text' dominant-baseline="central" >{d.marker}</text>
                    </g>
                )}
                </g>
            </svg>
        </div>
    }


    componentDidMount() {
        const { x, y} = this.props

        const width = this.wrapper.current.getBoundingClientRect().width;
        const filteredDemo = this.props.data.filter(d => d[x] && d[y] && typeof(d[x]) === "number" && typeof(d[y]) === "number").filter(d => {
            return d[x] !== "NA" && d[y] !== "NA"
        })


    {/* .filter(d => d[x] && d[y] && typeof(d[x]) === "number" && typeof(d[y]) === "number").filter(d => {
            return d[x] !== "NA" && d[y] !== "NA"
        }) */}

        const ms = this.props.markers.map(m => m.ons)

        const filteredData = filteredDemo.filter(d => ms.indexOf(d.ons_id) > -1 ? false : d)
        
        const markers = this.props.markers.map(m => {
            const obj = filteredDemo.find(d => d.ons_id === m.ons)

            return Object.assign({}, obj, { marker: m.n })
        })

        this.setState({ width, filteredData, markers })
    }
}

export default Scatter