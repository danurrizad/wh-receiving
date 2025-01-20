import React from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CRow, CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'

const DNSetup = () => {
  return (
    <CContainer fluid>
      <CRow>
        <CCard className='p-0'>
          <CCardHeader>
            <CCardTitle>Delivery Note Data</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs='auto'>
                <CButton onClick={()=>setShowModalUpdate(true)} color='info' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                  <CIcon icon={icon.cilCloudUpload}/>
                  <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                  <span>Upload a File</span>
                </CButton>
              </CCol>
              <CCol xs='auto'>
                <CButton onClick={()=>setShowModalUpdate(true)} color='success' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                  <CIcon icon={icon.cilCloudDownload}/>
                  <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                  <span>Download Template File</span>
                </CButton>
              </CCol>
            </CRow>
            <CRow>
              <CTable responsive bordered className='mt-3'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>No</CTableHeaderCell>
                    <CTableHeaderCell>DN No</CTableHeaderCell>
                    <CTableHeaderCell>Material No</CTableHeaderCell>
                    <CTableHeaderCell>Material Desc</CTableHeaderCell>
                    <CTableHeaderCell>Rack Address</CTableHeaderCell>
                    <CTableHeaderCell>Planning Quantity</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                </CTableBody>
              </CTable>
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>
    </CContainer>
  )
}

export default DNSetup