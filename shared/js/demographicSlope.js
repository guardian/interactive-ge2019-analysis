import React, {Component} from 'react'
import Slope from "shared/js/slope"

class DemographicSlope extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            // width : 1260
        }
    }

    render() {
        const { data } = this.props
        const { width } = this.state

        const testData = [
            {
                "party": "con",
                "2017": 0.34,
                "2019": 0.30
            },
            {
                "party": "lab",
                "2017": 0.55,
                "2019": 0.25
            },
            {
                "party": "ld",
                "2017": 0.05,
                "2019": 0.35
            },
            {
                "party": "green",
                "2017": 0.06,
                "2019": 0.10
            }
        ];

        return <div class="ge-demographic-slope">
            <Slope data={testData}/>
            <Slope data={testData}/>
            <Slope data={testData}/>
            <Slope data={testData}/>
        </div>
    }

    componentDidMount() {
        // const width = window.innerWidth

        // this.setState({ width })
    }
}

export default DemographicSlope