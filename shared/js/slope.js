import React, { Component, createRef } from 'react'
import { scaleLinear } from "d3"

const parties = ['con', 'lab', 'snp', 'ld', 'green', 'dup', 'sf', 'pc'
//'bxp' 
]

const parseParties = (constituency, parties) =>
    parties.map(p => {
        if (p === 'bxp') {
            return {
                // name: constituency.name,
                party: p,
                2017: 0,
                2019: constituency.y2019_share_bxp
            }
        } else {
            return {
                // name: constituency.name,
                party: p,
                2017: constituency[`y2015_share_${p}`],
                2019: constituency[`y2017_share_${p}`]
            }
        }
    }).filter(p => isNaN(p['2017']) === false || !isNaN(p['2019']) === false)

class Slope extends Component {
    wrapper = createRef();
    
    constructor(props) {
        super(props)
        this.state = {
            data: props.isConstituency ? parseParties(props.data, parties) : props.data
        }
    }

    render() {
        const { width, data, xScale, yScale, r } = this.state
        
        return (
            <div class="ge-slope-chart" ref={this.wrapper}>
                {xScale && yScale && 
                    <svg width={width} height={width}>
                        <line x1={0} x2={width} y1={width} y2={width} className="ge-slope-chart__baseline"></line>
                        <line x1={0} x2={width} y1={width / 2} y2={width / 2} className="ge-slope-chart__midline"></line>
                        {data.map((d,i) =>
                            <g key={`${d.ons_id}-` + i}>
                                <line className={`ge-slope-chart__line ge-stroke--${d.party}`} x1={xScale(0) + r} x2={xScale(1) - r} y1={yScale(d["2017"])} y2={yScale(d["2019"])}></line>
                                <circle className={`ge-slope-chart__circle ge-fill--${d.party} ge-stroke--${d.party}`} cx={xScale(0)} cy={yScale(d["2017"])} r={r}></circle>
                                <circle className={`ge-slope-chart__circle ge-fill--${d.party} ge-stroke--${d.party}`} cx={xScale(1)} cy={yScale(d["2019"])} r={r}></circle>
                            </g>
                        )}
                    </svg>
                }
            </div>
        )
    }

    componentDidMount() {
        const padding = 10
        const width = this.wrapper.current.getBoundingClientRect().width;
        const xScale = scaleLinear().domain([0, 1]).range([padding, width - padding]);
        const yScale = scaleLinear().domain([0, 1]).range([width, 0]);
        const r = 6 * (width / 300);

        this.setState({ width, xScale, yScale, r })
    }
}

export default Slope