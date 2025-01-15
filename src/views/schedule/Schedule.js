import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster } from '@coreui/react'
import { dataSchedulesDummy } from '../../utils/DummyData'
import { DatePicker } from 'rsuite';
import  colorStyles from '../../utils/StyleReactSelect'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import Pagination from '../../components/Pagination'
import { handleExport } from '../../utils/ExportToExcel'
import TemplateToast from '../../components/TemplateToast'

const Schedule = () => {
  const [toast, addToast] = useState()
  const toaster = useRef(null)
  const [ dataSchedules, setDataSchedules ] = useState(dataSchedulesDummy)
  const [ showModalUpdate, setShowModalUpdate] = useState(false)
  const [ showModalScanner, setShowModalScanner ] = useState(false)

  const defaultOptionsSelectVendor = dataSchedulesDummy?.map((data)=>{
    return{
      label: `${data.vendor_id} - ${data.vendor_name}`,
      value: {
        id: data.vendor_id,
        name: data.vendor_name,
      }
    }
  })
  const [ optionsSelectVendor, setOptionsSelectVendor] = useState(defaultOptionsSelectVendor)

  const [ formInput, setFormInput ] = useState({
    date: "",
    day: "",
    vendor_id: "",
    vendor_name: "",
    schedule_from: "",
    schedule_to: "",
    arrival_time: "",
    status: ""
  })

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


  

  const handleChangeInputVendor = (e) => {
    if(e){
      const foundData = dataSchedulesDummy.filter((data)=>data.vendor_id === e.value.id)
      console.log("Found data :", foundData)
      setFormInput({ 
        ...formInput, 
        vendor_id: e.value.id, 
        vendor_name: e.value.name, 
        schedule_from: foundData[0].schedule_from, 
        schedule_to: foundData[0].schedule_to,
        date: foundData[0].date,
        day: foundData[0].day,
        arrival_time: foundData[0].arrival_time === "" ? "" : foundData[0].arrival_time,
        status: foundData[0].status === "" ? "" : foundData[0].status 
      })
    } else{
      setFormInput({ 
        ...formInput, 
        vendor_id: "", 
        vendor_name: "",
        schedule_from: "",
        schedule_to: "",
        date: "",
        day: "",
        arrival_time: "",
        status: ""
      })
    }
  }

  const handleCreateOptionVendor = (inputValue) => {
    const newOption = {label: inputValue, value: {id: inputValue, name: "Vendor Name Baru"}}
    // console.log("newOption :", newOption)
    setOptionsSelectVendor([...optionsSelectVendor, newOption])
    setFormInput({...formInput, vendor_id: newOption.value.id, vendor_name: newOption.value.name})
  }

  const handleSubmitSchedule = ( data ) => {
    const dateNow = new Date()

    const [day, month, year] = data.date.split("-")
    const formattedDate = `${year}-${month}-${day}`

    // Combine the dummy date with schedule times
    const scheduleFrom = new Date(`${formattedDate}T${data.schedule_from}:00`);
    const scheduleTo = new Date(`${formattedDate}T${data.schedule_to}:00`);

    // Extract hours and minutes
    const hours = dateNow.getHours().toString().padStart(2, "0"); // Ensure 2 digits
    const minutes = dateNow.getMinutes().toString().padStart(2, "0"); // Ensure 2 digits

    // Combine to get "HH:mm"
    const timeNow = `${hours}:${minutes}`;
   
    // Compare the times
    if (dateNow > scheduleTo) {
      setFormInput({...formInput, arrival_time: timeNow, status: "Delayed"})
      console.log("Current time is after the schedule.");
    } else {
      setFormInput({...formInput, arrival_time: timeNow, status: "On Schedule"})
      console.log("Current time is within the schedule.");
    }
    addToast(TemplateToast("success", "success", "Data schedule has been submitted!"))
  }

  return (
    <CContainer fluid>
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
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
                            <DatePicker defaultValue={new Date()} className="w-100" placeholder="Select dates" size='lg' block />
                          </div>
                        </CRow>
                        <CRow className=''>
                          <CCol md={8}>
                            <CFormLabel  style={{ fontSize: "0.8rem" }}>VENDOR CODE</CFormLabel>
                            <CInputGroup>
                              {/* <CFormInput/> */}
                              {/* <Select className='w-75' isClearable options={optionsSelectVendor}/> */}
                              <CreatableSelect className='w-75' onCreateOption={handleCreateOptionVendor} isClearable options={optionsSelectVendor} value={optionsSelectVendor.find(option => option.value === formInput.vendor_id)} onChange={handleChangeInputVendor} />
                              <CButton color='success' className='p-0 px-2' style={{border: "1px solid #C8CCD2"}}>
                                <CIcon style={{color: "white"}} icon={icon.cilBarcode} size='xl'/>
                              </CButton>
                            </CInputGroup>
                          </CCol>
                          <CCol md={4} className='d-flex align-items-end justify-content-end'>
                            <CButton onClick={()=>handleSubmitSchedule(formInput)} color='success' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2' disabled={formInput.vendor_id === ""}>
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
                                  <CCol>{formInput.vendor_id}</CCol>
                                </CRow>
                                <CRow>
                                  <CCol xs={4}>Vendor Name</CCol>
                                  <CCol xs='auto'>:</CCol>
                                  <CCol>{formInput.vendor_name}</CCol>
                                </CRow>
                                <CRow>
                                  <CCol xs={4}>Arrival [PLAN]</CCol>
                                  <CCol xs='auto'>:</CCol>
                                  <CCol>{formInput.schedule_from} {formInput.schedule_from ? "-" : ""} {formInput.schedule_to}</CCol>
                                </CRow>
                                <CRow>
                                  <CCol xs={4}>Arrival [ACT]</CCol>
                                  <CCol xs='auto'>:</CCol>
                                  <CCol>{formInput.arrival_time}</CCol>
                                </CRow>
                              </CCard>
                            </CRow>
                          </CCol>
                          <CCol  className='d-flex flex-column' style={{ fontSize: "0.8rem" }}>
                            <CRow className='mb-2'>SCHEDULE STATUS</CRow>
                            <CRow className='flex-grow-1'>
                              <CCard color={formInput.status === "Delayed" ? 'danger' : formInput.status === "On Schedule" ? 'success' : ""} className='p-4 d-flex align-items-center justify-content-center'>
                                <h2 style={{ color: "white"}}>{formInput.status}</h2>
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
                        <CTableHeaderCell rowSpan={2}>Vendor Code</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor Name</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Day</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Date</CTableHeaderCell>
                        <CTableHeaderCell colSpan={2}>Schedule Time Plan</CTableHeaderCell>
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
                                <div className="py-1 px-2 " style={{ backgroundColor: data.status === "Delayed" ? "#F64242" : data.status === "On Schedule" ? "#35A535" : "transparent", color: 'white', borderRadius: '5px'}}>
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