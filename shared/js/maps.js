import React, { Component } from 'react'
import Grid from './grid'
import Map from "shared/js/map.js"
import colorScaleKey from "shared/js/map.js"

class Maps extends Component {
  state = {
    hovered: null,
    ttCoords: { x: 0, y: 0 },
    selectedFeature: null
  }

  setHovered = (hovered, ttCoords, selectedFeature) => this.setState({ hovered, ttCoords, selectedFeature })
  selectFeature = selectedFeature => this.setState({ selectedFeature })


  render() {
    const { selectedFeature, ttCoords, hovered } = this.state
    const { data, dataDict } = this.props

    return (
      <Grid keyName='maps' classes='ge-grid--300' labels={[]}>
        {/* unique key here?*/}
        <Map
          // shadeDemo={conVoteShare} 
          filters={[]}
          geo={true}
          results={data}
          selectedFeature={selectedFeature}
          ttCoords={ttCoords}
          hovered={hovered}
          selectFeature={this.selectFeature}
          setHovered={this.setHovered}
          // showKey={{ parseValue: parseValue, noData: true, shape: 'square' }}
          markers={this.props.markers}
          resultsDict={dataDict} />
      </Grid>
    )
  }
}

export default Maps