import React, { Component, createRef, cloneElement} from 'react'
import * as d3 from "d3"

class Grid extends Component {
    wrapper = createRef();
    
    constructor(props) {
        super(props)
        this.state = {
            width : 60,
            padding: 10,
            hovered: null,
            ttCoords: { x: 0, y: 0 }
        }
    }

    setHovered = (hovered, ttCoords) => this.setState({ hovered, ttCoords })

    render() {
        const { items, classes, labels } = this.props;
        return <div className={`ge-grid ${classes}`}>
            {items.map((item, i) => 
            <div className="ge-grid__item">
                <h3>{labels[i]}</h3>
                    {cloneElement(item, { hovered: this.state.hovered, setHovered: this.setHovered, ttCoords: this.state.ttCoords })}
            </div>)}
        </div>
    }
}

export default Grid