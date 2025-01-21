import React from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'DASHBOARD',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={icon.cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'RECEIVING ',
  },
  {
    component: CNavGroup,
    name: 'Receiving Input',
    to: '/order',
    icon: <CIcon icon={icon.cilTablet} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Input Receiving',
        to: '/input',
        icon: <CIcon icon={icon.cilStar} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Log Receiving',
        to: '/log',
        icon: <CIcon icon={icon.cilStar} customClassName="nav-icon" />,
      },
    ],
  },
 
  // {
  //   component: CNavItem,
  //   name: 'Receiving',
  //   to: '/receiving',
  //   icon: <CIcon icon={icon.cilInbox} customClassName="nav-icon" />,
  // },
  {
    component: CNavTitle,
    name: 'UPLOAD DATA',
  },
  {
    component: CNavGroup,
    name: 'Receiving Upload',
    to: '/order',
    icon: <CIcon icon={icon.cilTablet} customClassName="nav-icon" />,
    items: [
   {    
    component: CNavItem,
    name: 'Vendor Setup',
    to: '/setup/vendor',
    icon: <CIcon icon={icon.cilStar} size="xl" customClassName="nav-icon" />,
    },  
   {   
    component: CNavItem,
    name: 'DN Setup',
    to: '/setup/dn',
    icon: <CIcon icon={icon.cilStar} size="xl" customClassName="nav-icon" />,
   }
   ]
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
