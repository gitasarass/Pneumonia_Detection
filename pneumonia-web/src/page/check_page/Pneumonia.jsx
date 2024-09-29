import React from 'react'
import { Outlet } from 'react-router-dom';


function Pneumonia() {
  return (
    <React.Fragment>
      <section>
         <div className='App'>
            <Outlet />
         </div>
      </section>
    </React.Fragment>
  )
}

export default Pneumonia;