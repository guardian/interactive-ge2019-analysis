import React, {Component} from 'react'

class Slope extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            width : 300
        }
    }

    render() {
        const { data } = this.props
        const { width } = this.state

        return <div class="ge-slope-chart">
            <svg width={width} height={width}>
                {data.map(d => <line></line>)}
            </svg>
        </div>
    }

    componentDidMount() {
        const width = window.innerWidth

        this.setState({ width })
    }
}

export default Slope