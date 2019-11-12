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
        const { items, classes, labels } = this.props;
        return <div className={`ge-grid ${classes}`}>
            {items.map((item, i) => 
            <div className="ge-grid__item">
                <h3>{labels[i]}</h3>
                {item}
            </div>)}
        </div>
    }

    componentDidMount() {

    }
}

export default Slope