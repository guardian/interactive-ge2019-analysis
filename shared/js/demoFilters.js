import React, { Component } from 'react'

class DemoFilters extends Component {

  constructor(props) {
    super(props)
  }


  state = {
    demoType: null,
    operator: null,
    demoVal: null,
    filters: []
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
  }

  removeFilter = id => {
    const { filters } = this.state
    this.setState({ filters: filters.filter(d => d.id !== id)})
  }

  applyFilters = () => {
    let results = this.props.data
    const { filters } = this.state
    
    filters.forEach(f => {
      results = results.filter(d => {
        if (f.operator === '<') {
          return d[f.demoType] < d.demoVal
        }
        if (f.operator === '>') {
          return d[f.demoType] > d.demoVal
        }
        if (f.operator === '===') {
          console.log(d[f.demoType])
          return d[f.demoType] === d[f.demoVal]
        }
      })
    })
    console.log(filters)
    console.log(results)
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
          <option value={'==='}>{'==='}</option>
          <option value={'>'}>{'>'}</option>
        </select>
        <input value={demoVal} onChange={e => this.setState({ demoVal: e.target.value })}/>
        <button onClick={this.addFilter} disabled={!demoType || !operator || !demoVal}>Add filter</button>
        <button onClick={this.applyFilters}>Apply Filters</button>
      </div>
    )
  }
}

export default DemoFilters