import React from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import useAuthDataService from './services/AuthDataServices'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom'


const useNavigation = () => {
  const { logout } = useAuthDataService()
  const navigate = useNavigate()
  const MySwal = withReactContent(Swal)

  const handleLogout = async () => {
    try {
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log out',
        confirmButtonColor: 'rgb(246, 66, 66)',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      })
      if (result.isConfirmed) {
        await logout()
        navigate('/login')
        // window.location.assign('https://twiis-toyota.web.app/#/login')
      }
    } catch (error) {
      console.error(error)
    }
  }

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
      component: CNavItem,
      name: 'Summary',
      to: '/summary',
      icon: <CIcon icon={icon.cilChartPie} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Maps Truck Station',
      to: '/map-truck',
      icon: <CIcon icon={icon.cilMap} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'RECEIVING ',
    },
    {
      component: CNavGroup,
      name: 'Input',
      to: '/order',
      icon: <CIcon icon={icon.cilTablet} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Vendor Arrival',
          to: '/input-vendor',
          icon: <CIcon icon={icon.cilMinus} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Delivery Note',
          to: '/input',
          icon: <CIcon icon={icon.cilMinus} customClassName="nav-icon" />,
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Inquiry',
      icon: <CIcon icon={icon.cilPenAlt} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Vendor Arrival',
          to: '/inquiry-vendor',
          icon: <CIcon icon={icon.cilMinus} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Delivery Note',
          to: '/inquiry',
          icon: <CIcon icon={icon.cilMinus} customClassName="nav-icon" />,
        },
      ]
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
      icon: <CIcon icon={icon.cilMinus} size="xl" customClassName="nav-icon" />,
      },  
     {   
      component: CNavItem,
      name: 'DN Setup',
      to: '/setup/dn',
      icon: <CIcon icon={icon.cilMinus} size="xl" customClassName="nav-icon" />,
     }
     ]
    },
    {
      component: CNavTitle,
      name: 'VENDOR',
    },
    {
      component: CNavGroup,
      name: 'Vendor Support',
      to: '/vendor',
      icon: <CIcon icon={icon.cilTablet} customClassName="nav-icon" />,
      items: [
     {    
      component: CNavGroup,
      name: 'Vendor Requirement',
      icon: <CIcon icon={icon.cilListRich} size="xl" customClassName="nav-icon" />,
      items: [
        {   
          component: CNavItem,
          name: 'Input Requirement',
          to: '/vendor/input/requirement',
          icon: <CIcon icon={icon.cilMinus} size="xl" customClassName="nav-icon" />,
         },
         {   
          component: CNavItem,
          name: 'Inquery Requirement',
          to: '/vendor/inquiry/requirement',
          icon: <CIcon icon={icon.cilMinus} size="xl" customClassName="nav-icon" />,
         }
      ]
      },  
     {   
      component: CNavItem,
      name: 'Track Record',
      to: '/vendor/track-record',
      icon: <CIcon icon={icon.cilMinus} size="xl" customClassName="nav-icon" />,
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
      to: '/logout',
      icon: <CIcon icon={icon.cilAccountLogout} customClassName="nav-icon" />,
      onClick: (e) => {
        e.preventDefault()
        handleLogout()
      },
    },
  ]

  return _nav
}

export default useNavigation