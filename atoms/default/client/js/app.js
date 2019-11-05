import React,{ render } from "react"
import Slope from "../../../../shared/js/slope.js"
import Map from "../../../../shared/js/map.js"
// import * as util from "../../../../shared/js/util.js"
// console.log(util)
// console.log(Slope, util)

render(<Map />, document.querySelector(".gv-map"));
render(<Slope />, document.querySelector(".interactive-wrapper"));