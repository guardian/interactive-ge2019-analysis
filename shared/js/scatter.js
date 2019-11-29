import React, {Component, createRef} from 'react'
import * as d3 from "d3"
 
class Scatter extends Component {
    wrapper = createRef();
    
    constructor(props) {
        super(props)
        this.state = {
            width : 60,
            padding: 0
        }
    }

    render() {
        const { data, i, x, y, xDomain, xLabel, yLabel, yDomain, xTicks, yTicks, heightWidthRatio = 1, xTickTransform = (c) => c, yTickTransform = (c) => c, xMajorTicks, yMajorTicks } = this.props

        const filteredData = data.filter(d => {
            return d[x] !== "NA" && d[y] !== "NA"
        })

        const { width, padding } = this.state
        console.log(width, heightWidthRatio)
        const height = width*heightWidthRatio
        const xScale = d3.scaleLinear().domain(xDomain).range([padding, width - padding]);
        const yScale = d3.scaleLinear().domain(yDomain).range([height - padding, padding]);
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
            </svg>
        </div>
    }

    componentDidMount() {
        const width = this.wrapper.current.getBoundingClientRect().width;
        this.setState({ width })
    }
}

export default Scatter