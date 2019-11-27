import React from 'react'

const createClassesArr = (classes, domain) => {
  const chunk = (domain[1] + (-1 * domain[0])) / classes
  let classesArr = [domain[0]]
  let acc = 0
  for (i = 0; i < classes; i++) {
    acc += chunk
    classesArr.push(acc)
  }
  return classesArr
}


const ColorScaleKey = ({ colors, classes, domain, parseValue, title, noData, shape }) => {
  const classesArr = isNaN(classes) === false ? createClassesArr(classes, domain) : classes
  
  return(
    <>
      {title ? <div class='gv-key-title'>{title}</div> : null}
      {
        colors.map((c, i) =>
          <div class='gv-key-item'>
            <div class={`gv-key-bullet gv-key-bullet--${shape}`} style={{ background: c}}>&nbsp;</div>
            <span>{parseValue ? parseValue(classesArr[i]) : classesArr[i]}</span>
          </div>
        )
      }
      <div class='gv-key-item'>
        {noData ? <div class={`gv-key-bullet gv-key-bullet--${shape} ge-const--nodata`}>&nbsp;</div> : null}
        <span>No data</span>
      </div>
    </>
  )
}

export default ColorScaleKey