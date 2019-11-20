import React, { PureComponent, createRef } from 'react'
import hexTopo from '../geo/hexagons.json'
import regions from '../geo/regions_mesh.json'
import regionNames from '../geo/region_names.json'
import geoGraphic from '../geo/geo_uk.json'
import { hashPattern } from './util'
import { geoMercator, geoPath, max, min } from 'd3'
import { feature } from 'topojson'
import Tooltip from './tooltip'
import DemoFilters from './demoFilters'
import chroma from 'chroma-js'
import { toDict } from './util.js'

const pattern = hashPattern('ge-hash', 'ge-hash__path', 'ge-hash__rect')

class Map extends PureComponent { 
  wrapper = createRef() 
  constructor(props) {
    super(props)
    const width = 100
    const height = width * 1.5
    const hexFc = props.geo ? geoGraphic : feature(hexTopo, hexTopo.objects.hexagons)
    const proj = geoMercator().fitSize([width, height], hexFc)
    const path = geoPath().projection(proj)

    this.setInputRef = node => this.input = node

    this.state = {
      filteredDict: props.resultsDict,
      width,
      height,
      hexFc,
      proj,
      path,
      colorScale: null,
      showTooltip: false
    }
  }

  hover = f => {
    const obj = this.props.resultsDict[f.properties.constituency]
    const c = this.state.path.bounds(f)

    this.props.setHovered(obj, { x: (c[0][0] + c[1][0]) / 2, y: c[0][1] }, f)
  }

  setColorScale = (scaleColors, outOfScaleColor, demographic, steps, shiftFirstColor = false, customClasses = null) => {

    // !!!IMPORTANT!!! THIS DOMAIN ISNT RECALCULATED IF FILTERS ARE APPLIED!!!!!!!!!

    const domain = [min(this.props.results, d => d[demographic]), max(this.props.results, d => d[demographic])]

    let colors = chroma
      .scale([scaleColors[0], scaleColors[1]])
      .colors(shiftFirstColor ? steps + 1 : steps)

    if (shiftFirstColor) colors.shift()

    const colorScale = chroma
      .scale(outOfScaleColor.concat(colors))
      .domain(domain)
      .classes(customClasses ? customClasses : colors.length)

    this.setState({ colorScale })
  }

  applyFilters = () => {
    let results = this.props.results
    const { filters } = this.props
    let noData = []

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

    const filtered = results.filter(d => d.noData !== true).concat(noData)

    this.setState({ filteredDict: toDict(filtered) })
  }

  toggleTooltip = (showTooltip) => this.setState({ showTooltip })

  render() {

    const { geo, shadeDemo, hovered, ttCoords, selectedFeature, results, filters } = this.props
    const { width, height, path, hexFc, colorScale, proj, showTooltip, filteredDict } = this.state
    
    return (
      <>
        <div className='ge-map__inner' ref={this.wrapper}>
          {showTooltip && <Tooltip constituency={hovered} x={ttCoords.x} y={ttCoords.y} />}
          <svg onMouseEnter={() => this.toggleTooltip(true)} onMouseLeave={() => {this.toggleTooltip(false); this.props.selectFeature(null)}} className='ge-map' height={height} width={width}>
            <defs dangerouslySetInnerHTML={{ __html: pattern }}></defs>
            {
              hexFc.features.map(f => {
                const thisConst = filteredDict[f.properties.constituency] || {}
                const party = (thisConst.y2017_winner || 'undeclared').toLowerCase().replace(/\s/g, '')
                
                return <path
                  d={path(f)}
                  className={shadeDemo ? `ge-const ${thisConst[shadeDemo.selectedDemo] === 'NA' ? 'ge-const--nodata' : ''}` : `ge-const ge-fill--${party} ${thisConst.noData ? 'ge-const--nodata' : ''}`}
                  style={{ fill: colorScale ? colorScale(thisConst[shadeDemo.selectedDemo]).hex() : 'initial'}}
                  onMouseEnter={() => this.hover(f)}
                  onClick={() => this.select(f)}
                />
              })
            }
            {geo ? null : <path d={path(regions)} className='ge-region' />}}
            {
              hovered &&
              <path
                d={path(selectedFeature)}
                className='ge-const__selected'
              />
            }
            {geo ? null : regionNames
              .filter(f => f.properties.abbr)
              .map(f => {
                const p = proj(f.geometry.coordinates)
                const transform = `translate(${p[0]}, ${p[1]})`

                return <g className='ge-map-labelg' transform={transform}>
                  {f.properties.name.startsWith('Yorks') ?
                    <text className='ge-map-label__text'>
                      <tspan x='10' y='-15'>Yorkshire and</tspan>
                      <tspan x='10' dy='16'>the Humber</tspan>
                    </text>
                    : <text className='ge-map-label__text'> {f.properties.name} </text>}
                </g>
            })}
          </svg>
        </div>
        <DemoFilters filters={filters} filterData={filtered => this.setState({ filteredDict: toDict(filtered) })} data={results} />
      </>
    )
  }

  componentWillMount() {
    this.applyFilters()

    if (this.props.shadeDemo) {
      const { selectedDemo, scaleColors, outOfScaleColor, shiftFirstColor, steps } = this.props.shadeDemo
      this.setColorScale(scaleColors, outOfScaleColor, selectedDemo, steps, shiftFirstColor)
    }
  }

  componentDidMount() {
    const width = this.wrapper.current.getBoundingClientRect().width;

    const height = width * 1.5
    const hexFc = this.props.geo ? geoGraphic : feature(hexTopo, hexTopo.objects.hexagons)
    const proj = geoMercator().fitSize([width, height], hexFc)
    const path = geoPath().projection(proj)

    this.setInputRef = node => this.input = node

    this.setState({
      width,
      proj,
      height,
      hexFc,
      path
    })
  }
}

export default Map


