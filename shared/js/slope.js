import React, { Component, createRef } from 'react'
import { scaleLinear, max } from "d3"

const parties = ['con', 'lab', 'ld', 'snp', 'bxp', 'green', 'dup', 'sf', 'pc','ukip', 'ind'
//'bxp' 
]

const cleanLabel = (l, m) => {
    const markerOffset = m ? 4 : 0
    if (l && l.length > (18 - markerOffset)) { 
        return l.substr(0, 16 - markerOffset) + "..."
    } else {
        return l;
    }
}

const cleanNumber = (num) => {
    if(num === 0) {
        return ""
    }
    return Math.round(num*100)
} 

const sort2019 = (a, b) => (b['2019'] > a['2019']) ? 1 : (b['2019'] === a['2019']) ? ((b['2019'] > a['2019']) ? 1 : -1) : -1 
const sort2017 = (a, b) => (b['2017'] > a['2017']) ? 1 : (b['2017'] === a['2017']) ? ((b['2017'] > a['2017']) ? 1 : -1) : -1 

const position = (_data, yScale) => {
    return _data.slice()
        .sort(sort2019).slice(0, 6).map((d, i, arr) => {
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
        if (!constituency[`y2017_share_${p}`]) {
            return {
                // name: constituency.name,
                party: p,
                2017: 0,
                2019: constituency[`y2019poll_share_${p}`] || 0
            }
        } else {
            return {
                // name: constituency.name,
                party: p,
                2017: constituency[`y2017_share_${p}`],
                2019: constituency[`y2019poll_share_${p}`] || 0
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
        const height = width * 1.5; 
        const innerWidth = width - (2*padding)
        const innerHeight = height - (2*padding)
        const xScale = scaleLinear().domain([0, 1]).range([padding, width - padding]); 
        const yScale = scaleLinear().domain([0, 0.9]).range([height - padding, padding]);
        const r = 5 * (width / 300);

        this.setState({ width, xScale, yScale, r, padding, innerWidth, innerHeight, height })
    }

    render() {
        const { width, data, xScale, yScale, r, winner, padding, innerWidth, height, innerHeight } = this.state
        const { label, marker } = this.props
        return (
            <div class={`ge-slope-chart`} ref={this.wrapper}>
                {xScale && yScale && 
                    <svg id={label} width={width} height={height}>
                        <text className="ge-slope-chart__label" x={width/2} y={15}>{cleanLabel(label)}</text>
                        {
                            marker &&
                            <g>
                                <circle cx={width - 10} cy={10} r={8} fill='#333' />
                                <text x={width - 10} y={10} dominant-baseline="central" className='gv-marker-text'>{marker.n}</text>
                            </g>
                        }
                        <rect width={innerWidth} y={padding} x={padding} height={innerHeight} class={`ge-fill--${winner}`} fillOpacity={winner ? 0.1 : 0}></rect>
                            {data.sort(sort2019).reverse().slice(0, 30).map((d,i) => 
                                <g key={`${d.ons_id}-` + i}>
                                    <line className={`ge-slope-chart__line ge-stroke--${d.party}`} x1={xScale(0) + r} x2={xScale(1) - r} y1={yScale(d["2017"])} y2={yScale(d["2019"])}></line>
                                    <circle className={`ge-slope-chart__circle ge-fill--${d.party} ge-stroke--${d.party}`} cx={xScale(0)} cy={yScale(d["2017"])} r={r}></circle>
                                    <circle className={`ge-slope-chart__circle ge-fill--${d.party} ge-stroke--${d.party}`} cx={xScale(1)} cy={yScale(d["2019"])} r={r}></circle>
                                </g>
                            )}
                            {position(data, yScale).slice(0, 30).map((d, i) => 
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