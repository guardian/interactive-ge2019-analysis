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
            ttCoords: { x: 0, y: 0 },
            selectedFeature: null
        }
    }

    setHovered = (hovered, ttCoords, selectedFeature) => this.setState({ hovered, ttCoords, selectedFeature })

    render() {
        const { items, classes, labels } = this.props
        const { selectedFeature, ttCoords, hovered } = this.state

        return <div className={`ge-grid ${classes}`}>
            {items.map((item, i) => 
            <div className="ge-grid__item">
                <h3>{labels[i]}</h3>
                    {cloneElement(item, { hovered, setHovered: this.setHovered, ttCoords, selectedFeature })}
            </div>)}
        </div>
    }
}

export default Grid