import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PageDashboard from '../../dashboard/PageDashboard'
import PageHealth from '../../check_page/PageHealth'
import SetSetting from '../../setting/SetSetting'

const NavPage = () => {
  return (
    <React.Fragment>
        <section>
            <Routes>
                <Route path='/pagedashboard' element = {<PageDashboard />}/>
                <Route path='/medical_check' element = {<PageHealth />}/>
                <Route path='/setting' element = {<SetSetting />}/>
            </Routes>
        </section>
    </React.Fragment>
  )
}

export default NavPage