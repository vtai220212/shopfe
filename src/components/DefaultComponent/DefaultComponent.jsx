import React from 'react'
import HeaderComponent from '../HeaderCompoent/HeaderComponent'

const DefaultComponent = ({children}) => {
  return (
    <div>
        <HeaderComponent />
        {children}
    </div>
  )
}

export default DefaultComponent