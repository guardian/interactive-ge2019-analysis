import React, { Component } from 'react'

class DemoFilters extends Component {

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {    
    const { data } = this.props

    return (
      <div class="ge-demographic-filters">
        <select>
          {
            Object.keys(data[0]).map((k, i) => <option>{k}</option>)
          }
        </select>
      </div>
    )
  }
}

export default DemoFilters