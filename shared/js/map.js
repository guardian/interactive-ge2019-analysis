import React, { PureComponent, createRef } from 'react'
import hexTopo from '../geo/hexagons.json'
import regions from '../geo/regions_mesh.json'
import regionNames from '../geo/region_names.json'
// import geoGraphic from '../geo/geo_uk.json'
import { hashPattern, parseFilters } from './util'
import { geoMercator, geoPath, max, min } from 'd3'
import { feature } from 'topojson'
import Tooltip from './tooltip'
import DemoFilters from './demoFilters'
import chroma from 'chroma-js'
import { toDict } from './util.js'
import ColorScaleKey from './coloScaleKey'

const pattern = hashPattern('ge-hash', 'ge-hash__path', 'ge-hash__rect')
let geo = null
class Map extends PureComponent { 
  wrapper = createRef() 
  constructor(props) {
    super(props)
    const width = 100
    const height = width * 1.5
    const hexFc = props.geo ? geoGraphic : feature(hexTopo, hexTopo.objects.hexagons)
    const proj = geoMercator().fitSize([width, height], hexFc)
    const path = geoPath().projection(proj)
    const dict = {}

    this.setInputRef = node => this.input = node

    this.state = {
      dict,
      filteredDict: props.resultsDict,
      width,
      height,
      hexFc,
      proj,
      path,
      colorScale: null,
      colors: [],
      domain: [],
      showTooltip: false,
      markers: []
    }
  }

  hover = f => {
    if (f) {
        const obj = this.props.resultsDict[f.properties.constituency]
        const c = this.state.path.bounds(f)

        this.props.setHovered(obj, { x: (c[0][0] + c[1][0]) / 2, y: c[0][1] }, f)
    } else {
      this.props.setHovered(null, { x: 0, y: 0 })
    }

  }

  setColorScale = (scaleColors, outOfScaleColor, demographic, steps, shiftFirstColor = false, customClasses = null, customDomain = null) => {

    // !!!IMPORTANT!!! THIS DOMAIN ISNT RECALCULATED IF FILTERS ARE APPLIED!!!!!!!!!
    const domain = (customDomain) ? customDomain : [min(this.props.results, d => d[demographic]), max(this.props.results, d => d[demographic])]

    const genSteps = customClasses ? customClasses.length - 1 - outOfScaleColor.length : steps;

    let colors = chroma
      .scale(scaleColors)
      .colors(shiftFirstColor ? genSteps + 1 : genSteps)

    if (shiftFirstColor) colors.shift()
    colors = outOfScaleColor.concat(colors)

    const colorScale = chroma
      .scale(colors)
      .domain(domain)
      .classes(customClasses ? customClasses : colors.length)

      window.colorScale = colorScale;

    this.setState({ colorScale, colors, domain })
  }

  applyFilters = (externalFilters) => {
    const filtered = externalFilters ? parseFilters(this.props.results, externalFilters) : parseFilters(this.props.results, this.props.filters)

    this.setState({ filteredDict: toDict(filtered) })
  }

  toggleTooltip = (showTooltip) => this.setState({ showTooltip })

  getPath = (f, path) => {
    const {dict} = this.state;
    if(dict[f.properties.constituency]) {
      return dict[f.properties.constituency]
    } else {
      dict[f.properties.constituency] = path(f)
      return dict[f.properties.constituency];
    }
  }

