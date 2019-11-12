import React from 'react'

const Tooltip = ({ constituency, x, y }) => 
 {
   return (<div className='ge-tt' style={{ left: x || 0, top: y || 0, display: constituency && constituency.name ? 'inline-block' : 'none' }}>
    <h3 className='ge-tt__constname'>{constituency && constituency.name}</h3>
 </div>)}
export default Tooltip