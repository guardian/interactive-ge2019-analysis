import React,{render} from "react"
import DemographicSlope from "shared/js/demographicSlope.js"

const loadAndDraw = async() => {
    const dataRequest = await fetch("<%= path %>/data.json")
    const data = await dataRequest.json()

    render(<div>
        <DemographicSlope data={data} demographic="brexit_leave" parties={["con", "lab", "ld"]}/>
        {/* <DemographicSlope data={data} demographic="income" parties={["con", "lab", "ld"]}/>
        <DemographicSlope data={data} demographic="pop_65" parties={["con", "lab", "ld"]}/>
        <DemographicSlope data={data} demographic="educ_noqual" parties={["con", "lab", "ld"]}/>
        <DemographicSlope data={data} demographic="avg_house_price" parties={["con", "lab", "ld"]}/>
        <DemographicSlope data={data} demographic="house_own" parties={["con", "lab", "ld"]}/>
        <DemographicSlope data={data} demographic="house_price" parties={["con", "lab", "ld"]}/>
        <DemographicSlope data={data} demographic="occup_hi_mgmt" parties={["con", "lab", "ld"]}/> */}
    </div>, document.querySelector(".interactive-wrapper"));
}

loadAndDraw();