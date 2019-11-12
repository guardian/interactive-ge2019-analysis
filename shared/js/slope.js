import React, {Component, createRef} from 'react'
import * as d3 from "d3"

const labels = [
    "Lowest",
    "Second lowest",
    "Second highest",
    "Highest"
]

class Slope extends Component {
    wrapper = createRef();
    
    constructor(props) {
        super(props)
        this.state = {
            width : 60,
            padding: 10
        }
    }

    render() {
        const { data, i } = this.props
        const { width, padding } = this.state
        const xScale = d3.scaleLinear().domain([0, 1]).range([padding, width - padding]);
        const yScale = d3.scaleLinear().domain([0,1]).range([width, 0]);
        const r = 6*(width/300);

        return <div class="ge-slope-chart" ref={this.wrapper}>
            <svg width={width} height={width}>
                <line x1={0} x2={width} y1={width} y2={width} className="ge-slope-chart__baseline"></line>
                <line x1={0} x2={width} y1={width/2} y2={width/2} className="ge-slope-chart__midline"></line>
                {data.map(d => 
                    <g>
                        <line className={`ge-slope-chart__line ge-stroke--${d.party}`} x1={xScale(0)} x2={xScale(1)} y1={yScale(d["2017"])} y2={yScale(d["2019"])}></line>
                        <circle className={`ge-slope-chart__circle ge-fill--${d.party}`} cx={xScale(0)} cy={yScale(d["2017"])} r={r}></circle>
                        <circle className={`ge-slope-chart__circle ge-fill--${d.party}`} cx={xScale(1)} cy={yScale(d["2019"])} r={r}></circle> 
                    </g>
                )}
            </svg>
        </div>
    }

    componentDidMount() {
        const width = this.wrapper.current.getBoundingClientRect().width;
        this.setState({ width })
    }
}

export default Slope