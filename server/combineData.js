const fs = require("fs")
const rp = require("request-promise")

Promise.all([
    rp({json: true, uri: "https://interactive.guim.co.uk/docsdata-test/1wFmbda8IrBSCK2iVaLLWYhik5FBGNLZaTa4RJKkJkwE.json"}),
    rp({json: true, uri: "https://interactive.guim.co.uk/2017/06/ukelection2017-data/snap/full.json"})
]).then(dl => {
    const full = dl[1]
    const allDemographicData = dl[0].sheets.data


    // to-do: only combine the demographic data we're using in the interactive. Can be a manual process
    const all = full.map(f => {
        const demographicData = allDemographicData.find(d => d.ons_id === f.ons);

        if(!demographicData) {
            throw(`no match for ${f.ons}`);
        }
        
        return Object.assign({}, f, {demographicData})
    })

    fs.writeFileSync("./assets/data.json", JSON.stringify(all))
});