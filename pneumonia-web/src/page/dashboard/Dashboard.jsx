import React from 'react'

import MenuItem from '../component/MenuItem'
import { Outlet } from 'react-router-dom';


function DashboardPage() {
  return (
    <React.Fragment>
      <section>
         <div className='App'>
            <MenuItem />
            <Outlet />
         </div>
      </section>
    </React.Fragment>
  )
}

export default DashboardPage