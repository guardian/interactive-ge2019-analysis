import React, { Component, createRef } from 'react'
import { scaleLinear } from "d3-scale"
import { max } from "d3-array" 

const parties = [] 

function chunkString(str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
  }

const cleanLabel = (l, m) => {
    const chunks = l.split(" ").reduce((accumulator, currentValue, currentIndex, array) => {
        if(accumulator[accumulator.length - 1].length < 16 && (accumulator[accumulator.length - 1].length + currentValue.length < 16)) {
            accumulator[accumulator.length - 1] += (" " + currentValue)
        } else {
            accumulator.push(currentValue);
        }
        return accumulator
    }, [""]).filter(d => d !== "");

    if(l === "Ashton-upon-Lyne") {
        // console.log(chunks)
    }

    if(chunks.length === 1 && chunks[0].length > 15) {
        return [chunkString(l, 14)[0] + "..."]
    }

    if(chunks.length > 2) {
        chunks[1] += "..."
        return chunks.slice(0, 2)
    } 
    return chunks;
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
            d.yPos2019 = (i > 0 && arr[i - 1].yPos2019 && _yPos2019 - arr[i - 1].yPos2019 < 13) ? _yPos2019 + (13 -(_yPos2019 - arr[i - 1].yPos2019)) : _yPos2019
     
            return d;
        })
        .sort(sort2017).map((d,i, arr) => { 
            const _yPos2017 = yScale(d["2017"])
            d.yPos2017 = (i > 0 && arr[i - 1].yPos2017 && _yPos2017 - arr[i - 1].yPos2017 < 13) ? _yPos2017 + (13 -(_yPos2017 - arr[i - 1].yPos2017)) : _yPos2017
        
            return d;
        }); 
}

const sum = (a, b) => a + b
 
const parseParties = (constituency, parties, partiesToKeep) => {
    const _ = Object.keys(constituency).filter(c => c.indexOf("_share_") > -1).map(d => d.split("_")[2]).filter((v,i, arr) => arr.indexOf(v) === i)
   
    const parsed = _.map(p => {
        if (!constituency[`y2017_share_${p}`]) {
            return {
                // name: constituency.name,
                party: p,
                2017: 0,
                2019: constituency[`y2019_share_${p}`] || 0
            }
        } else {
            return {
                // name: constituency.name,
                party: p,
                2017: constituency[`y2017_share_${p}`],
                2019: constituency[`y2019_share_${p}`] || 0
            }
        }
    }).filter(p => isNaN(p['2017']) === false && isNaN(p['2019']) === false).filter(p => p["2017"] !== 0 || p["2019"] !== 0).sort(sort2019);

    console.log(constituency.name, parsed)

    const othersCollapsed = {
        party: 'oth',
        "2017": (parsed.filter(p => !partiesToKeep.includes(p.party))).map(d => d["2017"]).reduce(sum, 0),
        "2019": (parsed.filter(p => !partiesToKeep.includes(p.party))).map(d => d["2019"]).reduce(sum, 0),
    }

    if(othersCollapsed["2017"] !== 0 || othersCollapsed["2019"] !== 0) {
        return (parsed.filter(p => partiesToKeep.includes(p.party)).concat([othersCollapsed])).reverse();
    } else {
        return parsed;
    }
}

class Slope extends Component {
    wrapper = createRef();
    
    constructor(props) {
        super(props)

        this.state = {
            width: 200,
            innerWidth: 160,
            data: props.isConstituency ? parseParties(props.data, parties, props.parties) : props.data,
            winner: props.isConstituency ? props.data.y2017_winner : null
        }
    }

    resize = (width) => {
        const padding = 24
        const height = width * 1.25;  
        const innerWidth = width - (2*padding)
        const innerHeight = height
        const xScale = scaleLinear().domain([0, 1]).range([padding, width - padding]); 
        const yScale = scaleLinear().domain([0, this.props.maxY]).range([height, 0]);
        const r = 5 * (width / 300);

        this.setState({ width, xScale, yScale, r, padding, innerWidth, innerHeight, height })
    }

    render() {
        const { width, data, xScale, yScale, r, winner, padding, innerWidth, height, innerHeight } = this.state
        const { label, marker } = this.props

        console.log(label, data)
        return (
            <div class={`ge-slope-chart`} ref={this.wrapper}>
                {xScale && yScale && 
                    <svg id={label} width={width} height={height}>
                        {/* {
                            marker &&
                            <g>
                                <circle cx={width - 10} cy={10} r={8} fill='#333' />
                                <text x={width - 10} y={10} dominant-baseline="central" className='gv-marker-text'>{marker.n}</text>
                            </g>
                        } */} 
                        {/* <rect width={innerWidth} y={padding*2} x={padding} height={innerHeight} class={`ge-fill--${winner}`} fillOpacity={winner ? 0.05 : 0}></rect>  */}
                        <line className="slope-axis" x1={padding} x2={padding} y1={0} y2={innerHeight}></line>
                        <line className="slope-axis" x1={width - padding} x2={width - padding} y1={0} y2={innerHeight}></line>
                            {data.reverse().slice(0, 30).map((d,i) => 
                                <g key={`${d.ons_id}-` + i}>
                                    <line className={`ge-slope-chart__line ge-stroke--${d.party}`} x1={xScale(0) + r} x2={xScale(1) - r} y1={yScale(d["2017"])} y2={yScale(d["2019"])}></line>
                                    <circle className={`ge-slope-chart__circle ge-fill--${d.party} ge-stroke--${d.party}`} cx={xScale(0)} cy={yScale(d["2017"])} r={r}></circle>
                                    <circle className={`ge-slope-chart__circle ge-fill--${d.party} ge-stroke--${d.party}`} cx={xScale(1)} cy={yScale(d["2019"])} r={r}></circle>
                                </g>
                            )}
                            {position(data, yScale).slice(0, 30).map((d, i) => 
                                <>
                                    <text x={padding - 5} y={d.yPos2017} className={`ge-slope-chart__num ge-fill--${d.party}`}>{cleanNumber(d["2017"])}</text>
                                    <text x={width - padding + 5} y={d.yPos2019} className={`ge-slope-chart__num  ge-slope-chart__num--right ge-fill--${d.party}`}>{cleanNumber(d["2019"])}</text>
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