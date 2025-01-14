import React, { useState, useEffect} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { dataReceivingDummy } from '../../utils/DummyData'
import  colorStyles from '../../utils/StyleReactSelect'
import Select from 'react-select'
import Pagination from '../../components/Pagination'
import { handleExport } from '../../utils/ExportToExcel'

const Receiving = () => {
  const [ dataReceiving, setDataReceiving ] = useState(dataReceivingDummy)
  const [ showModalUpdate, setShowModalUpdate] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems =
  dataReceiving.length > 0
        ? dataReceiving.slice(indexOfFirstItem, indexOfLastItem)
        : dataReceiving.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(()=>{
     const currentItems = dataReceiving.length > 0
        ? dataReceiving.slice(indexOfFirstItem, indexOfLastItem)
        : dataReceiving.slice(indexOfFirstItem, indexOfLastItem)
  }, [currentPage])

  const options = [
    // { value: 'all', label: 'All' },
    { value: 'Shortage', label: 'Shortage' },
    { value: 'Optimal', label: 'Optimal' },
  ]

  const [ showCard, setShowCard ] = useState({
    schedule: true,
    receiving: true
  })

  const getDataReceiving = () => {
    setDataReceiving(dataReceivingDummy)
  }

 

  const handleFilterReceiving = (selectedOption) => {
    if (!selectedOption) {
      // If no option selected, reset to all data
      setDataReceiving(dataReceivingDummy);
    } else {
      // Filter based on the selected status
      const filtered = dataReceivingDummy.filter(
        (item) => item.status === selectedOption.value
      );
      setDataReceiving(filtered);
    }
  }

 


  
  useEffect(()=>{
    getDataReceiving()
  }, [])

  return (
    <CContainer fluid>
        <CRow>
            <CCard className='p-0'>
                <CCardHeader>
                    <CCardTitle>INPUT</CCardTitle>
                </CCardHeader>
                <CCardBody>
                  <CRow className='mb-3'>
                    <CCol xs={4} className='d-flex align-items-center'>
                        <CFormText className='w-25'>DN No</CFormText>
                        <CInputGroup className='d-flex align-items-center'>
                          <CFormInput/>
                          <CButton color='info' style={{ color: 'white'}}>Find</CButton>
                        </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol sm={4} className='d-flex align-items-center'>
                        <CFormText className='w-25'>Material</CFormText>
                        <CInputGroup className='d-flex align-items-center'>
                          <CFormInput disabled/>
                        </CInputGroup>
                    </CCol>
                    <CCol sm={4} className='d-flex align-items-center'>
                      <CFormText className='w-25'>Quantity</CFormText>
                        <CInputGroup className='d-flex align-items-center'>
                          <CFormInput disabled/>
                        </CInputGroup>
                    </CCol>
                    <CCol sm={4} className='d-flex justify-content-end'>
                      <CButton color='success' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                        <CIcon icon={icon.cilCheckAlt}/>
                        <div style={{border: "0.5px solid white", height: "10px", width: "2px"}}></div>
                        <span>Submit</span>
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardBody>
            </CCard>
        </CRow>
        <CRow className='pt-4'>
          <CCard className='p-0'>
            <CCardHeader>
              <CCardTitle>RECEIVING DATA</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs='auto'>
                  <CButton color='info' style={{color: 'white'}} onClick={()=>setShowModalUpdate(true)} className='flex-grow-0 d-flex align-items-center gap-2'>
                    <CIcon icon={icon.cilCloudUpload}/>
                    <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                    <span>Upload a File</span>
                  </CButton>
                </CCol>
                <CCol>
                  <CButton onClick={()=>handleExport(dataReceiving, 'receiving')} color='success' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                    <CIcon icon={icon.cilCloudDownload}/>
                    <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                    <span>Export to File</span>
                  </CButton>
                </CCol>
              </CRow>
              <CRow className='p-2 pt-3'>
                <CTable bordered>
                  <CTableHead color='light'>
                    <CTableRow>
                      <CTableHeaderCell>DN No</CTableHeaderCell>
                      <CTableHeaderCell>Material No</CTableHeaderCell>
                      <CTableHeaderCell>Material Description</CTableHeaderCell>
                      <CTableHeaderCell>Req Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Actual Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Difference</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    { dataReceiving.map((data, index)=>{
                      return(
                        <CTableRow key={index} color={`${data.difference !== 0 ? "danger" : ""}`}>
                        {/* <CTableRow key={index} style={{ backgroundColor: `${data.difference !== 0 ? "red" : ""}`}}> */}
                          <CTableDataCell>{data.dn_no}</CTableDataCell>
                          <CTableDataCell>{data.material_no}</CTableDataCell>
                          <CTableDataCell>{data.material_desc}</CTableDataCell>
                          <CTableDataCell>{data.req_qty}</CTableDataCell>
                          <CTableDataCell>{data.actual_qty}</CTableDataCell>
                          <CTableDataCell>{data.difference}</CTableDataCell>
                          <CTableDataCell>{data.date}</CTableDataCell>
                        </CTableRow>
                      )
                    })}
                  </CTableBody>
                </CTable>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>

        {/* Modal Upload File */}
        <CModal 
          visible={showModalUpdate}
          onClose={() => setShowModalUpdate(false)}
        >
          <CModalHeader>
            <CModalTitle>Upload Receiving Data</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className=''>
              <CInputGroup className='d-flex flex-column'>
                <CFormLabel>File Excel (.xlsx)</CFormLabel>
                <CFormInput className='w-100' type='file'/>
              </CInputGroup>
            </CRow>

          </CModalBody>
          <CModalFooter>
            <CButton onClick={()=>setShowModalUpdate(false)} color="secondary">Close</CButton>
            <CButton color="success" style={{color: "white"}}>Upload</CButton>
          </CModalFooter>
        </CModal>
    </CContainer>
  )
}

export default Receiving