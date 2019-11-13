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
        const { data, i, x, y, xDomain, yDomain, xTicks, yTicks } = this.props
        const { width, padding } = this.state
        const xScale = d3.scaleLinear().domain(xDomain).range([padding, width - padding]);
        const yScale = d3.scaleLinear().domain(yDomain).range([width - padding, padding]);
        const r = 5;

        return <div class="ge-scatter-plot" ref={this.wrapper}>
            <svg width={width} height={width}>
                <g class="axis--x axis">
                    {xTicks.map(d => <>
                        <line y1={yScale(yDomain[0])} y2={yScale(yDomain[1])} x1={xScale(d)} x2={xScale(d)}></line>
                        <text x={xScale(d)} y={yScale(yDomain[0])}>{d}</text>
                    </>)}
                </g>
                <g class="axis--y axis">
                    {yTicks.map(d => <>
                        <line x1={xScale(xDomain[0])} x2={xScale(xDomain[1])} y1={yScale(d)} y2={yScale(d)}></line>
                        <text y={yScale(d)} x={xScale(xDomain[0])}>{d}</text>  
                    </>)}
                </g>
                <g>
                    {data.map(d => <circle cx={xScale(d[x])} cy={yScale(d[y])} r={r} className={`ge-fill--${d["y2017_winner"]} ge-stroke--${d["y2017_winner"]}`}></circle>)}
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