import React, { useState, useEffect} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { dataSchedulesDummy, dataReceivingDummy } from '../../utils/DummyData'
import  colorStyles from '../../utils/StyleReactSelect'
import Select from 'react-select'
import Pagination from '../../components/Pagination'

const Schedule = () => {
  const [ dataSchedules, setDataSchedules ] = useState(dataSchedulesDummy)

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
                            <CFormInput/>
                            <CIcon style={{}} icon={icon.cilCalendar} size='xxl' className='flex-shrink-0'/>
                          </div>
                        </CRow>
                        <CRow>
                          <CCol md={8}>
                          <CFormLabel  style={{ fontSize: "0.8rem" }}>VENDOR CODE</CFormLabel>
                          <div className='d-flex align-items-center gap-2'>
                            <CFormInput/>
                            <CIcon style={{}} icon={icon.cilBarcode} size='xxl' className='flex-shrink-0'/>
                          </div>
                          </CCol>
                          <CCol md={4}>
                          <CButton color='success' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                        <CIcon icon={icon.cilCheckAlt}/>
                        <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                        <span>Submit</span>
                      </CButton>
                </CCol>
                        </CRow>
                      </CCol>
                      <CCol sm={5} className='d-flex flex-column'  >
                      <CRow style={{ fontSize: "0.8rem" }}>
                        VENDOR STATUS
                        </CRow>
                        {/* <CCard className='p-1 mt-2 h-100' style={{ backgroundColor:"rgb(152, 193, 255)", borderRadius: "10px"}}> */}
                        <CCard className='p-1 mt-2 h-100' style={{ backgroundColor:"gray", borderRadius: "8px"}}>
                          <CTable className=''>
                            <CTableRow>
                              <CTableDataCell>Vendor Code</CTableDataCell>
                              <CTableDataCell>:</CTableDataCell>
                              <CTableDataCell>123192</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>Vendor Namer</CTableDataCell>
                              <CTableDataCell>:</CTableDataCell>
                              <CTableDataCell>Cahaya Prima</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>ARRIVAL [PLAN]</CTableDataCell>
                              <CTableDataCell>:</CTableDataCell>
                              <CTableDataCell>10-01-2025</CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableDataCell>ARRIVAL [ACT]</CTableDataCell>
                              <CTableDataCell>:</CTableDataCell>
                              <CTableDataCell>10-01-2025</CTableDataCell>
                            </CTableRow>
                          </CTable>
                        </CCard>
                      </CCol>
                      <CCol sm={3} className='d-flex flex-column' style={{ fontSize: "0.8rem" }}>
                        <CRow>SCHEDULE STATUS</CRow>
                        <CRow className='h-100'>
                          <CCard className='p-5 d-flex align-items-center justify-content-center'>
                            <h1>ON TIME</h1>
                          </CCard>
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
                <CCol>
                  <CButton color='info' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                    <CIcon icon={icon.cilCloudUpload}/>
                    <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                    <span>Upload a File</span>
                  </CButton>
                </CCol>
              </CRow>
              <CRow className='p-3'>
                  <CTable bordered>
                    <CTableHead>
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
    </CContainer>
  )
}

export default Schedule