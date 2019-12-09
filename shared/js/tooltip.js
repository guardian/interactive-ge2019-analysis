import React from 'react'

const Tooltip = ({ constituency, x, y, ttString }) => {
  if (constituency) {
    const winner = constituency.winArr
    return (
      <div className='ge-tt' style={{ left: x || 0, top: y - 5 || 0, display: constituency?.name ? 'inline-block' : 'none' }}>
        <div className='ge-tt__winner'><span className={`ge-color--${winner[0]?.toLowerCase() || 'undeclared'}`}><strong>{winner[0] || 'Undeclared'}</strong></span><span> {winner[1]}</span></div>
          <h3 className='ge-tt__constname'>{constituency?.name}</h3>
          <div className='ge-tt__demog'>{ttString}</div>
      </div>
    )
  } 
}
export default Tooltip