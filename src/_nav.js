import React from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={icon.cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'RWHS',
  },
  {
    component: CNavItem,
    name: 'Schedule',
    to: '/schedule',
    icon: <CIcon icon={icon.cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Receiving',
    to: '/receiving',
    icon: <CIcon icon={icon.cilInbox} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'SETUP',
  },
  {
    component: CNavItem,
    name: 'Vendor Setup',
    to: '/setup/vendor',
    icon: <CIcon icon={icon.cilTruck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'DN Setup',
    to: '/setup/dn',
    icon: <CIcon icon={icon.cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'USER',
  },
  {
    component: CNavItem,
    name: 'Logout',
    to: '/login',
    icon: <CIcon icon={icon.cilAccountLogout} customClassName="nav-icon" />,
  },
]

export default _nav
