import React,{ render } from "react"
import Scatter from "shared/js/scatter.js"
import Grid from "shared/js/grid.js"
import Maps from "shared/js/maps.js"
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

const loadAndDraw = async() => {
    const dataRequest = await fetch("<%= path %>/data.json")
    const data = await dataRequest.json()
    const dataDict = toDict(data)

  // render(<Grid labels={["Map one", "Map two", "Map three", "Map four"]} items={[<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />]}/>, document.querySelector(".interactive-wrapper"));
  render(<Maps markers={markers} data={data} dataDict={dataDict} />,
    document.getElementById("interactive-slot-1")
  )
  render(<Grid keyName='scat' labels={["Scatter one"]}>
     <Scatter
        data={data}
        xDomain={[0.1, 0.9]}
        xTicks={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]}
        yTicks={[-0.1, 0, 0.1, 0.2, 0.3]}
        yDomain={[-0.15, 0.35]}
        heightWidthRatio={1.2} 
        x="brexit_leave"
        y="change_share_lab"
        xLabel="Brexit leave vote (%) ▶"
        yLabel="Change in Labour vote (2017-2019) ▲"
        xTickTransform={(d) => Math.round(d*100) + "%"}
        yTickTransform={(d) => (d > 0) ? "+" + Math.round(d*100) + "%" : Math.round(d*100) + "%"}
        xMajorTicks={[0.5]}
        yMajorTicks={[0]} 
        markers={markers}
        resultsDict={dataDict}
      />
    </Grid>,
    document.getElementById("interactive-slot-2")
  )

  render(
    <ConstSlopes 
    markers={markers} 
    // filters={[{ "id": 1573731749523, "demoType": "y2017_share_con", "operator": "top", "demoVal": "4" }]} 
    keyName='slopes'
    filters={[]}
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
