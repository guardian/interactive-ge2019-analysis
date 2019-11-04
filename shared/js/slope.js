import React, {Component} from 'react'

class Slope extends Component {

    constructor(props) {
        super(props)

        this.state = {
            width : 1260
        }
    }

    render() {

    const { results } = this.props

    return <div class="test">Hello World!</div>

    }

    componentDidMount() {

        const width = window.innerWidth

        this.setState({ width })

    }
}

export default Slope