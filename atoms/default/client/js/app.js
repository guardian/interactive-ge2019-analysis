import React,{ render } from "react"
import Map from "shared/js/map.js"
import DemographicSlope from "shared/js/demographicSlope.js"
import DemoFilters from 'shared/js/demoFilters'

const toDict = arr => {
  const out = {}
  arr.forEach(o => out[o.ons_id] = o)

  return out
}

const loadAndDraw = async() => {
    const dataRequest = await fetch("<%= path %>/data.json")
    const data = await dataRequest.json()
    
    // render(<DemoFilters filterData={} data={data} />, document.querySelector(".gv-filters"))
    render(<Map results={data} resultsDict={toDict(data, 'ons')} />, document.querySelector(".gv-map"));
    render(<DemographicSlope data={data}/>, document.querySelector(".interactive-wrapper"));
}

loadAndDraw();
