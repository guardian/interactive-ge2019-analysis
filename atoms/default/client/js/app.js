import React,{ render } from "react"
import Map from "shared/js/map.js"
import Scatter from "shared/js/scatter.js"
import DemographicSlope from "shared/js/demographicSlope.js"
import DemoFilters from 'shared/js/demoFilters'
import Grid from "shared/js/grid.js"
import Slope from "shared/js/slope.js"
import ConstSlopes from "shared/js/constSlopes.js"

const toDict = arr => {
  const out = {}
  arr.forEach(o => out[o.ons_id] = o)

  return out
}

const filters = [{ "id": 1573731749523, "demoType": "house_price", "operator": ">", "demoVal": "300000" }]
const shadeDemo = { selectedDemo: 'brexit_leave', scaleColors: ['white', '#951d7a'], outOfScaleColor: [], shiftFirstColor: true, steps: 10, customClasses: null }
const shadeDemo2 = { selectedDemo: 'y2017_turnout', scaleColors: ['yellow', 'green'], outOfScaleColor: [], shiftFirstColor: false, steps: 3, customClasses: null }

const conVoteShare  = { selectedDemo: 'y2017_share_con', scaleColors: ['white', '#0084c6'], outOfScaleColor: ["#ffffff"], shiftFirstColor: true, steps: 9, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], customDomain: [0.01,0.8] }

const labVoteShare  = { selectedDemo: 'y2017_share_lab', scaleColors: ['white', '#c70000'], outOfScaleColor: ["#ffffff"], shiftFirstColor: true, steps: 9, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], customDomain: [0.01,0.8] }

const ldVoteShare  = { selectedDemo: 'y2017_share_ld', scaleColors: ['white', '#ee6f00'], outOfScaleColor: ["#ffffff"], shiftFirstColor: true, steps: 9, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], customDomain: [0.01, 0.8] } 

const greenVoteShare = { selectedDemo: 'y2017_share_green', scaleColors: ['white', '#3db540'], outOfScaleColor: [], shiftFirstColor: true, steps: 9, customClasses: [0, 0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], customDomain: [0.01, 0.8] }

const loadAndDraw = async() => {
    const dataRequest = await fetch("<%= path %>/data.json")
    const data = await dataRequest.json()
    const dataDict = toDict(data)

  // render(<Grid labels={["Map one", "Map two", "Map three", "Map four"]} items={[<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />]}/>, document.querySelector(".interactive-wrapper"));
  render(<Grid keyName='maps' labels={["Conservative vote share", 'Lab vote share', 'LD vote share', "Green vote share"]}>
    <Map 
      shadeDemo={conVoteShare} 
      filters={[]}
      geo={false}
      results={data}
      resultsDict={dataDict} />
    <Map 
      shadeDemo={labVoteShare} 
      filters={[]}
      geo={false}
      results={data}
      resultsDict={dataDict} />
    <Map
      shadeDemo={ldVoteShare}
      filters={[]}
      geo={false}
      results={data}
      resultsDict={dataDict} />
    <Map
      shadeDemo={greenVoteShare}
      filters={[]}
      geo={false}
      results={data}
      resultsDict={dataDict} />
    </Grid>,
    document.getElementById("maps")
  )
  render(<Grid keyName='scat' labels={["Scatter one"]}>
     <Scatter data={data} xDomain={[0, 0.75]} xTicks={[0, 0.25,0.5,0.75]} yTicks={[0, 0.1, 0.2]} yDomain={[0, 0.2]} x="brexit_leave" y="y2015_share_green"/>
    </Grid>,
    document.getElementById("scatter")
  )

  render(
    <ConstSlopes 
    // filters={[{ "id": 1573731749523, "demoType": "y2017_share_con", "operator": "top", "demoVal": "4" }]} 
    filters={[]}
    data={data} />, document.getElementById("slope-const")
  )


  // render(<DemographicSlope data={data} demographic="brexit_leave" parties={["con", "lab", "ld"]} />, document.getElementById("slope-demo"));
  
  render(<Grid labels={["Leave voting areas had the lowest green party vote share", "Areas with high youth unemployment voted Labour in high numbers"]}>
    <Scatter data={data} xDomain={[0, 0.75]} xTicks={[0, 0.25,0.5,0.75]} yTicks={[0, 0.05, 0.1, 0.15, 0.2]} yDomain={[0, 0.2]} x="brexit_leave" y="y2015_share_green"/>
    <Scatter data={data} xDomain={[0, 0.1]} xTicks={[0, 0.025, 0.05, 0.075, 0.1]} yTicks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]} yDomain={[0, 0.8]} x="unemployed_18_24" y="y2015_share_lab"/>
  </Grid>, document.querySelector(".gv-map"));
}

loadAndDraw();
