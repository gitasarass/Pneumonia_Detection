import React from 'react'
import MenuAdmin from '../component/MenuAdmin';
import { Outlet } from 'react-router-dom';

function DashboardAdminPage() {
  return (
    <React.Fragment>
      <section>
         <div className='App'>
            <MenuAdmin />
            <Outlet />
         </div>
      </section>
    </React.Fragment>
  )
}

export default DashboardAdminPage;