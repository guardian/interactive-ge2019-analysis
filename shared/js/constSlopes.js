import React, { Component } from 'react'
import Slope from './slope'
import Grid from './grid'
import DemoFilters from './demoFilters'

class ConstSlopes extends Component {
  state = {
    filteredData: this.props.data,
    filters: this.props.filters
  }

  applyFilters = () => {
    let results = this.props.data
    let noData = []
    const { filters } = this.state

    filters.forEach(f => {
      if (f.operator === 'top' || f.operator === 'bottom') {

        const pick = results
          .filter(r => {
            if (r[f.demoType] === 'NA') noData.push(Object.assign({}, r, { noData: true }))

            return isNaN(Number(r[f.demoType])) === false
          })
          .sort((a, b) => Number(a[f.demoType]) > Number(b[f.demoType]) ? -1 : 1)
        results = f.operator === 'top' ? pick.slice(0, f.demoVal) : pick.slice(1).slice(- Number(f.demoVal))

      }

      results = results.filter(d => {
        if (d[f.demoType] === 'NA') {
          noData.push(Object.assign({}, d, { noData: true }))
          return false
        }

        if (f.operator === '<') {
          return d[f.demoType] < f.demoVal
        }
        if (f.operator === '>') {
          return d[f.demoType] > f.demoVal
        }
        if (f.operator === '==') {

          if (isNaN(Number(d[f.demoType]))) {
            return d[f.demoType].toLowerCase() == f.demoVal.toLowerCase()
          } else {
            return d[f.demoType] == f.demoVal
          }
        }
        if (f.operator === 'top' || f.operator === 'bottom') {
          return d
        }
      })
    })

    // this.props.filterData(results.filter(d => d.noData !== true).concat(noData))
    this.setState({ filteredData: results.filter(d => d.noData !== true).concat(noData) })
  }

  componentWillMount() {
    this.applyFilters()
  }

  render() {
    const { filteredData, filters } = this.state
    return(
      <>
        <DemoFilters filters={filters} filterData={(filteredData, filters) => this.setState({ filteredData, filters })} data={this.props.data} />
        <Grid keyName='conslope' classes="ge-grid--slope" itemClasses='ge-grid__item--slope' labels={filteredData.map(d => d.name)}>
          {filteredData.map((d, i) => <Slope data={d} isConstituency={true} key={'conslope' + '-slope-' + i} />)}
        </Grid>
      </>
    )
  }
}

export default ConstSlopes