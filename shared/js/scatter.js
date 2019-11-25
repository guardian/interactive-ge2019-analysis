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

        const filteredData = data.filter(d => {
            return d[x] !== "NA" && d[y] !== "NA"
        })

        const { width, padding } = this.state
        const xScale = d3.scaleLinear().domain(xDomain).range([padding, width - padding]);
        const yScale = d3.scaleLinear().domain(yDomain).range([width - padding, padding]);
        const r = 3.5;

        console.log(filteredData.find(d => d.ons_id === "N06000008"))

        window.test=  filteredData.find(d => d.ons_id === "N06000008")

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