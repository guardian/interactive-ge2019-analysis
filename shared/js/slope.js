import React, { Component, createRef } from 'react'
import { scaleLinear } from "d3"

const parties = ['con', 'lab', 'ld', 'snp', 'bxp', 'green', 'dup', 'sf', 'pc','ukip'
//'bxp' 
]

const cleanLabel = (l) => {
    if(l && l.length > 18) { 
        return l.substr(0, 16) + "..."
    } else {
        return l;
    }
}

const cleanNumber = (num) => {
    return Math.round(num*100)
} 

const sort2019 = (a, b) => (b['2019'] > a['2019']) ? 1 : (b['2019'] === a['2019']) ? ((b['2019'] > a['2019']) ? 1 : -1) : -1 
const sort2017 = (a, b) => (b['2017'] > a['2017']) ? 1 : (b['2017'] === a['2017']) ? ((b['2017'] > a['2017']) ? 1 : -1) : -1 

const position = (_data, yScale) => {
    return _data.slice()
        .sort(sort2019).slice(0, 3).map((d, i, arr) => {
            const _yPos2019 = yScale(d["2019"])
            d.yPos2019 = (i > 0 && arr[i - 1].yPos2019 && _yPos2019 - arr[i - 1].yPos2019 < 11) ? _yPos2019 + (11 -(_yPos2019 - arr[i - 1].yPos2019)) : _yPos2019
     
            return d;
        })
        .sort(sort2017).map((d,i, arr) => { 
            const _yPos2017 = yScale(d["2017"])
            d.yPos2017 = (i > 0 && arr[i - 1].yPos2017 && _yPos2017 - arr[i - 1].yPos2017 < 11) ? _yPos2017 + (11 -(_yPos2017 - arr[i - 1].yPos2017)) : _yPos2017
        
            return d;
        }); 
}
 
const parseParties = (constituency, parties) =>
    parties.map(p => {
        if (p === 'bxp') {
            return {
                // name: constituency.name,
                party: p,
                2017: 0,
                2019: constituency.y2019_share_bxp || 0
            }
        } else {
            return {
                // name: constituency.name,
                party: p,
                2017: constituency[`y2015_share_${p}`],
                2019: constituency[`y2017_share_${p}`]
            }
        }
    }).filter(p => isNaN(p['2017']) === false || !isNaN(p['2019']) === false).filter(p => p["2017"] !== 0 || p["2019"] !== 0)

class Slope extends Component {
    wrapper = createRef();
    
    constructor(props) {
        super(props)
        this.state = {
            width: 200,
            innerWidth: 160,
            data: props.isConstituency ? parseParties(props.data, parties) : props.data,
            winner: props.isConstituency ? props.data.y2017_winner : null
        }
    }

    resize = (width) => {
        const padding = 20
        const innerWidth = width - (2*padding)
        const xScale = scaleLinear().domain([0, 1]).range([padding, width - padding]); 
        const yScale = scaleLinear().domain([0, 1]).range([width - padding, padding]);
        const r = 6 * (width / 300);

        this.setState({ width, xScale, yScale, r, padding, innerWidth })
    }

    render() {
        const { width, data, xScale, yScale, r, winner, padding, innerWidth } = this.state
        const { label } = this.props
        return (
            <div class={`ge-slope-chart`} ref={this.wrapper}>
                {xScale && yScale && 
                    <svg width={width} height={width}>
                        <text className="ge-slope-chart__label" x={width/2} y={15}>{cleanLabel(label)}</text>
                        <rect width={innerWidth} y={padding} x={padding} height={innerWidth} class={`ge-fill--${winner}`} fillOpacity={winner ? 0.1 : 0}></rect>
                            {data.map((d,i) => 
                                <g key={`${d.ons_id}-` + i}>
                                    <line className={`ge-slope-chart__line ge-stroke--${d.party}`} x1={xScale(0) + r} x2={xScale(1) - r} y1={yScale(d["2017"])} y2={yScale(d["2019"])}></line>
                                    <circle className={`ge-slope-chart__circle ge-fill--${d.party} ge-stroke--${d.party}`} cx={xScale(0)} cy={yScale(d["2017"])} r={r}></circle>
                                    <circle className={`ge-slope-chart__circle ge-fill--${d.party} ge-stroke--${d.party}`} cx={xScale(1)} cy={yScale(d["2019"])} r={r}></circle>
                                </g>
                            )}
                            {position(data, yScale).map((d, i) => 
                                <>
                                    <text x={15} y={d.yPos2017} className={`ge-slope-chart__num ge-fill--${d.party}`}>{cleanNumber(d["2017"])}</text>
                                    <text x={width - 15} y={d.yPos2019} className={`ge-slope-chart__num  ge-slope-chart__num--right ge-fill--${d.party}`}>{cleanNumber(d["2019"])}</text>
                                </>
                            )}
                    </svg>
                }
            </div>
        )
    }

    componentDidUpdate(_, prevState) {
        const width = this.wrapper.current.getBoundingClientRect().width;

        if (prevState.width !== width) {
            this.resize(width)
        }
    }

    componentDidMount() {
        const width = this.wrapper.current.getBoundingClientRect().width;

        this.resize(width)
    }
}

export default Slope