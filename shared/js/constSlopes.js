import React, { Component } from 'react'
import Slope from './slope'
import Grid from './grid'
import DemoFilters from './demoFilters'
import { parseFilters } from './util'

class ConstSlopes extends Component {
  state = {
    filteredData: this.props.data,
    filters: this.props.filters
  }

  applyFilters = () => {
    // this.props.filterData(results.filter(d => d.noData !== true).concat(noData))
    const filteredData = parseFilters(this.props.data, this.state.filters)
    this.setState({ filteredData })
  }

  componentWillMount() {
    this.applyFilters()
  }

  render() {
    const { filteredData, filters } = this.state
    return(
      <>
        <DemoFilters filters={filters} filterData={(filteredData, filters) => this.setState({ filteredData, filters })} data={this.props.data} />
        <Grid keyName='conslope' classes='ge-grid--slope' labels={filteredData.map(d => d.name)}>
          {filteredData.map((d, i) => <Slope data={d} label={d.name} marker={this.props.markers.find(m => m.ons === d.ons_id)} isConstituency={true} key={'conslope' + '-slope-' + i} />)}
        </Grid>
      </>
    )
  }
}

export default ConstSlopes