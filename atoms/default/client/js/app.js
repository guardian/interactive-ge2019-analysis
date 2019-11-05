import React,{ render } from "react"
import Slope from "shared/js/slope.js"
import Map from "shared/js/map.js"

const loadAndDraw = async() => {
    const dataRequest = await fetch("<%= path %>/data.json")
    const data = await dataRequest.json()

    render(<Slope data={data}/>, document.querySelector(".interactive-wrapper"));
    render(<Map />, document.querySelector(".gv-map"));
}

loadAndDraw();
