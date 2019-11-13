import React, { Component, createRef } from 'react'
import hexTopo from '../geo/hexagons.json'
import regionsTopo from '../geo/regions.json'
import { hashPattern } from './util'
import { geoMercator, geoPath } from 'd3'
import { feature } from 'topojson'
import Tooltip from './tooltip'
import DemoFilters from './demoFilters'

const pattern = hashPattern('ge-hash', 'ge-hash__path', 'ge-hash__rect')

class Map extends Component { 
  wrapper = createRef() 
  constructor(props) {
    super(props)
    const width = 100
    const height = width * 1.5
    const hexFc = feature(hexTopo, hexTopo.objects.hexagons)
    const regionsFc = feature(regionsTopo, regionsTopo.objects.regions)
    const proj = geoMercator().fitSize([width, height], hexFc)
    const path = geoPath().projection(proj)

    this.setInputRef = node => this.input = node

    this.state = {
      results: props.results,
      fullResults: props.results,
      width,
      height,
      hexFc,
      regionsFc,
      path,
      hovered: null,
      selected: props.results[0],
      ttCoords: { x: 0, y: 0 }
    }
  }
  hover = f => {
    const obj = this.props.resultsDict[f.properties.constituency]
    const c = this.state.path.centroid(f)

    this.setState({ hovered: obj, ttCoords: { x: c[0], y: c[1] } })
  }

  render() {

    // const { results } = this.props
    const { width, height, regionsFc, path, hexFc, hovered, ttCoords, selected, results, fullResults } = this.state

    return (
      <>
        <div className='ge-map__inner' ref={this.wrapper}>
          <Tooltip constituency={hovered} x={ttCoords.x} y={ttCoords.y} />
          <svg className='ge-map' height={height} width={width}>
            <defs dangerouslySetInnerHTML={{ __html: pattern }}></defs>
            {
              hexFc.features.map(f => {
                const party = ((results.find(o => o.ons_id === f.properties.constituency) || {}).y2017_winner || 'undeclared').toLowerCase().replace(/\s/g, '')
                return <path d={path(f)} className={`ge-const ge-fill--${party}`} onMouseEnter={() => this.hover(f)} onClick={() => this.select(f)}/>
              })
            }
            {regionsFc.features.map(f => <path d={path(f)} className='ge-region' />)}}
          </svg>
        </div>
        <DemoFilters filterData={filtered => this.setState({ results: filtered })} data={fullResults} />
      </>
    )
  }

  componentDidMount() {
    const width = this.wrapper.current.getBoundingClientRect().width;

    const height = width * 1.5
    const hexFc = feature(hexTopo, hexTopo.objects.hexagons)
    const regionsFc = feature(regionsTopo, regionsTopo.objects.regions)
    const proj = geoMercator().fitSize([width, height], hexFc)
    const path = geoPath().projection(proj)

    this.setInputRef = node => this.input = node

    this.setState({
      width,
      height,
      hexFc,
      regionsFc,
      path
    })
  }
}

export default Map