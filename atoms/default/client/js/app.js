import React,{ render } from "react"
import loadJson from 'shared/js/loadJson.js'
import Scatter from "shared/js/scatter.js"
import Grid from "shared/js/grid.js"
import Maps from "shared/js/maps.js"
import Maps2 from "shared/js/maps2.js"
import Maps3 from "shared/js/maps3.js"
import Maps4 from "shared/js/maps4.js"
import ConstSlopes from "shared/js/constSlopes.js"
import PartyKey from "shared/js/partyKey.js"
import fetch from 'unfetch'
import "core-js/stable";
import "regenerator-runtime/runtime";

const toDict = arr => {
  const out = {}
  arr.forEach(o => out[o.ons_id] = o)

  return out
}

const markers = [
  { n: 1, ons: "W07000060" },
  { n: 4, ons: "E14000716" },
  { n: 2, ons: "E14000569" },
  { n: 3, ons: "E14000891" }
]

const scatFilters = [{ "id": 1574937668187, "demoType": "brexit_leave", "operator": "top", "demoVal": "20" }]

const scatMarkers = [
  { n: 2, ons: "E14000582"},
  { n: 1, ons: "E14000622"},
]

const loadAndDraw = async() => {
  const dataRequest = await fetch("<%= path %>/data.json")
  const premap = await dataRequest.json()

  const data = premap.map(d => Object.assign({}, d, { 
    winArr: d.y2019_hold_gain ? d.y2019_hold_gain.match(/^(\S+)\s(.*)/).slice(1) : ['Undeclared',''], // change this to 'Undeclared',
    y2019_winner: d.y2019_winner ? d.y2019_winner : 'undeclared'
  }))

  // console.log(data);

  const dataDict = toDict(data)

  //load and draw maps async
  Promise.all([loadJson("<%= path %>/maps/hexagons.json"), loadJson('<%= path %>/maps/regions_mesh.json'), loadJson('<%= path %>/maps/region_names.json'), loadJson('<%= path %>/maps/carto_dissolved.json')])
    .then(([hexTopo, regions, regionNames, regionOutline]) => {
      const cartography = { hexTopo, regions, regionNames, regionOutline }

      render(<Maps cartography={cartography} markers={markers} data={data} dataDict={dataDict} showPartyKey={false} parties={['con', 'lab', 'ld']} />,
        document.getElementById("interactive-slot-1")
      )

      render(<Maps2 cartography={cartography} data={data} dataDict={dataDict} />,
        document.getElementById("interactive-slot-4")
      )

      // render(<Maps3 cartography={cartography} data={data} dataDict={dataDict} />,
      //   document.getElementById("interactive-slot-7")
      // )
    })

  render(
    <>
      <PartyKey parties={['con', 'lab', 'ld','snp', 'grn', 'pc']} />
      <Grid classes='ge-grid--scatter ge-grid--300' keyName='scat' labels={["Areas that voted to leave the EU swung to the Tories...", "...and deserted Labour"]}>
    <Scatter
        filters={[]}
        data={data}
        xDomain={[0.15, 0.85]}
        xTicks={[0.25, 0.5, 0.75]}
        yTicks={[-0.2, -0.1, 0, 0.1, 0.2]}
        yDomain={[-0.25, 0.25]}
        heightWidthRatio={1}
        x="brexit_leave"
        y="change_share_con"
        xLabel="Brexit leave (%) ⟶"
        yLabel="Change in Conservative vote share, 2017-2019 (%) ↑"
        xTickTransform={(d) => (d > 0) ? "+" + Math.round(d*100) + "%" : Math.round(d*100) + "%"}
        yTickTransform={(d) => (d > 0) ? "+" + Math.round(d*100) + "%" : Math.round(d*100) + "%"}
        xMajorTicks={[0]}
        yMajorTicks={[0]} 
        regressionLine={true}
        markers={scatMarkers}
        resultsDict={dataDict}
      />
      <Scatter
        filters={[]}
        data={data}
        xDomain={[0.15, 0.85]}
        xTicks={[0.25, 0.5, 0.75]}
        yTicks={[-0.2, -0.1, 0, 0.1, 0.2]}
        yDomain={[-0.25, 0.25]}
        heightWidthRatio={1}
        x="brexit_leave"
        y="change_share_lab"
        xLabel="Brexit leave (%) ⟶"
        yLabel="Change in Labour vote share, 2017-2019 (%) ↑"
        xTickTransform={(d) => (d > 0) ? "+" + Math.round(d*100) + "%" : Math.round(d*100) + "%"}
        yTickTransform={(d) => (d > 0) ? "+" + Math.round(d*100) + "%" : Math.round(d*100) + "%"}
        xMajorTicks={[0]}
        yMajorTicks={[0]} 
        regressionLine={true}
        markers={scatMarkers}
        resultsDict={dataDict}
        trendOffset={10}
      />
    </Grid>
    </>,
    document.getElementById("interactive-slot-2")
  )

  render(
    <ConstSlopes
    filters={[{"id":1574937647500,"demoType":"y2017_winner","operator":"==","demoVal":"lab"},{"id":1574937668187,"demoType":"brexit_leave","operator":"top","demoVal":"20"}]} 
    markers={[{ n: 1, ons: 'E14000669' }, { n: 2, ons: 'E14000541'}]} 
    // filters={[{ "id": 1573731749523, "demoType": "y2017_share_con", "operator": "top", "demoVal": "4" }]} 
    keyName='slopes'
    parties={["con", "lab", "ld", "bxp"]}
    itemClasses="ge-grid--slope"
    showPartyKey={true}
    data={data.filter(d => d.y2019_winner != 'undeclared')} />, document.getElementById("interactive-slot-3")
  )

  render(
    <ConstSlopes 
    filters={[{"id":1574937647500,"demoType":"region","operator":"==","demoVal":"Scotland"},{"id":1575897561779,"demoType":"y2017_winner","operator":"!=","demoVal":"snp"}]} 
    markers={[{ n: 1, ons: "S14000011" }, { n: 2, ons: "S14000037"}]}
    // filters={[{ "id": 1573731749523, "demoType": "y2017_share_con", "operator": "top", "demoVal": "4" }]} 
    keyName='slopes'
    parties={["con", "lab", "ld", "snp"]}
    itemClasses="ge-grid--slope"
    showPartyKey={true}
    data={data.filter(d => d.y2019_winner != 'undeclared')} />, document.getElementById("interactive-slot-6")
  )

  // render(
  //   <ConstSlopes 
  //   filters={[{"id":1574937647500,"demoType":"y2017_winner","operator":"==","demoVal":"con"},{"id":1574937668187,"demoType":"y2017_majority_percent","operator":"bottom","demoVal":"20"}]} 
  //   markers={[]} 
  //   // filters={[{ "id": 1573731749523, "demoType": "y2017_share_con", "operator": "top", "demoVal": "4" }]} 
  //   keyName='slopes'
  //   parties={["con", "lab", "ld", "snp"]}
  //   itemClasses="ge-grid--slope"
  //   data={data} />, document.getElementById("interactive-slot-5")
  // )


  render(
    <ConstSlopes 
    filters={[{"id":1574937647500,"demoType":"y2017_winner","operator":"==","demoVal":"con"},{"id":1574937668187,"demoType":"y2017_majority_percent","operator":"bottom","demoVal":"20"}]} 
    markers={[{ n: 2, ons: "E14000810" }, { n: 1, ons: "E14000974" }]} 
    // filters={[{ "id": 1573731749523, "demoType": "y2017_share_con", "operator": "top", "demoVal": "4" }]} 
    keyName='slopes'
    parties={["con", "lab", "ld", "snp"]}
    itemClasses="ge-grid--slope"
    showPartyKey={true}
    data={data.filter(d => d.y2019_winner != 'undeclared')} />, document.getElementById("interactive-slot-5")
  )

  // const [hexTopo, regions, regionNames, regionOutline] = await Promise.all([loadJson("<%= path %>/maps/hexagons.json"), loadJson('<%= path %>/maps/regions_mesh.json'), loadJson('<%= path %>/maps/region_names.json'), loadJson('<%= path %>/maps/carto_dissolved.json')])

  // const cartography = {
  //   hexTopo,
  //   regions,
  //   regionNames,
  //   regionOutline,
  // }

  // render(<Grid labels={["Map one", "Map two", "Map three", "Map four"]} items={[<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />,<Map results={data} resultsDict={toDict(data, 'ons')} />]}/>, document.querySelector(".interactive-wrapper"));

  // render(<Maps4 data={data} dataDict={dataDict} />,
  //   document.getElementById("interactive-slot-8")
  // )


  // // render(<DemographicSlope data={data} demographic="brexit_leave" parties={["con", "lab", "ld"]} />, document.getElementById("slope-demo"));
  
  // render(<Grid labels={["Leave voting areas had the lowest green party vote share", "Areas with high youth unemployment voted Labour in high numbers"]}>
  //   <Scatter data={data} xDomain={[-1, 1]} xTicks={[-1, 0, 1]} yTicks={[-1, 0, 1]} yDomain={[-1, 1]} x="change_turnout_percent" y="change_share_lab"/>
  //   {/* <Scatter data={data} xDomain={[0, 0.1]} xTicks={[0, 0.025, 0.05, 0.075, 0.1]} yTicks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]} yDomain={[0, 0.8]} x="unemployed_18_24" y="y2015_share_lab"/> */}
  // </Grid>, document.querySelector("#scatter"));
}

loadAndDraw();
