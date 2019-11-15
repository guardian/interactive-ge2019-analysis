import React,{ render } from "react"
import Map from "shared/js/map.js"
import Scatter from "shared/js/scatter.js"
import DemographicSlope from "shared/js/demographicSlope.js"
import DemoFilters from 'shared/js/demoFilters'
import Grid from "shared/js/grid.js"

const toDict = arr => {
  const out = {}
  arr.forEach(o => out[o.ons_id] = o)

  return out
}

const filters = [{ "id": 1573731749523, "demoType": "house_price", "operator": ">", "demoVal": "300000" }]
const shadeDemo = { selectedDemo: 'house_price', color: '#951d7a', shiftWhite: true, steps: 25, customDomain: null }


const loadAndDraw = async() => {
    const dataRequest = await fetch("<%= path %>/data.json")
    const data = await dataRequest.json()

    // render(<Grid labels={["Map one", "Map two", "Map three", "Map four"]} items={[<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />]}/>, document.querySelector(".interactive-wrapper"));
  render(<Grid labels={["Map one", 'Map two', 'map three']} items={[
  <Map 
    // shadeDemo={null} 
    filters={filters}
    geo={true}
    results={data}
    resultsDict={toDict(data, 'ons')} />,
  <Map 
    shadeDemo={shadeDemo} 
    filters={[]}
    geo={false}
    results={data}
    resultsDict={toDict(data, 'ons')} />,
  <Map
    // shadeDemo={shadeDemo}
    filters={[]}
    geo={false}
    results={data}
    resultsDict={toDict(data, 'ons')} />
    ]}/>,
    
  document.querySelector(".interactive-wrapper"));
    
    render(<Grid labels={["Scatter one"]} items={[<Scatter data={data} xDomain={[0, 0.75]} xTicks={[0, 0.25,0.5,0.75]} yTicks={[0, 0.1, 0.2]} yDomain={[0, 0.2]} x="brexit_leave" y="y2015_share_green"/>]}/>, document.querySelector(".gv-map"));
    
    render(<DemographicSlope data={data} demographic="brexit_leave" parties={["con", "lab", "ld"]}/>, document.querySelector(".interactive-wrapper2"));
}

loadAndDraw();
