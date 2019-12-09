import React, { Component } from 'react'
import Slope from './slope'
import Grid from './grid'
import DemoFilters from './demoFilters'
import { parseFilters, name } from './util'
import { max } from "d3-array"

class ConstSlopes extends Component {
  state = {
    filteredData: this.props.data,
    filters: this.props.filters
  }

  applyFilters = (externalFilters) => {
    // this.props.filterData(results.filter(d => d.noData !== true).concat(noData))
    const filteredData = externalFilters ? parseFilters(this.props.data, externalFilters) : parseFilters(this.props.data, this.state.filters)
    this.setState({ filteredData })
  }

  componentWillMount() {
    this.applyFilters()
  }

  render() {
    const { filteredData, filters } = this.state
    const { parties } = this.props
    const maxY = max(filteredData, d => Math.max(d.y2017_share_lab, d.y2017_share_con, d.y2017_share_ld, d.y2019_share_lab, d.y2019_share_con, d.y2019_share_ld));
    return(
      <>
        <DemoFilters filters={filters} applyFilters={(externalFilters) => this.applyFilters(externalFilters)} data={this.props.data} />
        <div class="ge-party-key">
            {parties.map(p => <div className={`ge-party-key__party ge-party-key__party--${p}`}>{name(p)}</div>)}
            <div class="ge-party-key__party ge-party-key__party--other">Other parties</div>
          </div>
        <Grid keyName='conslope' classes='ge-grid--slope' labels={filteredData.map(d => d.name)}>
          {filteredData.map((d, i) => <Slope data={d} maxY={maxY} parties={parties} label={d.name} marker={this.props.markers.find(m => m.ons === d.ons_id)} isConstituency={true} key={'conslope' + '-slope-' + i} />)}
        </Grid>
      </>
    )
  }
}

export default ConstSlopes