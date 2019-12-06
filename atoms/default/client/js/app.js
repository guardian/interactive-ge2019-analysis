import React,{ render } from "react"
import Scatter from "shared/js/scatter.js"
import Grid from "shared/js/grid.js"
import Maps from "shared/js/maps.js"
import Maps2 from "shared/js/maps2.js"
import ConstSlopes from "shared/js/constSlopes.js"
import fetch from 'unfetch'
import "core-js/stable";
import "regenerator-runtime/runtime";

const toDict = arr => {
  const out = {}
  arr.forEach(o => out[o.ons_id] = o)

  return out
}

const markers = [
  { n: 1, ons: "E14001011" },
  { n: 2, ons: "E14000662" },
  { n: 3, ons: "E14000973" },
  { n: 4, ons: "E14000975" }
]

const scatFilters = [{ "id": 1574937668187, "demoType": "brexit_leave", "operator": "top", "demoVal": "20" }]

const scatMarkers = [
  { n: 1, ons: 'E14000577'}
]

const loadAndDraw = async() => {
    const dataRequest = await fetch("<%= path %>/data.json")
    const premap = await dataRequest.json()
    const data = await premap.map(d => Object.assign({}, d, { 
      winArr: d.y2019_hold_gain ? d.y2019_hold_gain.match(/^(\S+)\s(.*)/).slice(1) : 'SNP gain from PC'.match(/^(\S+)\s(.*)/).slice(1), // change this to 'Undeclared',
      y2019_winner: d.y2019_winner ? d.y2019_winner : 'undeclared'
    }))
    const dataDict = toDict(data)

  // render(<Grid labels={["Map one", "Map two", "Map three", "Map four"]} items={[<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />]}/>, document.querySelector(".interactive-wrapper"));
  render(<Maps markers={markers} data={data} dataDict={dataDict} />,
    document.getElementById("interactive-slot-1")
  )

  render(<Maps2 data={data} dataDict={dataDict} />,
    document.getElementById("interactive-slot-4")
  )
  render(<Grid keyName='scat' labels={["Scatter one"]}>
     <Scatter
        filters={[]}
        data={data}
        xDomain={[0, 1]}
        xTicks={[0, 0.5, 1]}
        yTicks={[0, 0.25, 0.5, 0.75]}
        yDomain={[0, 0.85]}
        heightWidthRatio={1}
        x="brexit_leave"
        y="y2019poll_share_con"
        xLabel="Brexit leave vote share (%) ⟶"
        yLabel="Conservative vote share, 2019 (%) ↑"
        // xTickTransform={(d) => Math.round(d*100) + "%"}
        yTickTransform={(d) => (d > 0) ? "+" + Math.round(d*100) + "%" : Math.round(d*100) + "%"}
        xMajorTicks={[0]}
        yMajorTicks={[0]} 
        regressionLine={true}
        markers={scatMarkers}
        resultsDict={dataDict}
      />
    </Grid>,
    document.getElementById("interactive-slot-2")
  )

  // render(<Grid keyName='scat' labels={["Scatter one"]}>
  //   <Scatter
  //     data={data}
  //     xDomain={[0, 0.9]}
  //     yDomain={[0, 0.3]}
  //     xTicks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]}
  //     yTicks={[0, 0.1, 0.2, 0.3]}
  //     x="brexit_leave"
  //     y="y2019poll_share_bxp"
  //     xLabel="Conservative vote 2017 (%) ▶"
  //     yLabel="Change in Conservative vote (2017-2019) ▲"
  //     xTickTransform={(d) => Math.round(d*100) + "%"}
  //     yTickTransform={(d) => (d > 0) ? "+" + Math.round(d*100) + "%" : Math.round(d*100) + "%"}
  //     xMajorTicks={[0.5]}
  //     yMajorTicks={[0]}   
  //   />
  // </Grid>,
  // document.getElementById("interactive-slot-2")
  // )

  render(
    <ConstSlopes 
    filters={[{"id":1574937647500,"demoType":"y2017_winner","operator":"==","demoVal":"lab"},{"id":1574937668187,"demoType":"brexit_leave","operator":"top","demoVal":"20"}]} 
    markers={markers} 
    // filters={[{ "id": 1573731749523, "demoType": "y2017_share_con", "operator": "top", "demoVal": "4" }]} 
    keyName='slopes'
    parties={["con", "lab", "ld", "bxp"]}
    itemClasses="ge-grid--slope"
    data={data} />, document.getElementById("interactive-slot-3")
  )

  // // render(<DemographicSlope data={data} demographic="brexit_leave" parties={["con", "lab", "ld"]} />, document.getElementById("slope-demo"));
  
  // render(<Grid labels={["Leave voting areas had the lowest green party vote share", "Areas with high youth unemployment voted Labour in high numbers"]}>
  //   <Scatter data={data} xDomain={[-1, 1]} xTicks={[-1, 0, 1]} yTicks={[-1, 0, 1]} yDomain={[-1, 1]} x="change_turnout_percent" y="change_share_lab"/>
  //   {/* <Scatter data={data} xDomain={[0, 0.1]} xTicks={[0, 0.025, 0.05, 0.075, 0.1]} yTicks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]} yDomain={[0, 0.8]} x="unemployed_18_24" y="y2015_share_lab"/> */}
  // </Grid>, document.querySelector("#scatter"));
}

loadAndDraw();
