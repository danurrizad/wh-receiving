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
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const Schedule2 = () => {
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

  const [queryFilter, setQueryFilter] = useState({
    date: new Date(),
    sortType: "",
    day: new Date().getDay()
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

  // const getDataSchedules = () => {
  //   setDataSchedules(dataSchedulesDummy)
  // }

  const getDataSchedulesToday = () => {
    const filteredDataSchedule = dataSchedulesDummy.filter((item) => {
      if(queryFilter.day){
        // Compare only the date part (ignore time)
        return item.day === queryFilter.day
      } else{
        return item
      }
    });
    setDataSchedules(filteredDataSchedule)
  }

  const getDataScheduleByDay = () => {
    // Filter data by date
    const filteredDataSchedule = dataSchedulesDummy.filter((item) => {
      if(queryFilter.day !== 7){
        
        // Compare only the date part (ignore time)
        return item.day === queryFilter.day
      } else{
        return item
      }
    });
    if(queryFilter.sortType === "Newest"){
      const filteredSortedAscending = [...filteredDataSchedule].sort((a, b) => parseDate(a.date) - parseDate(b.date));
      setDataSchedules(filteredSortedAscending)
    } else if(queryFilter.sortType === "Oldest"){
      const filteredSortedDescending = [...filteredDataSchedule].sort((a, b) => parseDate(b.date) - parseDate(a.date));
      setDataSchedules(filteredSortedDescending)
    }
    else{
      setDataSchedules(filteredDataSchedule)
    }
  }
  // Function to convert "DD-MM-YYYY" to Date object
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const sortDataSchedules = (type, data) => {
    console.log("type :", type)
    setQueryFilter({...queryFilter, sortType: type !== null ? type.value : ""})
    if(type){
      if(type.value==='Newest'){
        // Sort ascending
        const sortedAscending = [...data].sort((a, b) => parseDate(a.date) - parseDate(b.date));
        setDataSchedules(sortedAscending)
      } else if(type.value==='Oldest'){
        // Sort descending
        const sortedDescending = [...data].sort((a, b) => parseDate(b.date) - parseDate(a.date));
        setDataSchedules(sortedDescending)
      } else{
        getDataScheduleByDate()
      }
    } else{
      getDataScheduleByDate()
    }
  }

  const handleChangeFilter = (e) =>{
    if(e){
      setQueryFilter({...queryFilter, day: e.value})
      getDataScheduleByDay()
    }else{
      setQueryFilter({...queryFilter, day: 7})
    }
  }
  
  useEffect(()=>{
    // getDataSchedules()
    getDataSchedulesToday()
  }, [])

  useEffect(()=>{
    getDataScheduleByDay()
  }, [queryFilter.day])

  
  const optionsSelectDay = [
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
    { label: "Sunday", value: 0 },
  ]

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
    setTimeout(()=>{
      setFormInput({ 
        vendor_id: "", 
        vendor_name: "",
        schedule_from: "",
        schedule_to: "",
        date: "",
        day: "",
        arrival_time: "",
        status: ""
      })
    }, 5000)
    addToast(TemplateToast("success", "success", "Data schedule has been submitted!"))
  }


  


  return (
    <CContainer fluid>
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        
        <CRow className='pt-4'>
          <CCard className='p-0'>
            <CCardHeader>
              <CCardTitle>SCHEDULE DATA</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow>
                {/* <CCol sm='10' className='d-flex align-items-end'>
                  <CButton onClick={()=>setShowModalUpdate(true)} color='info' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                    <CIcon icon={icon.cilCloudUpload}/>
                    <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                    <span>Upload a File</span>
                  </CButton>
                </CCol> */}
                <CCol sm='10' className='d-flex align-items-end'>
                  <CButton color='success' onClick={()=>handleExport(dataSchedules, 'schedule')} style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                    <CIcon icon={icon.cilCloudDownload}/>
                    <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                    <span>Export to File</span>
                  </CButton>
                </CCol>
                <CCol sm='2' className=''>
                    <CFormText>Filter by Day</CFormText>
                    <Select isClearable options={optionsSelectDay} value={optionsSelectDay.find((opt)=>opt.value === queryFilter.day) || 7} placeholder='All day' onChange={handleChangeFilter} />
                </CCol>
                {/* <CCol sm='auto' className=''>
                    <CFormText>Sort by</CFormText>
                    <Select 
                      isClearable 
                      placeholder='Select sort' 
                      options={[{ label: 'Newest', value: 'Newest'}, { label: 'Oldest', value: 'Oldest'}]} 
                      value={[{ label: 'Newest', value: 'Newest' }, { label: 'Oldest', value: 'Oldest' }].find(
                          (option) => option.value === queryFilter.sortType
                        ) || ""} 
                      onChange={(value)=>sortDataSchedules(value , dataSchedulesDummy)}
                      /> */}
                    {/* <DatePicker value={queryFilter.date} onChange={(dateValue)=>setQueryFilter({...queryFilter, date: dateValue})} className="" placeholder="All time" size='lg'/> */}
                {/* </CCol> */}
              </CRow>
              <CRow className='p-3'>
                  <CTable bordered>
                    <CTableHead color='light'>
                      <CTableRow align='middle' className='text-center'>
                        <CTableHeaderCell rowSpan={2}>No</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor Code</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Vendor Name</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Day</CTableHeaderCell>
                        {/* <CTableHeaderCell rowSpan={2}>Date</CTableHeaderCell> */}
                        <CTableHeaderCell colSpan={2}>Schedule Time Plan</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Arrival Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Status</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Delay Time</CTableHeaderCell>
                      </CTableRow>
                      <CTableRow align='middle' className='text-center'>
                        <CTableHeaderCell >From</CTableHeaderCell>
                        <CTableHeaderCell >To</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        { currentItems.map((data, index)=> {
                          const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                          return(
                            <CTableRow key={index}>
                              <CTableDataCell>{index+1}</CTableDataCell>
                              <CTableDataCell>{data.vendor_id}</CTableDataCell>
                              <CTableDataCell>{data.vendor_name}</CTableDataCell>
                              <CTableDataCell>{daysOfWeek[data.day]}</CTableDataCell>
                              {/* <CTableDataCell>{data.date}</CTableDataCell> */}
                              <CTableDataCell>{data.schedule_from}</CTableDataCell>
                              <CTableDataCell>{data.schedule_to}</CTableDataCell>
                              <CTableDataCell>{data.arrival_time}</CTableDataCell>
                              <CTableDataCell className='text-center'>
                                <div className={`py-1 px-2 ${data.status.toLowerCase() === 'delayed' && "blink"}`} style={{ backgroundColor: data.status === "Delayed" ? "#F64242" : data.status === "On Schedule" ? "#35A535" : "transparent", color: 'white', borderRadius: '5px'}}>
                                  {data.status.toUpperCase()}  
                                  </div>
                                </CTableDataCell>
                              <CTableDataCell style={{ color: data.status === "Delayed" ? "#F64242" : ""}}> {data.delay_time !== 0 ? `- ${data.delay_time}` : ""}</CTableDataCell>
                            </CTableRow>
                          )
                        })}
                        { currentItems.length === 0 && (
                          <CTableRow>
                            <CTableDataCell colSpan={10} style={{ opacity: "50%"}}>
                              <div className='d-flex flex-column align-items-center justify-content-center py-4'>
                                <CIcon icon={icon.cilTruck} size='4xl'/>
                                <span>Data not found</span>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        )}
                    </CTableBody>
                  </CTable>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>


        {/* -----------------------------------------------------------------------------------MODAL RENDERING--------------------------------------------------------------------------------------- */}

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

export default Schedule2