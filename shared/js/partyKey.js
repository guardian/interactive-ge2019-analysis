import React from 'react'
import { name } from './util'

const PartyKey = ({ parties }) =>
  <div class="ge-party-key">
    {parties.map(p => <div className={`ge-party-key__party ge-party-key__party--${p}`}>{name(p)}</div>)}
    <div class="ge-party-key__party ge-party-key__party--other">Other parties</div>
  </div>

export default PartyKey