import React, {Component} from 'react'
import Slope from "shared/js/slope"
import Grid from "shared/js/grid"
import * as d3 from "d3"

class DemographicSlope extends Component {

    constructor(props) {
        super(props)
        const {demographic, parties} = props;
        
        const sortedByDemographic = props.data.filter(d => d.name).sort((a,b) => {
            if(a[demographic] > b[demographic]) {
                return 1;
            } else if(a[demographic] === b[demographic]) { 
                return 0;
            } else {
                return -1;
            }
        }); 

        const binned = [sortedByDemographic.slice(0, 162),
        sortedByDemographic.slice(162, 325),
        sortedByDemographic.slice(325, 487),
        sortedByDemographic.slice(487)]

        const binAverages = binned.map((bin) => {
            return parties.map(p => {
                const totalVotesBin2019 = d3.sum(bin, d => d.y2017_turnout)
                const totalVotesBin2017 = d3.sum(bin, d => d.y2015_turnout)
                
                return {
                    "party": p,
                    "2019": d3.sum(bin, d => Math.round(d[`y2017_share_${p}`]*d[`y2017_turnout`]))/totalVotesBin2019,
                    "2017": d3.sum(bin, d => Math.round(d[`y2015_share_${p}`]*d[`y2015_turnout`]))/totalVotesBin2017
                }
            });
        });

        this.state = {
            binAverages
        }
    }

    render() {
        const { data, demographic, parties} = this.props
        const { binAverages } = this.state

        return <Grid labels={["Lowest", "Second lowest", "Second highest", "Highest"]} classes="ge-grid--2-col-mobile" items={binAverages.map((bin, i) => <Slope data={bin} i={i}/>)}/>
    }

    componentDidMount() {
    }
}

export default DemographicSlope