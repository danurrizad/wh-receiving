import React, { useState, useEffect} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { dataSchedulesDummy } from '../../utils/DummyData'
import { DatePicker } from 'rsuite';
import  colorStyles from '../../utils/StyleReactSelect'
import Select from 'react-select'
import Pagination from '../../components/Pagination'
import { handleExport } from '../../utils/ExportToExcel'

const Schedule = () => {
  const [ dataSchedules, setDataSchedules ] = useState(dataSchedulesDummy)
  const [ showModalUpdate, setShowModalUpdate] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems =
    dataSchedules.length > 0
        ? dataSchedules.slice(indexOfFirstItem, indexOfLastItem)
        : dataSchedules.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(()=>{
     const currentItems = dataSchedules.length > 0
        ? dataSchedules.slice(indexOfFirstItem, indexOfLastItem)
        : dataSchedules.slice(indexOfFirstItem, indexOfLastItem)
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

  const getDataSchedules = () => {
    setDataSchedules(dataSchedulesDummy)
  }

 

  const handleFilterSchedule = (selectedOption) => {
    if (!selectedOption) {
      // If no option selected, reset to all data
      setDataSchedules(dataSchedulesDummy);
    } else {
      // Filter based on the selected status
      const filtered = dataSchedulesDummy.filter(
        (item) => item.status === selectedOption.value
      );
      setDataSchedules(filtered);
    }
  }

 


  
  useEffect(()=>{
    getDataSchedules()
  }, [])

  return (
    <CContainer fluid>
        <CRow>
            <CCard className='p-0'>
                <CCardHeader>
                    <CCardTitle>INPUT</CCardTitle>
                </CCardHeader>
                <CCardBody >
                
                    <CRow>
                      <CCol sm={4}>
                        <CRow className='mb-3'>
                          <CFormLabel style={{ fontSize: "0.8rem" }}>DATE</CFormLabel>
                          <div className='d-flex align-items-center gap-2'>
                            <DatePicker className="w-100" placeholder="Select dates" size='lg' block />
                          </div>
                        </CRow>
                        <CRow className=''>
                          <CCol md={8}>
                            <CFormLabel  style={{ fontSize: "0.8rem" }}>VENDOR CODE</CFormLabel>
                            <CInputGroup className=''>
                              <CFormInput/>
                              <CButton color='success' className='p-0 px-2' style={{border: "1px solid #C8CCD2"}}>
                                <CIcon style={{color: "white"}} icon={icon.cilBarcode} size='xl'/>
                              </CButton>
                            </CInputGroup>
                          </CCol>
                          <CCol md={4} className='d-flex align-items-end justify-content-end'>
                            <CButton color='success' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                              <CIcon icon={icon.cilCheckAlt}/>
                              <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                              <span>Submit</span>
                            </CButton>
                          </CCol>
                        </CRow>
                      </CCol>
                      <CCol sm={8} className='px-4' >
                        <CRow className='h-100' >
                          <CCol className='px-4 d-flex flex-column' >
                            <CRow className='mb-2' style={{ fontSize: "0.8rem" }}>VENDOR STATUS</CRow>
                            <CRow className='flex-grow-1'>
                              <CCard className='px-3 pt-3' style={{ backgroundColor:"rgba(129,198,240, 0.15)", borderRadius: "8px"}}>
                                <CRow>
                                  <CCol xs={4}>Vendor Code</CCol>
                                  <CCol xs='auto'>:</CCol>
                                  <CCol>128192</CCol>
                                </CRow>
                                <CRow>
                                  <CCol xs={4}>Vendor Name</CCol>
                                  <CCol xs='auto'>:</CCol>
                                  <CCol>Cahaya Prima</CCol>
                                </CRow>
                                <CRow>
                                  <CCol xs={4}>Arrival [PLAN]</CCol>
                                  <CCol xs='auto'>:</CCol>
                                  <CCol>10-01-2025</CCol>
                                </CRow>
                                <CRow>
                                  <CCol xs={4}>Arrival [ACT]</CCol>
                                  <CCol xs='auto'>:</CCol>
                                  <CCol>10-01-2025</CCol>
                                </CRow>
                              </CCard>
                            </CRow>
                          </CCol>
                          <CCol  className='d-flex flex-column' style={{ fontSize: "0.8rem" }}>
                            <CRow className='mb-2'>SCHEDULE STATUS</CRow>
                            <CRow className='flex-grow-1'>
                              <CCard className='p-4 d-flex align-items-center justify-content-center'>
                                <h2>ON SCHEDULE</h2>
                              </CCard>
                            </CRow>
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
              
                
                </CCardBody>
            </CCard>
        </CRow>
        <CRow className='pt-4'>
          <CCard className='p-0'>
            <CCardHeader>
              <CCardTitle>SCHEDULE DATA</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm='auto'>
                  <CButton onClick={()=>setShowModalUpdate(true)} color='info' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                    <CIcon icon={icon.cilCloudUpload}/>
                    <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                    <span>Upload a File</span>
                  </CButton>
                </CCol>
                <CCol>
                  <CButton color='success' onClick={()=>handleExport(dataSchedules, 'schedule')} style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                    <CIcon icon={icon.cilCloudDownload}/>
                    <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                    <span>Export to File</span>
                  </CButton>
                </CCol>
              </CRow>
              <CRow className='p-3'>
                  <CTable bordered>
                    <CTableHead color='light'>
                      <CTableRow align='middle'>
                        <CTableHeaderCell rowSpan={2}>No</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor ID</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor Name</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Day</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Date</CTableHeaderCell>
                        <CTableHeaderCell colSpan={2}>Schedule Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Arrival Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Status</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Delay Time</CTableHeaderCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell >From</CTableHeaderCell>
                        <CTableHeaderCell >To</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        { currentItems.map((data, index)=> {
                          return(
                            <CTableRow key={index}>
                              <CTableDataCell>{index+1}</CTableDataCell>
                              <CTableDataCell>{data.vendor_id}</CTableDataCell>
                              <CTableDataCell>{data.vendor_name}</CTableDataCell>
                              <CTableDataCell>{data.day}</CTableDataCell>
                              <CTableDataCell>{data.date}</CTableDataCell>
                              <CTableDataCell>{data.schedule_from}</CTableDataCell>
                              <CTableDataCell>{data.schedule_to}</CTableDataCell>
                              <CTableDataCell>{data.arrival_time}</CTableDataCell>
                              <CTableDataCell className='text-center'>
                                <div className="py-1 px-2 " style={{ backgroundColor: data.status === "Delayed" ? "#F64242" : "#35A535", color: 'white', borderRadius: '5px'}}>
                                  {data.status}  
                                  </div>
                                </CTableDataCell>
                              <CTableDataCell style={{ color: data.status === "Delayed" ? "#F64242" : ""}}> {data.delay_time !== 0 ? `- ${data.delay_time}` : ""}</CTableDataCell>
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
            <CModalTitle>Upload Schedule Data</CModalTitle>
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

export default Schedule