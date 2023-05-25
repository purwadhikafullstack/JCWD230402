import React from 'react'
import './Logo.css'

function Logo() {
  return (
    <div className="pyramid-loader">
      <div className="wrappers">
        <span className="side side1"></span>
        <span className="side side2"></span>
        <span className="side side3"></span>
        <span className="side side4"></span>
        <span className="shadows"></span>
      </div>
    </div>
  )
}

export default Logo