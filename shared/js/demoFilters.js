import React, { Component } from 'react'
import { parseFilters } from './util'

class DemoFilters extends Component {

  state = {
    demoType: null,
    operator: null,
    demoVal: null,
    filters: this.props.filters
  }

  addFilter = () => {
    const { filters, demoType, operator, demoVal } = this.state

    filters.push({
      id: new Date().getTime(),
      demoType,
      operator,
      demoVal
    })
    this.setState({
      demoType: null,
      operator: null,
      demoVal: null,
      filters
    })
    window.filters = JSON.stringify(filters)
    this.applyFilters()
  }

  removeFilter = id => {
    const { filters } = this.state
    this.setState({ filters: filters.filter(d => d.id !== id) }, () => this.applyFilters())
  }

  applyFilters = () => {
    this.props.filterData(parseFilters(this.props.data, this.state.filters))
  }


  render() {
    const { data } = this.props
    const { demoType, operator, demoVal, filters } = this.state

    return (
      <div class="ge-demographic-filters">
        {filters.map(d => <div><span>{d.demoType} {d.operator} {d.demoVal}</span><button onClick={() => this.removeFilter(d.id)}>X</button></div>)}
        <select value={demoType} onChange={e => this.setState({ demoType: e.target.value })}>
          {
            Object.keys(data[0]).map((k, i) => <option value={k}>{k}</option>)
          }
        </select>
        <select value={operator} onChange={e => this.setState({ operator: e.target.value })}>
          <option value={'<'}>{'<'}</option>
          <option value={'=='}>{'=='}</option>  ///FIX DOUBLE EQUAL WHEN EXACTLY THE SAME IT RETURNS EMPTY ARRAY
          <option value={'!='}>{'!='}</option> 
          <option value={'>'}>{'>'}</option>
          <option value={'top'}>{'top'}</option>
          <option value={'bottom'}>{'bottom'}</option>
        </select>
        <input value={demoVal} onChange={e => this.setState({ demoVal: e.target.value })}/>
        <button onClick={this.addFilter} 
        // disabled={!demoType || !operator || !demoVal}
        >Add filter</button>
      </div>
    )
  }
}

export default DemoFilters