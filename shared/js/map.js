import React, { Component, createRef } from 'react'
import hexTopo from '../geo/hexagons.json'
import regionsTopo from '../geo/regions.json'
import geoGraphic from '../geo/geo_uk.json'
import { hashPattern } from './util'
import { geoMercator, geoPath, max, min, scaleLinear } from 'd3'
import { feature } from 'topojson'
import Tooltip from './tooltip'
import DemoFilters from './demoFilters'
import chroma from 'chroma-js'

const pattern = hashPattern('ge-hash', 'ge-hash__path', 'ge-hash__rect')

class Map extends Component { 
  wrapper = createRef() 
  constructor(props) {
    super(props)
    const width = 100
    const height = width * 1.5
    const hexFc = props.geo ? geoGraphic : feature(hexTopo, hexTopo.objects.hexagons)
    const regionsFc = feature(regionsTopo, regionsTopo.objects.regions)
    const proj = geoMercator().fitSize([width, height], hexFc)
    const path = geoPath().projection(proj)

    this.setInputRef = node => this.input = node

    this.state = {
      results: props.results,
      fullResults: props.results, //not needed when we launch and demofilters are removed. Remember to remove
      width,
      height,
      hexFc,
      regionsFc,
      path,
      hovered: null,
      selected: props.results[0],
      ttCoords: { x: 0, y: 0 },
      colorScale: null
    }
  }
  hover = f => {
    const obj = this.props.resultsDict[f.properties.constituency]
    const c = this.state.path.centroid(f)

    this.setState({ hovered: obj, ttCoords: { x: c[0], y: c[1] } })
  }

  setColorScale = (partyCol, demographic, steps, shiftWhite = false, customDomain = null) => {
    const domain = customDomain ? customDomain : [min(this.state.results, d => d[demographic]), max(this.state.results, d => d[demographic])]

    let colors = chroma
      .scale(['#fff', partyCol])
      .colors(shiftWhite ? steps + 1 : steps)

    if (shiftWhite) colors.shift()

    const colorScale = chroma
      .scale(colors)
      .domain(domain)
      .classes(colors.length)

    this.setState({ colorScale })
  }

  applyFilters = () => {
    let results = this.props.results
    let noData = []
    const { filters } = this.props

    filters.forEach(f => {

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
      })
    })
    console.log(noData)
    results.concat(noData)
    this.setState({ results })
  }

  render() {
    // const { results } = this.props
    const { geo, shadeDemo } = this.props
    const { width, height, regionsFc, path, hexFc, hovered, ttCoords, selected, results, fullResults, colorScale } = this.state

    return (
      <>
        <div className='ge-map__inner' ref={this.wrapper}>
          <Tooltip constituency={hovered} x={ttCoords.x} y={ttCoords.y} />
          <svg className='ge-map' height={height} width={width}>
            <defs dangerouslySetInnerHTML={{ __html: pattern }}></defs>
            {
              hexFc.features.map(f => {
                const thisConst = results.find(o => o.ons_id === f.properties.constituency) || {}
                console.log(thisConst.noData)
                const party = (thisConst.y2017_winner || 'undeclared').toLowerCase().replace(/\s/g, '')
                
                return <path
                  d={path(f)}
                  className={shadeDemo ? `ge-const ${thisConst[shadeDemo.selectedDemo] === 'NA' ? 'ge-const--nodata' : ''}` : `ge-const ge-fill--${party} ${thisConst.noData ? 'ge-const--nodata' : ''}`}
                  style={{ fill: colorScale ? colorScale(thisConst[shadeDemo.selectedDemo]).hex() : 'unset'}}
                  onMouseEnter={() => this.hover(f)}
                  onClick={() => this.select(f)}
                />
              })
            }
            {geo ? null : regionsFc.features.map(f => <path d={path(f)} className='ge-region' />)}}
          </svg>
        </div>
        <DemoFilters filterData={filtered => this.setState({ results: filtered })} data={fullResults} />
      </>
    )
  }

  componentWillMount() {
    this.applyFilters()

    if (this.props.shadeDemo) {
      const { selectedDemo, color, shiftWhite, steps, customDomain } = this.props.shadeDemo
      this.setColorScale(color, selectedDemo, steps, shiftWhite, customDomain)
    }
  }

  componentDidMount() {
    const width = this.wrapper.current.getBoundingClientRect().width;

    const height = width * 1.5
    const hexFc = this.props.geo ? geoGraphic : feature(hexTopo, hexTopo.objects.hexagons)
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


