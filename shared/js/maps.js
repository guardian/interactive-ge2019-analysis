import React, { Component } from 'react'
import Grid from './grid'
import Map from "shared/js/map.js"
import colorScaleKey from "shared/js/map.js"

// const filters = [{ "id": 1573731749523, "demoType": "house_price", "operator": ">", "demoVal": "300000" }]
// const shadeDemo = { selectedDemo: 'brexit_leave', scaleColors: ['white', '#951d7a'], outOfScaleColor: [], shiftFirstColor: true, steps: 10, customClasses: null }
// const shadeDemo2 = { selectedDemo: 'y2017_turnout', scaleColors: ['yellow', 'green'], outOfScaleColor: [], shiftFirstColor: false, steps: 3, customClasses: null }

// const conVoteShare = { selectedDemo: 'y2017_share_con', scaleColors: ['white', '#0084c6'], outOfScaleColor: ["#ffffff"], shiftFirstColor: true, steps: 9, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], customDomain: [0.01, 0.8] }

// const labVoteShare = { selectedDemo: 'y2017_share_lab', scaleColors: ['white', '#c70000'], outOfScaleColor: ["#ffffff"], shiftFirstColor: true, steps: 9, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], customDomain: [0.01, 0.8] }

// const ldVoteShare = { selectedDemo: 'y2017_share_ld', scaleColors: ['white', '#ee6f00'], outOfScaleColor: ["#ffffff"], shiftFirstColor: true, steps: 9, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], customDomain: [0.01, 0.8] }

// const greenVoteShare = { selectedDemo: 'y2017_share_green', scaleColors: ['white', '#3db540'], outOfScaleColor: [], shiftFirstColor: true, steps: 9, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], customDomain: [0.01, 0.8] }

const turnoutChange = { selectedDemo: 'change_turnout_percent', scaleColors: ['blue', 'white', 'green'], outOfScaleColor: [], shiftFirstColor: false, steps: 6, customClasses: [-0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15] }



const parseValue = (num) => `> ${num}`


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
      <Grid keyName='maps' classes='ge-grid--300' labels={["Conservative vote share", 'Lab vote share', 'LD vote share', "Green vote share"]}>
        {/* unique key here?*/}
        <Map
          // shadeDemo={} 
          filters={[{ "id": 1574688796683, "demoType": "y2017_winner", "operator": "!=", "demoVal": "con" }, { "id": 1574688803429, "demoType": "y2019_winner", "operator": "==", "demoVal": "con" }]}
          geo={false}
          results={data}
          selectedFeature={selectedFeature}
          ttCoords={ttCoords}
          hovered={hovered}
          selectFeature={this.selectFeature}
          setHovered={this.setHovered}
          showKey={false}
          resultsDict={dataDict} />
        <Map
          // shadeDemo={labVoteShare} 
          filters={[{ "id": 1574688796683, "demoType": "y2017_winner", "operator": "!=", "demoVal": "lab" }, { "id": 1574688803429, "demoType": "y2019_winner", "operator": "==", "demoVal": "lab" }]}
          geo={false}
          results={data}
          selectedFeature={selectedFeature}
          ttCoords={ttCoords}
          hovered={hovered}
          selectFeature={this.selectFeature}
          setHovered={this.setHovered}
          showKey={false}
          resultsDict={dataDict} />
        <Map
          shadeDemo={turnoutChange}
          // filters={[{"id":1574688796683,"demoType":"y2017_winner","operator":"!=","demoVal":"lab"},{"id":1574688803429,"demoType":"y2019_winner","operator":"==","demoVal":"lab"}]}
          filters={[]}
          geo={false}
          results={data}
          selectedFeature={selectedFeature}
          ttCoords={ttCoords}
          hovered={hovered}
          selectFeature={this.selectFeature}
          setHovered={this.setHovered}
          showKey={{ parseValue: parseValue, noData: true, shape: 'circle' }}
          resultsDict={dataDict} />
        {/* <Map
      shadeDemo={ldVoteShare}
      filters={[]}
      geo={false}
      results={data}
      selectedFeature={selectedFeature}
      ttCoords={ttCoords}
      hovered={hovered}
      selectFeature={this.selectFeature}
      setHovered={this.setHovered}
      showKey={false}
      resultsDict={dataDict} />
    <Map
      shadeDemo={greenVoteShare}
      filters={[]}
      geo={false}
      results={data}
      selectedFeature={selectedFeature}
      ttCoords={ttCoords}
      hovered={hovered}
      selectFeature={this.selectFeature}
      setHovered={this.setHovered}
      showKey={false}
      resultsDict={dataDict} /> */}
      </Grid>
    )
  }
}

export default Maps