import React from 'react'
import MenuItem from '../MenuItem'
import NavPage from './NavPage'

function MainPage() {
  return (
    <React.Fragment>
        <div className='App'>
            <MenuItem />
            <NavPage />
         </div>
    </React.Fragment>
  )
}

export default MainPage