import React, {Component, createRef} from 'react'
import * as d3 from "d3"

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
        const { items, classes } = this.props;
        return <div className={`ge-grid ${classes}`}>
            {items.map(item => 
            <div className="ge-grid__item">
                {item}
            </div>)}
        </div>
    }

    componentDidMount() {

    }
}

export default Slope