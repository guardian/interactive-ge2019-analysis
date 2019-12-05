import React from 'react'

const Tooltip = ({ constituency, x, y, ttString }) => {
  const str = constituency?.y2017_hold_gain
  const winner = str?.substr(0, str.indexOf(' '))
  const rest = str?.substr(str.indexOf(' ') + 1)
  return (
    <div className='ge-tt' style={{ left: x || 0, top: y - 5 || 0, display: constituency?.name ? 'inline-block' : 'none' }}>
      <div className='ge-tt__winner'><span className={`ge-color--${winner ?.toLowerCase() || 'undeclared'}`}><strong>{winner || 'Undeclared'}</strong></span><span> {rest}</span></div>
        <h3 className='ge-tt__constname'>{constituency?.name}</h3>
        <div className='ge-tt__demog'>{ttString}</div>
    </div>
  )
}
export default Tooltip