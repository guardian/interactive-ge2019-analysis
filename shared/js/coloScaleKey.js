import React from 'react'

const createClassesArr = (classes, domain) => {
  const chunk = (domain[1] + (-1 * domain[0])) / classes
  let classesArr = [domain[0]]
  let acc = 0
  for (let i = 0; i < classes; i++) {
    acc += chunk
    classesArr.push(acc)
  }
  return classesArr
}


const ColorScaleKey = ({ colors, classes, domain, parseValue, title, noData, shape }) => {
  const classesArr = isNaN(classes) === false ? createClassesArr(classes, domain) : classes
  const slicedCol = colors.slice(1, -1)
  const slicedClass = classesArr.slice(1, -1)
  return(
    <div class='gv-key'>
      {title ? <div class='gv-key-title'>{title}</div> : null}
      <div class='gv-key-item'>
        <div class={`gv-key-bullet gv-key-bullet--${shape}`} style={{ background: colors[0] }}>&nbsp;</div>
        <span>{parseValue ? parseValue(null, classesArr[1], 'first') : `< ${classesArr[1]}`}</span>
      </div>
      {
        slicedCol.map((c, i) =>
          <div class='gv-key-item'>
            <div class={`gv-key-bullet gv-key-bullet--${shape}`} style={{ background: c}}>&nbsp;</div>
            <span>{parseValue ? parseValue(slicedClass[i], slicedClass[i + 1]) : `${slicedClass[i]} - ${slicedClass[i + 1]}`}</span>
          </div>
        )
      }
      <div class='gv-key-item'>
        <div class={`gv-key-bullet gv-key-bullet--${shape}`} style={{ background: colors[colors.length - 1] }}>&nbsp;</div>
        <span>{parseValue ? parseValue(classesArr[classesArr.length - 2], null, 'last') : `> ${classesArr[classesArr.length - 2]}`}</span>
      </div>
      <div class='gv-key-item'>
        {noData ? <div class={`gv-key-bullet gv-key-bullet--${shape} gv-key-nodata`}>&nbsp;</div> : null}
        <span>No data</span>
      </div>
    </div>
  )
}

export default ColorScaleKey