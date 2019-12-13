import React, { Component } from 'react'
import Grid from './grid'
import Map from "shared/js/map.js"
import PartyKey from './partyKey'
// import colorScaleKey from "shared/js/map.js"

// const filters = [{ "id": 1573731749523, "demoType": "house_price", "operator": ">", "demoVal": "300000" }]
// const shadeDemo = { selectedDemo: 'brexit_leave', scaleColors: ['white', '#951d7a'], outOfScaleColor: [], shiftFirstColor: true, steps: 10, customClasses: null }
// const shadeDemo2 = { selectedDemo: 'y2017_turnout', scaleColors: ['yellow', 'green'], outOfScaleColor: [], shiftFirstColor: false, steps: 3, customClasses: null }

const conVoteShare = { selectedDemo: 'y2019_share_con', scaleColors: ['white', '#0084c6'], outOfScaleColor: ["#f6f6f6f6"], shiftFirstColor: true, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5], customDomain: [0.01, 0.5] }

const labVoteShare = { selectedDemo: 'y2019_share_lab', scaleColors: ['white', '#c70000'], outOfScaleColor: ["#f6f6f6f6"], shiftFirstColor: true, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5], customDomain: [0.01, 0.5] }

const ldVoteShare = { selectedDemo: 'y2019_share_ld', scaleColors: ['white', '#ee6f00'], outOfScaleColor: ["#f6f6f6f6"], shiftFirstColor: true, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5], customDomain: [0.01, 0.5] }

const greenVoteShare = { selectedDemo: 'y2019_share_green', scaleColors: ['white', '#3db540'], outOfScaleColor: ["#f6f6f6f6"], shiftFirstColor: true, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5], customDomain: [0.01, 0.5] }

const snpVoteShare = { selectedDemo: 'y2019_share_snp', scaleColors: ['white', '#ffbb50'], outOfScaleColor: ["#f6f6f6f6"], shiftFirstColor: true, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5], customDomain: [0.01, 0.5] }

const turnoutChange = { selectedDemo: 'change_turnout_percent', scaleColors: ['blue', 'white', 'green'], outOfScaleColor: [], shiftFirstColor: false, steps: 6, customClasses: [-0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15] }


const labels = ["Conservative gains", 'Labour gains', 'Lib Dem gains', "SNP gains"]


const pc = (a) => Math.round(a*100)


const parseValue = (a, b, pos) => {
  if (pos === 'first') return `< ${pc(b)}%`
  if (pos === 'last') return `> ${pc(a)}%`
  return `${pc(a)} - ${pc(b)}%`
}


const parseVoteShare = (string, value) => `${!isNaN(value) ? (Number(value) * 100).toFixed(2) + '%' : 'NA'}`


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
    const { data, dataDict, cartography, showPartyKey, parties } = this.props

    return (
      <>
      {showPartyKey && <PartyKey parties={parties} />}
      <Grid keyName='maps' classes='ge-grid--300' labels={labels}>
        {/* unique key here?*/}
        <Map
          // shadeDemo={conVoteShare} 
          filters={[{"id":1575638518431,"demoType":"y2017_winner","operator":"!=","demoVal":"con"},{"id":1575638526495,"demoType":"y2019_winner","operator":"==","demoVal":"con"}]}
          geo={false}
          results={data}
          selectedFeature={selectedFeature}
          ttCoords={ttCoords}
          hovered={hovered}
          selectFeature={this.selectFeature}
          setHovered={this.setHovered}
          showKey={{ parseValue: parseValue, noData: true, shape: 'square' }}
          markers={this.props.markers}
          resultsDict={dataDict}
          showRegionNames={true}
          ttString={parseVoteShare}
          titleLabel={labels[0]}
          cartography={cartography}
           />
        <Map
          // shadeDemo={labVoteShare} 
          filters={[{"id":1575638518431,"demoType":"y2017_winner","operator":"!=","demoVal":"lab"},{"id":1575638526495,"demoType":"y2019_winner","operator":"==","demoVal":"lab"}]}
          geo={false}
          results={data}
          selectedFeature={selectedFeature}
          ttCoords={ttCoords}
          hovered={hovered}
          selectFeature={this.selectFeature}
          setHovered={this.setHovered}
          showKey={{ parseValue: parseValue, noData: true, shape: 'square' }}
          markers={[]}
          resultsDict={dataDict}
          ttString={parseVoteShare}
          cartography={cartography}
          titleLabel={labels[1]} />
        <Map
          // shadeDemo={ldVoteShare} 
          filters={[{"id":1575638518431,"demoType":"y2017_winner","operator":"!=","demoVal":"ld"},{"id":1575638526495,"demoType":"y2019_winner","operator":"==","demoVal":"ld"}]}
          geo={false}
          results={data}
          selectedFeature={selectedFeature}
          ttCoords={ttCoords}
          hovered={hovered}
          selectFeature={this.selectFeature}
          setHovered={this.setHovered}
          showKey={{ parseValue: parseValue, noData: true, shape: 'square' }}
          markers={[]}
          resultsDict={dataDict}
          ttString={parseVoteShare}
          cartography={cartography}
          titleLabel={labels[2]} />
        <Map
          // shadeDemo={snpVoteShare} 
          filters={[{"id":1575638518431,"demoType":"y2017_winner","operator":"!=","demoVal":"snp"},{"id":1575638526495,"demoType":"y2019_winner","operator":"==","demoVal":"snp"}]}
          geo={false}
          results={data}
          selectedFeature={selectedFeature}
          ttCoords={ttCoords}
          hovered={hovered}
          selectFeature={this.selectFeature}
          setHovered={this.setHovered}
          markers={[]}
          showKey={{ parseValue: parseValue, noData: true, shape: 'square' }}
          resultsDict={dataDict}
          ttString={parseVoteShare}
          cartography={cartography}
          titleLabel={labels[3]} />
      </Grid>
      </>
    )
  }
}

export default Maps