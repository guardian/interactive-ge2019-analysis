import React, { PureComponent, Children } from 'react'

class Grid extends PureComponent {
    render() {
        const { children, classes, labels, keyName } = this.props

        return <div className={`ge-grid ${classes}`}>
            {
            Children.map(children, (child, i) => {

            return <div className={`ge-grid__item`} 
                key={`${keyName}-${i + labels.length}`}>
                {keyName === "conslope" && child.props.marker ? (
                    <h3 data-label={child.props.marker.n} className="has-marker">{labels[i]}</h3>
                ) : (
                    <h3>{labels[i]}</h3>
                )}
                {child}
            </div>
            }) 
            }
        </div>
    }
}

export default Grid