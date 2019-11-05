const fs = require("fs")
const rp = require("request-promise")

const partyLookup = {
    "Lab Co-op" : "lab",
    "Lab": "lab",
    "Con": "con",
    "PC": "pc",
    "SNP": "snp",
    "SF": "sf",
    "Green": "green",
    "UKIP": "ukip",
    "DUP": "dup",
    "Lib Dem": "ld"
}

const cleanName = (p) => {
    if(partyLookup[p]) {
        return partyLookup[p]
    } else {
        return p;
    }
}

const find2019Result = (result2019, party) => {
    const match = result2019.candidates.find(c => c.party === cleanName(party))
    return match ? match.percentageShare/100 : 0
}

Promise.all([
    rp({json: true, uri: "https://interactive.guim.co.uk/docsdata-test/1wFmbda8IrBSCK2iVaLLWYhik5FBGNLZaTa4RJKkJkwE.json"}),
    rp({json: true, uri: "https://interactive.guim.co.uk/2017/06/ukelection2017-data/snap/full.json"})
]).then(dl => {
    const full = dl[1]
    const allDemographicData = dl[0].sheets.data

    const all = allDemographicData.map(d => {
        const result2019 = full.find(f => d.ons_id === f.ons)
        const newFields = {}

        if(result2019) {
            newFields.result2019 = true
            newFields.y2019_winner = cleanName(result2019.winningParty)
            newFields.y2019_electorate = result2019.y2019_electorate
            newFields.y2019_turnout = result2019.turnout
            newFields.y2019_turnout_percent = result2019.percentageTurnout/100
            newFields.y2019_majority_percent = result2019.majority/100
            // we can add raw votes majority if needed but it needs to be calculated from the candidates
            newFields.y2019_share_con = find2019Result(result2019, "Con")
            newFields.y2019_share_lab = find2019Result(result2019, "Lab")
            newFields.y2019_share_pc = find2019Result(result2019, "PC")
            newFields.y2019_share_ukip = find2019Result(result2019, "UKIP")
            newFields.y2019_share_ld = find2019Result(result2019, "Lib Dem")
            newFields.y2019_share_snp = find2019Result(result2019, "SNP")
            newFields.y2019_share_dup = find2019Result(result2019, "DUP")
            newFields.y2019_share_green = find2019Result(result2019, "Green")
            newFields.y2019_share_sf = find2019Result(result2019, "SF")
            // need to deal with "other" – does this include ind?
            // need to add brexit party once we have 2019 test data

            // 2017 data doesn't include raw votes for each party, so I'm not
            // bringing that across here either. It can be calculated by
            // multiplying vote share by turnout
        } else {
            newFields.result2019 = false
        }

        return Object.assign({}, d, newFields)
    })

    fs.writeFileSync("./assets/data.json", JSON.stringify(all))
});