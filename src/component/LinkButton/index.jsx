import React from 'react'
import { Button } from 'antd'

import './index.css'

export default function LinkButton(props) {
  return (
    <button {...props} type="primary" className="linkbutton"></button>
  )
}
