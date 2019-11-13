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

const loadAndDraw = async() => {
    const dataRequest = await fetch("<%= path %>/data.json")
    const data = await dataRequest.json()

    render(<Grid labels={["Map one", "Map two", "Map three", "Map four"]} items={[<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />]}/>, document.querySelector(".interactive-wrapper"));
    
    render(<Grid labels={["Leave voting areas had the lowest green party vote share", "Areas with high youth unemployment voted Labour in high numbers"]} items={[<Scatter data={data} xDomain={[0, 0.75]} xTicks={[0, 0.25,0.5,0.75]} yTicks={[0, 0.05, 0.1, 0.15, 0.2]} yDomain={[0, 0.2]} x="brexit_leave" y="y2015_share_green"/>,<Scatter data={data} xDomain={[0, 0.1]} xTicks={[0, 0.025, 0.05, 0.075, 0.1]} yTicks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]} yDomain={[0, 0.8]} x="unemployed_18_24" y="y2015_share_lab"/>]}/>, document.querySelector(".gv-map"));
    
    render(<DemographicSlope data={data} demographic="brexit_leave" parties={["con", "lab", "ld"]}/>, document.querySelector(".interactive-wrapper2"));
}

loadAndDraw();
