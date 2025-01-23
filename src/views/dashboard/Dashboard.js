import React, { useState, useEffect } from 'react'
import { dataSchedulesDummy, dataReceivingDummy,dataDummy } from '../../utils/DummyData'
import  colorStyles from '../../utils/StyleReactSelect'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'
import Pagination from '../../components/Pagination'
import { DatePicker, DateRangePicker } from 'rsuite';
import 'primeicons/primeicons.css'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import 'primereact/resources/themes/nano/theme.css'
import 'primereact/resources/primereact.min.css'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CBadge,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CFormLabel,
  CFormText,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {
  cilCalendar,
} from '@coreui/icons'

import useChartData from '../../services/ChartDataServices'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import CIcon from '@coreui/icons-react'
import * as icon from "@coreui/icons"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const Dashboard = () => {
  const [ dataSchedules, setDataSchedules ] = useState(dataSchedulesDummy)
  const [ dataReceiving, setDataReceiving ] = useState(dataReceivingDummy)
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [ dataDummies, setDataDummies ] = useState(dataDummy)
  const [currentPage, setCurrentPage] = useState(1)
  const [dates, setDates] = useState([null, null]) // State for date range
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const [selectedPlant, setSelectedPlant] = useState({ value: 'all', label: 'All' })
  const [plant, setPlant] = useState([])
  const [isVisible, setIsVisible] = useState(true); // State to control visibility
  const toggleVisibility = () => setIsVisible(!isVisible); // Toggle function
   const defaultOptionsSelectVendor = dataDummies?.map((data)=>{
      return{
        label: `${data.vendor_id} - ${data.vendor_name}`,
        value: {
          id: data.vendor_id,
          name: data.vendor_name,
        }
      }
    })
    const [ optionsSelectVendor, setOptionsSelectVendor] = useState(defaultOptionsSelectVendor)
  const currentItems =
    dataSchedules.length > 0
        ? dataSchedules.slice(indexOfFirstItem, indexOfLastItem)
        : dataSchedules.slice(indexOfFirstItem, indexOfLastItem)
 const [ formInput, setFormInput ] = useState({
    date: "",
    day: "",
    vendor_id: "",
    vendor_name: "",
    schedule_from: "",
    schedule_to: "",
    arrival_time: "",
    status: "",
    
    materials: [{
      vendor_id: "",
      dn_no: "",
      material_no: "",
      material_desc: "",
      rack_address: "",
      req_qty: "",
      actual_qty: "",
    }],
  })
  useEffect(()=>{
     const currentItems = dataSchedules.length > 0
        ? dataSchedules.slice(indexOfFirstItem, indexOfLastItem)
        : dataSchedules.slice(indexOfFirstItem, indexOfLastItem)
  }, [currentPage])

  const {setChartData, getChartOption} = useChartData({currentItems})
  const options = [
    // { value: 'all', label: 'All' },
    { value: 'Shortage', label: 'Shortage' },
    { value: 'Optimal', label: 'Optimal' },
  ]

  const [ showCard, setShowCard ] = useState({
    summary: true,
    schedule: true,
    receiving: true
  })
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };
  const getDataSchedules = () => {
    setDataSchedules(dataSchedulesDummy)
  }

  const getDataReceiving = () => {
    setDataReceiving(dataReceivingDummy)
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

  const handleFilterReceiving = (selectedOption) => {
    if (!selectedOption) {
      // If no option selected, reset to all data
      setDataReceiving(dataReceivingDummy);
    } else {
      // Filter based on the selected status
      if(selectedOption.value === "Shortage"){
        const filtered = dataReceivingDummy.filter(
          (item) => item.difference !== 0
        );
        setDataReceiving(filtered)
      } else{
        const filtered = dataReceivingDummy.filter(
          (item) => item.difference === 0
        )
        setDataReceiving(filtered)
      }
    }
  }

  const handleChangeSearch = (e) => {
    if(e){
      console.log("e :", e)
      if(e.value === ""){
        setDataReceiving(dataReceivingDummy)
      }
      else{
        const matchesSearch = dataReceiving.filter((data)=>data.material_no.includes(e.value)) || dataReceiving.filter((data)=>data.material_desc.includes(e.value))
        setDataReceiving(matchesSearch);
      }
    } else{
      setDataReceiving(dataReceivingDummy)
    }
  }


  
  useEffect(()=>{
    getDataSchedules()
    getDataReceiving()
  }, [])

const optionsSelectDN = Array.from(
    new Set(dataReceivingDummy.map((data) => data.dn_no))
  ).map((uniqueValue) => {
    return {
      value: uniqueValue,
      label: uniqueValue,
    };
  });
  
  const renderHeader = () => {
    return (
      <div>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            style={{ width: '100%', borderRadius: '5px' }}
          />
        </IconField>
      </div>
    )
  }
  const plantOptions = [
    { value: 'all', label: 'All' }, // Menambahkan opsi "All" di awal
    ...plant.map((plant) => ({
      value: plant.id,
      label: plant.plantName,
    })),
  ]

  const handlePlantChange = (selectedPlant) => {
    if (selectedPlant && selectedPlant.value !== 'all' && selectedPlant.value !== '') {
    
    } else {
      setSelectedPlant({ value: 'all', label: 'All' })
    
    }
  }
  const handleClickDetail = (data) => {
    setFormInput({
      date: data.date,
      day: data.day,
      vendor_id: data.vendor_id,
      vendor_name: data.vendor_name,
      schedule_from: data.schedule_from,
      schedule_to: data.schedule_to,
      arrival_time: data.arrival_time,
      status: data.status,

      materials: data.materials.map((material)=>{return({
        vendor_id: material.vendor_id,
        dn_no: material.dn_no,
        material_no: material.material_no,
        material_desc: material.material_desc,
        rack_address: material.rack_address,
        date: material.date,
        req_qty: material.req_qty,
        actual_qty: material.actual_qty,
        difference: material.difference,
      })})
    })
    setShowModalInput(true)
  }

  return (
  <CContainer fluid>
    <CRow className='mb-3'>
      <CCard
         className="px-0 bg-white text-black"
          style={{
          maxHeight: `${showCard.summary ? "1000px" : "50px"}`,
          overflow: "hidden",
          transitionDuration: "500ms",
          border: "1px solid #9AA6B2", // Menambahkan border dengan warna #074799
        }}>
         <CCardHeader
            style={{
            position: "relative",
            cursor: "pointer",
            backgroundColor: "#9AA6B2", // Warna latar belakang header tetap putih
            color: "white", }}
            onClick={() => setShowCard({ ...showCard, summary: !showCard.summary })} >
             <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
             <CCardTitle className="text-center fs-4">SUMMARY RECEIVING WAREHOUSE</CCardTitle>
             </div>
         </CCardHeader>
    <CCardBody style={{ overflow: "auto"  }}>
    <CRow className="d-flex justify-content-between align-items-center">
  {/* Tombol Hide/Show di pojok kiri */}
  <CCol
  md={6}
  className="d-flex justify-content-center align-items-start gap-1" // Atur agar rata tengah dengan jarak antar kolom
>
  {/* Kolom pertama */}
  <CCol
  sm={7}
  className="d-flex justify-content-center-start gap-3" // Kolom horizontal dengan elemen di tengah
>
  {/* Filter Detail */}
  <div className="d-flex flex-column align-items-center">
    <CFormText style={{ alignSelf: "flex-start" }}>Filter Detail</CFormText>
    <button
      className="btn"
      style={{
        backgroundColor: "#D9EAFD",
        color: "#000",
      }}
      onClick={toggleVisibility}
    >
      {isVisible ? "Hide Detail" : "Show Detail"}
    </button>
  </div>

  {/* Filter Plant */}
  <div className="d-flex flex-column align-items-center" style={{ width: "60%" }}>
  <CFormText style={{ alignSelf: "flex-start" }}>Filter Plant</CFormText>
    <Select
      className="basic-single"
      classNamePrefix="select"
      isClearable
      options={plantOptions} // plantOptions termasuk "All"
      value={selectedPlant} // Menetapkan state sebagai value yang dipilih
      id="plant"
      onChange={handlePlantChange}
      styles={{
        container: (provided) => ({
          ...provided,
          width: "100%", // Memanfaatkan penuh lebar kolom
        }),
      }}
    />
  </div>
</CCol>



  {/* Kolom kedua */}
  <CCol sm={5}>
    <CFormText>Filter by Date</CFormText>
    <Select
      onChange={handleFilterSchedule}
      placeholder="All"
      isClearable
      styles={colorStyles}
      options={[
        { label: "On Schedule", value: "On Schedule" },
        { label: "Delayed", value: "Delayed" },
      ]}
    />
  </CCol>
</CCol>

  {/* Elemen Header dan Date Picker di pojok kanan */}
  <CCol md={6} className="d-flex justify-content-end gap-3">
    <div>
          <CFormText>Search vendor</CFormText>
         <Select options={optionsSelectVendor} isClearable placeholder='Vendor code or name' />
     </div>
    <div
      className="flatpickr-wrapper"
      style={{ position: "relative", width: "50%" }} // Atur ukuran date picker sesuai kebutuhan
    >
         <CFormText>Filter by Date</CFormText>
         <DateRangePicker showOneCalendar placeholder='All time' position='start' />
    </div>
  </CCol>
</CRow>

     <hr className="m-1" />
      <CRow>
        <CCol xs={12} sm={7} md={7} xl={7} >
        <label className="fs-5 fw-bold text-center d-block">ARRIVAL MONITORING</label>
        <CCard  style={{ backgroundColor: "white",border: "1px solid #BCCCDC"}} className="p-1">
        <CRow className="justify-content-center gap-0">
        <CCol  xs={6} sm={3} md={3} xl={3}>
        <CCard 
         className="mb-2 mt-1 bg-transparent" 
         style={{ border: "1px solid #3D3D3D" }}
        >
          <CCardHeader
          className="text-muted small text-center"
          style={{ backgroundColor: "#F64242" }}>
          <h6 style={{ color: "black", fontSize: "11px" }}>DELAYED</h6>
          </CCardHeader>
          <CCardBody className="text-center ">
         <CCardText className="fs-3 fw-bold" style={{ color: "black" }}>46</CCardText>
       </CCardBody>
     </CCard>
     </CCol>

     <CCol  xs={6} sm={3} md={3} xl={3}>
     <CCard 
         className="mb-2 mt-1 bg-transparent" 
         style={{ border: "1px solid #3D3D3D" }}
        >
        <CCardHeader
         className="text-muted small text-center"
         style={{ backgroundColor: "#35A535" }}
         >
         <h6 style={{ color: "black", fontSize: "11px" }}>ON SCHEDULE</h6>
         </CCardHeader>
         <CCardBody className="text-center">
        <CCardText className="fs-3 fw-bold" style={{ color: "black" }}>25</CCardText>
      </CCardBody>
    </CCard>
  </CCol>

  <CCol  xs={6} sm={3} md={3} xl={3}>
    <CCard 
         className="mb-2 mt-1 bg-transparent" 
         style={{ border: "1px solid #3D3D3D" }}
        >
      <CCardHeader
        className="text-muted small text-center"
        style={{ backgroundColor: "gray" }}>
         <h6 style={{ color: "black", fontSize: "11px" }}>REMAINING</h6>
        </CCardHeader>
          <CCardBody className="text-center">
           <CCardText className="fs-3 fw-bold" style={{ color: "black" }}>46</CCardText>
         </CCardBody>
        </CCard>    
      </CCol>
      <CCol  xs={6} sm={3} md={3} xl={3}>
      <CCard 
         className="mb-2 mt-1 bg-transparent" 
         style={{ border: "1px solid #3D3D3D" }}
        >
      <CCardHeader
        className="text-muted small text-center"
        style={{ backgroundColor: "white" }}
      >
        <h6 style={{ color: "black", fontSize: "10px" }}>TOTAL</h6>
      </CCardHeader>
        <CCardBody className="text-center">
          <CCardText className="fs-3 fw-bold"style={{ color: "black" }}>46</CCardText>
        </CCardBody>
       </CCard>
      </CCol>
     </CRow>
      <hr className="m-0" />
        <CRow>
        <Bar 
        options={getChartOption()} 
        data={setChartData()} 
        height={200} // Tinggi chart
       />
      </CRow>
      </CCard>
     </CCol>
     {/* //untuk tabel */}

   <CCol sm={5} >
    <label className="fs-5 fw-bold text-center d-block">TABLE RECEIVING MATERIAL</label>
    <CCard  style={{ backgroundColor: "white",border: "1px solid #BCCCDC"}} className="p-1">
      {/* Informasi Header */}
      <CRow className="mb-1">
        <CCol sm={12}>
          <div><strong>Supplier:</strong> Supplier Name</div>
        </CCol>
        <CRow>
        <CCol sm={6}>
          <div><strong>Day:</strong> Monday</div>
        </CCol>
        <CCol sm={6}>
          <div><strong>Schedule Plan:</strong> 10:00 AM</div>
        </CCol>
        </CRow>
        <CRow>
        <CCol sm={6}>
          <div><strong>Arrival:</strong> 9:45 AM</div>
        </CCol>
        <CCol sm={6}>
          <div><strong>Status:</strong>Delay</div>
        </CCol>
        </CRow>
        </CRow>
     <CTable style={{fontSize:'10px'}} bordered>
       <CTableHead color='light'>
         <CTableRow>
          <CTableHeaderCell>Material Description</CTableHeaderCell>
          <CTableHeaderCell>Rack Address</CTableHeaderCell>
          <CTableHeaderCell>Plan Qty</CTableHeaderCell>
          <CTableHeaderCell>Act Qty</CTableHeaderCell>
          <CTableHeaderCell>Diff</CTableHeaderCell>
           <CTableHeaderCell>Date</CTableHeaderCell>
          </CTableRow>
            </CTableHead>
             <CTableBody>
              {currentItems.map((data, index) => (
              <CTableRow key={index}>
               <CTableDataCell>{data.material_desc}</CTableDataCell>
                <CTableDataCell>{data.rack_address}</CTableDataCell>
                  <CTableDataCell>{data.req_qty}</CTableDataCell>
                   <CTableDataCell>{data.actual_qty}</CTableDataCell>
                    <CTableDataCell>{data.difference || "-"}</CTableDataCell>
                    <CTableDataCell>{data.date}</CTableDataCell>
                    </CTableRow>
                  ))}
                  {currentItems.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan={6} className="text-center">
                        No data available
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
       </CCard>
        </CRow>
        {isVisible && (
        <CRow className='mb-3'>
          <CCard className='px-0' style={{ maxHeight: `${showCard.schedule ? "2000px" : "50px"}`, overflow: "hidden", transitionDuration: '500ms'}}>
            <CCardHeader style={{ position: "relative", cursor: "pointer"}} onClick={()=>setShowCard({ ...showCard, schedule: !showCard.schedule})}>
                <CCardTitle className='text-center'>VENDOR ARRIVAL SCHEDULE </CCardTitle>
                </CCardHeader>
            <CCardBody style={{overflow: 'auto'}}>
              <CRow className='py-3'>
                <CCol className='d-flex gap-2' xxl={7} md={8}>
                <h5><CBadge color="primary">ARRIVAL PLAN</CBadge> </h5>
                <h5><CBadge color="danger">ARRIVAL DELAYED</CBadge></h5>
                <h5><CBadge color="success">ARRIVAL ON SCHEDULE</CBadge></h5>
                </CCol>
                <CCol className='d-flex gap-2 align-items-center justify-content-end'xxl={5} md={4}>
                </CCol>
              </CRow>
              <CRow className='p-3'>
                <CCard>
                  <Bar
                    options={getChartOption()}
                    data={setChartData()}
                  />
                </CCard>
                <div className="mt-3 d-flex justify-content-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      dataReceiving.length > 0
                        ? dataReceiving.length / itemsPerPage
                        : dataReceiving.length / itemsPerPage,
                    )}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
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
                        <CTableHeaderCell colSpan={3}>Schedule Time Plan</CTableHeaderCell>
                        <CTableHeaderCell colSpan={3}>Arrival Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Status</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Delay Time</CTableHeaderCell>
                        <CTableHeaderCell rowSpan={2}>Log</CTableHeaderCell>
                      </CTableRow>
                      <CTableRow align='middle' className='text-center'>
                        <CTableHeaderCell>Date</CTableHeaderCell>
                        <CTableHeaderCell >Arrival</CTableHeaderCell>
                        <CTableHeaderCell >Derpature</CTableHeaderCell>
                        <CTableHeaderCell>Date</CTableHeaderCell>
                        <CTableHeaderCell >Arrival</CTableHeaderCell>
                        <CTableHeaderCell >Derpature</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        { currentItems.map((data, index)=> {
                          const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                          return(
                            <CTableRow key={index}>
                              <CTableDataCell>{index+1}</CTableDataCell>
                              <CTableDataCell>{data?.materials?.dn_no}</CTableDataCell>
                              <CTableDataCell>{data.vendor_id}</CTableDataCell>
                              <CTableDataCell>{data.vendor_name}</CTableDataCell>
                              <CTableDataCell>{daysOfWeek[data.day]}</CTableDataCell>
                              <CTableDataCell>{data.date}</CTableDataCell>
                              <CTableDataCell>{data.schedule_from}</CTableDataCell>
                              <CTableDataCell>{data.schedule_to}</CTableDataCell>
                              <CTableDataCell>{data.date}</CTableDataCell>
                              <CTableDataCell>{data.schedule_from}</CTableDataCell>
                              <CTableDataCell>{data.arrival_time}</CTableDataCell>
                              <CTableDataCell className='text-center'>
                                <div className={`py-1 px-2 ${data.status.toLowerCase() === 'delayed' && "blink"}`} style={{ backgroundColor: data.status === "Delayed" ? "#F64242" : data.status === "On Schedule" ? "#35A535" : "transparent", color: 'white', borderRadius: '5px'}}>
                                  {data.status.toUpperCase()}  
                                  </div>
                                </CTableDataCell>
                              <CTableDataCell style={{ color: data.status === "Delayed" ? "#F64242" : ""}}> {data.delay_time !== 0 ? `- ${data.delay_time}` : ""}</CTableDataCell>
                              <CTableDataCell className='text-center'>
                                  <CButton onClick={()=>handleClickDetail(data)} color='info' style={{ color: "white", padding: "5px 5px 0 5px"}}>
                                    <CIcon size='lg' icon={icon.cilClone}/>
                                  </CButton> 
                              </CTableDataCell>
                            </CTableRow>
                          )
                        })}
                        { currentItems.length === 0 && (
                          <CTableRow>
                            <CTableDataCell colSpan={20} style={{ opacity: "50%"}}>
                              <div className='d-flex flex-column align-items-center justify-content-center py-4'>
                                <CIcon icon={icon.cilTruck} size='4xl'/>
                                <span>Data not found</span>
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        )}
                    </CTableBody>
                  </CTable>
                  <div className="mt-3 d-flex justify-content-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      dataDummies.length > 0
                        ? dataDummies.length / itemsPerPage
                        : dataDummies.length / itemsPerPage,
                    )}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>
       )}
      </CContainer>
  )
}

export default Dashboard
