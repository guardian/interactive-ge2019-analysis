import React, { Component } from 'react'
import Grid from './grid'
import Map from "shared/js/map.js"
import PartyKey from './partyKey'

const filters = [{ "id": 1573731749523, "demoType": "house_price", "operator": ">", "demoVal": "300000" }]
const shadeDemo = { selectedDemo: 'brexit_leave', scaleColors: ['white', '#951d7a'], outOfScaleColor: [], shiftFirstColor: true, steps: 10, customClasses: null }
const shadeDemo2 = { selectedDemo: 'y2017_turnout', scaleColors: ['yellow', 'green'], outOfScaleColor: [], shiftFirstColor: false, steps: 3, customClasses: null }

const conVoteShareChange = { selectedDemo: 'change_share_con', scaleColors: ['white', '#0084c6'], outOfScaleColor: ["#f6f6f6"], shiftFirstColor: true, customClasses: [-5, 0.001, 0.05, 0.1, 0.15], customDomain: [0.001, 0.3] }

const labVoteShareChange = { selectedDemo: 'change_share_lab', scaleColors: ['white', '#c70000'], outOfScaleColor: ["#f6f6f6"], shiftFirstColor: true, customClasses: [-5, 0.001, 0.05, 0.1, 0.15], customDomain: [0.001, 0.3] }

const pc = (a) => Math.round(a*100)

const parseValue = (a, b, pos) => {
  if (pos === 'first') return `< ${pc(b)}%`
  if (pos === 'last') return `> ${pc(a)}%`
  return `${pc(a)} - ${pc(b)}%`
}

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
    const { data, dataDict, cartography, parties, showPartyKey } = this.props

    return (
      <>
      { showPartyKey && <PartyKey parties={parties} />}
      <Grid keyName='maps' classes='ge-grid--300' labels={["Where the Conservative vote increased", "Where the Labour vote increased"]}>
        <Map
          shadeDemo={conVoteShareChange} 
          filters={[]}
          markers={[]}
          geo={false}
          results={data}
          selectedFeature={selectedFeature}
          ttCoords={ttCoords}
          hovered={hovered}
          selectFeature={this.selectFeature}
          setHovered={this.setHovered}
          showKey={{ parseValue: parseValue, noData: true, shape: 'square' }}
          resultsDict={dataDict}
          showRegionNames={true}
          cartography={cartography} />
        <Map
          shadeDemo={labVoteShareChange} 
          filters={[]}
          markers={[]}
          geo={false}
          results={data}
          selectedFeature={selectedFeature}
          ttCoords={ttCoords}
          hovered={hovered}
          selectFeature={this.selectFeature}
          setHovered={this.setHovered}
          showKey={{ parseValue: parseValue, noData: true, shape: 'square' }}
          resultsDict={dataDict}
          cartography={cartography} />
      </Grid>
      </>
    )
  }
}

export default Maps