import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster } from '@coreui/react'
import {  DateRangePicker } from 'rsuite';
import { handleExport } from '../../utils/ExportToExcel'
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Receiving from '../receiving/Receiving';
import useReceivingDataService from '../../services/ReceivingDataServices'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { useToast } from '../../App';


const Book = () => {
  const addToast = useToast()
  const { getDNByDateData } = useReceivingDataService()

  const [ showModalInput, setShowModalInput] = useState(false)
  const [ showModalScanner, setShowModalScanner ] = useState(false)

  const [queryFilter, setQueryFilter] = useState({
    date: new Date(),
  })

  
  const [plants] = useState(['Karawang 1', 'Karawang 2', 'Karawang 3', 'Sunter 1', 'Sunter 2']);

  const getDNbyDate = async() => {
    try {
      // const dateFormat = date.toISOString().split('T')[0]
      const response = await getDNByDateData() 
      console.log("response :", response)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    getDNbyDate()
  }, [])
 

  


  return (
    <CContainer fluid>
        <CRow>
          <CCard className='p-0'>
            <CCardHeader>
              <CCardTitle>LOGS DATA</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow className='d-flex align-items-end ' style={{ border: "2px solid red"}}>
                
                <CCol sm='4' className=''>
                    <CFormText>Search</CFormText>
                    <InputText/>
                </CCol>

                <CCol className='d-flex justify-content-end gap-4'>
                  <CCol sm='3' className=''>
                      <CFormText>Filter by Plant</CFormText>
                      <Dropdown
                        // value={filters['schedule'].value}
                        options={plants}
                        // onChange={handleChangeDate}
                        placeholder="Select plant"
                        className="p-column-filter mb-2"
                        showClear
                        style={{ width: '100%', borderRadius: '5px' }}
                      />
                  </CCol>
                  <CCol sm='4' className=''>
                      <CFormText>Filter by Date</CFormText>
                      <DateRangePicker showOneCalendar placeholder='All time' position='start' />
                  </CCol>
                </CCol>
              </CRow>
              <CRow className='mt-3'>
                  <CTable responsive bordered hover>
                    <CTableHead color='light'>
                      <CTableRow align='middle' className='text-center'>
                        <CTableHeaderCell rowSpan={2}>No</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>DN No</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor Code</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor Name</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Day</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Date</CTableHeaderCell>
                        <CTableHeaderCell colSpan={2}>Schedule Time Plan</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Arrival Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Status</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Delay Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Log</CTableHeaderCell>
                      </CTableRow>
                      <CTableRow align='middle' className='text-center'>
                        <CTableHeaderCell >From</CTableHeaderCell>
                        <CTableHeaderCell >To</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        
                    </CTableBody>
                  </CTable>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>


        {/* -----------------------------------------------------------------------------------MODAL RENDERING--------------------------------------------------------------------------------------- */}

        {/* Modal Upload File */}
        <CModal 
          visible={showModalInput}
          onClose={() => setShowModalInput(false)}
          size='xl'
          backdrop="static"
        >
          <CModalHeader>
            <CModalTitle>Log Receiving</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol md={4}>
                  <CFormText>Vendor Code</CFormText>
                  {/* <CFormInput disabled value={formInput.vendor_id} className='w-100' placeholder='Vendor code'/> */}
              </CCol>
              <CCol md={4} className='pt-md-0 pt-3'>
                <CFormText>Vendor Name</CFormText>
                {/* <CFormInput disabled value={formInput.vendor_name} className='w-100' placeholder='Vendor name'/> */}
              </CCol>
             
            </CRow>  
          <CRow className='pt-3'>
            <CTable responsive bordered hover>
              <CTableHead color='light'>
                <CTableRow>
                  <CTableHeaderCell>DN No</CTableHeaderCell>
                  <CTableHeaderCell>Material No</CTableHeaderCell>
                  <CTableHeaderCell>Material Description</CTableHeaderCell>
                  <CTableHeaderCell>Rack Address</CTableHeaderCell>
                  <CTableHeaderCell>Planning Quantity</CTableHeaderCell>
                  <CTableHeaderCell>Actual Quantity</CTableHeaderCell>
                  <CTableHeaderCell>Difference</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
               
              </CTableBody>
            </CTable>
          </CRow>
          </CModalBody>
          
        </CModal>
       
       
        {/* Modal QR Scanner */}
        <CModal 
          visible={showModalScanner}
          onClose={() => setShowModalScanner(false)}
        >
          <CModalHeader>
            <CModalTitle>Scan Barcode DN No</CModalTitle>
          </CModalHeader>
          <CModalBody className='w-100 overflow-hidden' style={{ position: "relative"}}>
            <BarcodeScannerComponent
              width='100%'
              height='100%'
              onUpdate={(err, result) => {
                if (result) console.log("RESULT :", result);
                else console.warn("BARCODE NOT FOUND");
              }}
            />
            {/* design border camera */}
            <div style={{position: "absolute", top: '30px', left: '30px', width: '75px', height: '75px', border: "10px solid white", borderRight: '0', borderBottom: '0'}}></div>
            <div style={{position: "absolute", top: '30px', right: '30px', width: '75px', height: '75px', border: "10px solid white", borderLeft: '0', borderBottom: '0'}}></div>
            <div style={{position: "absolute", bottom: '30px', left: '30px', width: '75px', height: '75px', border: "10px solid white", borderRight: '0', borderTop: '0'}}></div>
            <div style={{position: "absolute", bottom: '30px', right: '30px', width: '75px', height: '75px', border: "10px solid white", borderLeft: '0', borderTop: '0'}}></div>
          </CModalBody>
        </CModal>
    </CContainer>
  )
}

export default Book