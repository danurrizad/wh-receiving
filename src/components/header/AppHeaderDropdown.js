import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CNavLink,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import profile from './../../assets/images/avatars/profile.png'
import profileDark from './../../assets/images/avatars/profile-dark.png'

import useAuthDataService from '../../services/AuthDataServices'
import { useNavigate } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

const AppHeaderDropdown = ({ colorMode, imgProfile, name, roleName}) => {
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
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0 d-flex align-items-center" caret={false}>
        <CAvatar src={imgProfile ? imgProfile : colorMode === 'light' ? profile : profileDark} size="md" />
        <CNavLink className="d-flex flex-column justify-content-center h-100" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '', marginTop: '0px'}}>{name === 'Danur SiPalingGhanzzz' ? 'Danur' : name}</span>
          <span style={{ fontSize: '10px', marginTop: '0px' }}>{roleName.toUpperCase()}</span>
        </CNavLink>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ cursor: "pointer", textDecoration: "none"}}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout  
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