  render() {
    const { geo, shadeDemo, hovered, ttCoords, selectedFeature, results, filters, showKey, showRegionNames } = this.props
    const { width, height, path, hexFc, colorScale, proj, showTooltip, filteredDict, colors, domain, markers } = this.state
    
    const labelStyle = {
      opacity: hovered ? 0 : 1
    }

    return (
      <>
        {showKey ?
          <ColorScaleKey
            colors={colors}
            classes={shadeDemo.customClasses || shadeDemo.steps}
            domain={domain}
            parseValue={showKey.parseValue}
            title={showKey.title}
            noData={showKey.noData}
            shape={showKey.shape} />
          : null
        }
        <div className='ge-map__inner' ref={this.wrapper}>

          {showTooltip && <Tooltip constituency={hovered} x={ttCoords.x} y={ttCoords.y} />}
          <svg onMouseEnter={() => this.toggleTooltip(true)} onMouseLeave={() => {this.toggleTooltip(false); this.hover(null); this.props.selectFeature(null)}} className='ge-map' height={height} width={width}>
            <defs dangerouslySetInnerHTML={{ __html: pattern }}></defs>
            {
              hexFc.features.map((f, i) => {
                const thisConst = filteredDict[f.properties.constituency] || {}
                const party = (thisConst.y2019_winner || 'undeclared').toLowerCase().replace(/\s/g, '')
                
                return <path
                  key={'pconst-'+i}
                  d={this.getPath(f, path)}
                  className={shadeDemo ? `ge-const ${thisConst[shadeDemo.selectedDemo] === 'NA' ? 'ge-const--nodata' : ''}` : `ge-const ge-fill--${party} ${thisConst.noData ? 'ge-const--nodata' : ''}`}
                  style={{ fill: colorScale ? colorScale(thisConst[shadeDemo.selectedDemo]).hex() : 'initial'}}
                  onMouseEnter={() => this.hover(f)}
                  // onClick={() => this.select(f)}
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
            <g style={labelStyle} className='ge-map-labels'>
            {geo ? null : showRegionNames && regionNames
              .filter(f => f.properties.abbr)
              .map((f,i) => {
                const p = proj(f.geometry.coordinates)
                const transform = `translate(${p[0]}, ${p[1]})`

                return <g key={'lblg-' + i} className='ge-map-labelg' transform={transform}>
                  {f.properties.name.startsWith('Yorks') ?
                    <g>

                      <text className='ge-map-label__text ge-map-label__text--white'>
                        <tspan x='10' y='-15'>Yorkshire and</tspan>
                        <tspan x='10' dy='16'>the Humber</tspan>
                      </text>

                      <text className='ge-map-label__text'>
                        <tspan x='10' y='-15'>Yorkshire and</tspan>
                        <tspan x='10' dy='16'>the Humber</tspan>
                      </text>

                    </g>

                    : <g>
                      <text className='ge-map-label__text ge-map-label__text--white'> {f.properties.name} </text>
                      <text className='ge-map-label__text'> {f.properties.name} </text>
                    </g>}
                </g>
            })}
            </g>
            {
              <g className='markers'>
                {markers.map(m =>
                  hovered ? hovered.ons_id !== m.ons &&
                  <g className='marker-g'>
                    <circle cx={m.x} cy={m.y} r={8} fill='#333'/>
                    <text dominant-baseline="central" className='gv-marker-text' x={m.x} y={m.y}>{m.n}</text>
                    </g> :
                    <g className='marker-g'>
                      <circle cx={m.x} cy={m.y} r={8} fill='#333' />
                      <text dominant-baseline="central" className='gv-marker-text' x={m.x} y={m.y}>{m.n}</text>
                    </g> 
                )}
              </g>
            }
          </svg>
        </div>
        <DemoFilters filters={filters} applyFilters={(externalFilters) => this.applyFilters(externalFilters)} data={results} />
      </>
    )
  }

  componentWillMount() {
    this.applyFilters()

    if (this.props.shadeDemo) {
      const { selectedDemo, scaleColors, outOfScaleColor, shiftFirstColor, steps, customDomain, customClasses } = this.props.shadeDemo
      this.setColorScale(scaleColors, outOfScaleColor, selectedDemo, steps, shiftFirstColor, customClasses, customDomain)
    }
  }

  componentDidMount() {
    const dict = {};
    const width = this.wrapper.current.getBoundingClientRect().width;
    const height = width * 1.5
    const hexFc = this.props.geo ? geoGraphic : feature(hexTopo, hexTopo.objects.hexagons)
    const proj = geoMercator().fitSize([width, height], hexFc)
    const path = geoPath().projection(proj)
    const markers = this.props.markers.map(m => {
    const c = path.centroid(hexFc.features.find(f => f.properties.constituency === m.ons))
      return Object.assign({}, m, {
        n: m.n,
        ons: m.ons,
        x: c[0], 
        y: c[1]
      })
    })

    this.setInputRef = node => this.input = node


    this.setState({
      dict,
      width,
      proj,
      height,
      hexFc,
      path,
      markers
    })
  }
}

export default Map


