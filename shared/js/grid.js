import React, { Component, createRef, cloneElement, Children } from 'react'

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
    selectFeature = selectedFeature => this.setState({ selectedFeature })

    render() {
        const { children, classes, labels, keyName, itemClasses } = this.props
        const { selectedFeature, ttCoords, hovered } = this.state

        return <div className={`ge-grid ${classes}`}>
            {
            Children.map(children, (child, i) =>
                <div className={`ge-grid__item ${itemClasses}`} 
                key={`${keyName}-${i + labels.length}`}>
                <h3>{labels[i]}</h3>
                    {cloneElement(child, { hovered, setHovered: this.setHovered, selectFeature: this.selectFeature, ttCoords, selectedFeature })}
            </div>) 
            }
        </div>
    }
}

export default Grid