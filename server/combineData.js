const fs = require("fs")
const rp = require("request-promise")

const calcChangeFor = [['y2015_turnout_percent', 'y2017_turnout_percent'],['y2017_share_lab', 'y2019poll_share_lab'], ['y2017_share_con', 'y2019poll_share_con'], ['y2017_share_ld', 'y2019poll_share_ld']]

const demosToKeep = [
    // 'name',
    // 'ons_id',
    // 'y2017_share_lab',
    // 'y2019poll_share_lab',
    // 'y2017_share_con'
]

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
    "Lib Dem": "ld",
    "LD": "ld"
}

const partyLookupRev = {
	"con": "Con",
	"lab": "Lab",
	"ld": "LD",
	"bxp": "Brexit",
	"ukip": "Ukip"
  }

const name = (p) => {
    console.log(p);
    return partyLookupRev[p] || p.toUpperCase()
}

const cleanName = (p) => {
    if(partyLookup[p]) {
        return partyLookup[p]
    } else {

        return p;
    }
}

const find2019Result = (result2019, party) => {
    const match = result2019.candidates.find(c => cleanName(c.party) === cleanName(party))
    return match ? match.percentageShare/100 : 0
}

Promise.all([
    rp({json: true, uri: "https://interactive.guim.co.uk/docsdata-test/1wFmbda8IrBSCK2iVaLLWYhik5FBGNLZaTa4RJKkJkwE.json"}),
    rp({json: true, uri: "https://interactive.guim.co.uk/2019/12/ukelection2019-data/prod/snap/full.json"})
]).then(dl => {
    const full = dl[1]
    const allDemographicData = dl[0].sheets.data

    const all = allDemographicData.map(d => {
        const result2019 = full.find(f => d.ons_id === f.ons)
        const newFields = {}

        d.y2019_leave_tactical = 'false'
        d.y2019_remain_tactical = 'false'

        if(result2019 && result2019.candidates) {
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
            d.y2017_winner = cleanName(d.y2017_winner)
            d.y2015_winner = cleanName(d.y2015_winner)

            // JUST FOR POLL DATA!!!!

            // const y2019poll_shares = [
            //     {"party": "con", "share": d.y2019poll_share_con},
            //     {"party": "lab", "share": d.y2019poll_share_lab},
            //     {"party": "ld", "share": d.y2019poll_share_ld},
            //     {"party": "green", "share": d.y2019poll_share_green},
            //     {"party": "pc", "share": d.y2019poll_share_pc},
            //     {"party": "bxp", "share": d.y2019poll_share_bxp},
            //     {"party": "snp", "share": d.y2019poll_share_snp}
            // ]

            // const maxVoteShare = Math.max(d.y2019poll_share_con, d.y2019poll_share_lab, d.y2019poll_share_ld, d.y2019poll_share_green, d.y2019poll_share_snp, d.y2019poll_share_bxp, d.y2019poll_share_pc)

            // if(maxVoteShare > 0) {
                // d.y2019_winner = ((y2019poll_shares.find(v => v.share == maxVoteShare))).party
              
                newFields.y2019_hold_gain = (newFields.y2019_winner === d.y2017_winner) ? name(newFields.y2019_winner) + " hold" : name(newFields.y2019_winner) + " gain from " + name(d.y2017_winner)
                newFields.y2019_leave_tactical = false
                newFields.y2019_remain_tactical = false
            
                if(newFields.y2019_winner === "con") {
                    newFields.y2019_remain_tactical = Number(newFields.y2019_share_lab) + Number(newFields.y2019_share_green) + Number(newFields.y2019_share_pc) + Number(newFields.y2019_share_ld) + Number(newFields.y2019_share_snp) > Number(newFields.y2019_share_con)
                } 

                if(newFields.y2019_winner === "lab" || newFields.y2019_winner === "ld" || newFields.y2019_winner === "snp") {
                    newFields.y2019_leave_tactical = Number(newFields.y2019_share_con) + Number(newFields.y2019_share_bxp) > Number(newFields[`y2019_share_${d.y2019_winner}`])
                } 

                newFields.y2019_remain_tactical = newFields.y2019_remain_tactical.toString()
                newFields.y2019_leave_tactical = newFields.y2019_leave_tactical.toString()
            // }

            // need to deal with "other" – does this include ind?
            // need to add brexit party once we have 2019 test data

            // 2017 data doesn't include raw votes for each party, so I'm not
            // bringing that across here either. It can be calculated by
            // multiplying vote share by turnout
        } else {
            newFields.result2019 = false
        }

        let obj = Object.assign({}, d, newFields)

        let newObj = Object.assign({}, ...Object.keys(obj).map(key => ({ [key]: typeof obj[key] === 'boolean' || isNaN(Number(obj[key])) ? obj[key] : Number(obj[key]) })));

        return newObj
    }).filter(v => true || v.result2019)

    console.log(`REMAIN ALLIANCE COUNT ${all.filter(c => c.y2019_remain_tactical === "true").length}`)

    const allWithChange = all.map(d => {
        let changes = {}
        calcChangeFor.forEach(f => {
            const keyName = 'change_' + f[0].split(/_(.+)/)[1]
            if (d[f[0]] == undefined || d[f[1]] == undefined || d[f[0]] === 'NA' || d[f[1]] === 'NA' || isNaN(Number(d[f[0]])) || isNaN(Number(d[f[1]])) ) {
                changes[keyName] = 'NA'
            } else {
                changes[keyName] = Number(d[f[1]]) - Number(d[f[0]])
            }
        })

        return  Object.assign({}, d, changes)
    })
    .map(d =>
        Object.keys(d)
            .filter(key => demosToKeep.length === 0 ? key: demosToKeep.includes(key))
            .reduce((obj, key) => {
                obj[key] = d[key]
                return obj
            }, {})
    )

    fs.writeFileSync("./assets/data.json", JSON.stringify(allWithChange.filter(d => d.name !== 0)))
});