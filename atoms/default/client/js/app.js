import React,{render} from "react"
import DemographicSlope from "shared/js/demographicSlope.js"

const loadAndDraw = async() => {
    const dataRequest = await fetch("<%= path %>/data.json")
    const data = await dataRequest.json()

    render(<DemographicSlope data={data}/>, document.querySelector(".interactive-wrapper"));
}

loadAndDraw();