import React,{render} from "react"
import Slope from "shared/js/slope.js"

const loadAndDraw = async() => {
    const dataRequest = await fetch("<%= path %>/data.json")
    const data = await dataRequest.json()

    render(<Slope data={data}/>, document.querySelector(".interactive-wrapper"));
}

loadAndDraw();