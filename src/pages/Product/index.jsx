import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom'

export default function Product() {
  return (
    <Fragment>
      <Outlet/>
    </Fragment>
  )
}
