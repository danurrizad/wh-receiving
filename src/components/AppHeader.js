import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CNavbarText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from "@coreui/icons";

import {
  cilMenu,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [dateState, setDateState] = useState(new Date())

  const t = new Date()
  const c = t.getHours() - 12
  useEffect(() => {
    setInterval(() => {
      setDateState(new Date())
    }, 1000)
  }, [])

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink style={{ color: 'red'}}>
              TOYOTA
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink className="" style={{ textDecoration: 'none' }}>
              {dateState.toLocaleString('en-US', {
                dateStyle: 'full',
              })}
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink className="" style={{ textDecoration: 'none' }}>
              {dateState.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                second: '2-digit',
                hour12: true,
              })}
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <div className="nav-item py-0 d-flex align-items-center" style={{ textDecoration: 'none', display: '' }}>
          <div className="vr h-100 mx-2 text-body text-opacity-100"></div>
        </div>
        <CHeaderNav>
          <CNavItem className="d-flex align-items-center">
            <CNavLink style={{ textDecoration: 'none' }}>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  border: '1px solid black',
                  height: '30px',
                  width: '30px',
                  borderRadius: '100%',
                }}
              >
                <CIcon icon={icon.cilUser} />
              </div>
            </CNavLink>
            <CNavLink className="d-flex flex-column justify-content-center h-100" style={{ textDecoration: 'non' }}>
              <span style={{ fontSize: '', marginTop: '0px'}}>Username</span>
              <span style={{ fontSize: '10px', marginTop: '0px' }}>ROLE USER</span>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
