import React, {Component} from 'react'

class Slope extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            width : 1260
        }
    }

    render() {
        const { data } = this.props
        const { width } = this.state

        return <div class="ge-demographic-slope">
            <Slope data={data}/>
        </div>
    }

    componentDidMount() {
        const width = window.innerWidth

        this.setState({ width })
    }
}

export default Slope