import React from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CRow, CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'

const VendorSetup = () => {
  return (
    <CContainer fluid>
        <CRow className=''>
            <CCard className='p-0'>
                <CCardHeader>
                    <CCardTitle>Vendor Schedule Data</CCardTitle>
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
                        <CCol>
                            <CButton onClick={()=>setShowModalUpdate(true)} color='success' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                                <CIcon icon={icon.cilCloudDownload}/>
                                <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                                <span>Download Template File</span>
                            </CButton>
                        </CCol>
                    </CRow>
                    <CTable bordered responsive className='mt-3'>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>No</CTableHeaderCell>
                                <CTableHeaderCell>Vendor Code</CTableHeaderCell>
                                <CTableHeaderCell>Vendor Name</CTableHeaderCell>
                                <CTableHeaderCell>Day</CTableHeaderCell>
                                <CTableHeaderCell>Arrival Time</CTableHeaderCell>
                                <CTableHeaderCell>Departure Time</CTableHeaderCell>
                                <CTableHeaderCell>Rit</CTableHeaderCell>
                                <CTableHeaderCell>Plant</CTableHeaderCell>
                                <CTableHeaderCell>Truck Station</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                    
                </CCardBody>
            </CCard>
        </CRow>
    </CContainer>
  )
}

export default VendorSetup