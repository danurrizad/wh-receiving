import React, { useState, useEffect,useRef } from 'react'
import { dataSchedulesDummy, dataReceivingDummy,dataDummy } from '../../utils/DummyData'
import  colorStyles from '../../utils/StyleReactSelect'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'
import Pagination from '../../components/Pagination'
import { DatePicker, DateRangePicker } from 'rsuite';
import 'primeicons/primeicons.css'
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import 'primereact/resources/themes/nano/theme.css'
import 'primereact/resources/primereact.min.css'
import { DataTable } from 'primereact/datatable';
import 'primeicons/primeicons.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import useReceivingDataService from '../../services/ReceivingDataServices'
import { FaArrowUpRightFromSquare, FaCircleCheck, FaCircleExclamation, FaCircleXmark } from 'react-icons/fa6';
import {
  CAvatar,
  CModal ,
  CModalHeader,
  CModalTitle,
  CModalBody,
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
  CTooltip,
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
import useDashboardReceivingService from '../../services/DashboardService'
import useChartData from '../../services/ChartDataServices'
import useMasterDataService from '../../services/MasterDataService'
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
  const { getMasterData, getMasterDataById } = useMasterDataService()
  const { getDNInqueryData } = useReceivingDataService()
  const { getCardStatusArrival,getChartReceiving } = useDashboardReceivingService()
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const [selectedPlant, setSelectedPlant] = useState({ value: 'all', label: 'All' })
  const [currentItems, setCurrentItems] = useState([]); // State untuk opsi vendor
  const [optionsSelectVendor, setOptionsSelectVendor] = useState([]); // State untuk opsi vendor
  const [plant, setPlant] = useState([])
  const [dataSchedules, setDataSchedules] = useState([]); // Menyimpan data dari API
  const [isVisible, setIsVisible] = useState(true); // State to control visibility
  const [ dataDNInquery, setDataDNInquery ] = useState([])
   const [ showModalInput, setShowModalInput] = useState({
      state: false,
      enableSubmit: false
    })
  const [ formUpdate, setFormUpdate ] = useState({})
  const [cardData, setCardData] = useState({
    delayed: 0,
    onSchedule: 0,
    total: 0,
    remaining: 0,
  });
  const [ dataMaterialsByDNInquery, setDataMaterialsByDNInquery ] = useState([])
  const toggleVisibility = () => setIsVisible(!isVisible); // Toggle function
 
  const [queryFilter, setQueryFilter] = useState({
    plantId: "",
    rangeDate: [new Date('2025-01-01'), new Date('2025-01-30')],
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const [plants] = useState(['Karawang 1', 'Karawang 2', 'Karawang 3', 'Sunter 1', 'Sunter 2']);
  const getPlantId = (plantName) => {
    switch (plantName) {
      case 'Karawang 1':
        return 1
      case 'Karawang 2':
        return 2
      case 'Karawang 3':
        return 3
      case 'Sunter 1':
        return 4
      case 'Sunter 2':
        return 5
      case '': 
        return ""
      
    }
  }

  const getDNInquery = async(plantId, startDate, endDate) => {
    try {
      // const dateFormat = date.toISOString().split('T')[0]
      const idPlant = getPlantId(plantId)
      const response = await getDNInqueryData(idPlant, startDate, endDate) 
      console.log("response :", response.data.data)
      setDataDNInquery(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(()=>{
    getDNInquery(queryFilter.plantId, queryFilter.rangeDate[0], queryFilter.rangeDate[1])
  }, [queryFilter.plantId, queryFilter.rangeDate])
 


    const GetDataArrivalDashboard = async () => {
      try {
        const response = await getCardStatusArrival("", "", "", "2025-01-01", "2025-01-16");
        if (response && response.data) {
          console.log("cek Arrival",response.data.data);
          setCardData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching arrival monitoring data:", error);
      }
    };
    useEffect(() => {
    GetDataArrivalDashboard();
  }, []);

  const fetchChartReceivingData = async () => {
    try {
      const response = await getChartReceiving(
        queryFilter.plantId, 
        "", // status kosong
        "", // vendor kosong
        queryFilter.rangeDate[0]?.toISOString().split("T")[0], 
        queryFilter.rangeDate[1]?.toISOString().split("T")[0]
      );
  
      if (response && response.data) {
        console.log("Data Chart Receiving:", response.data);
        setDataSchedules(response.data); // Simpan data dari API ke state
  
        // Store the data in currentItems based on the API model
        const items = response.data.map((item) => ({
          vendor_id: item.supplierCode,
          vendor_name: item.supplierName,
          day: item.rit,  // Assuming "rit" corresponds to day (You can adjust this based on actual data)
          schedule_from: item.arrivalPlanTime,  // Adjusting this to show the schedule
          arrival_time: item.arrivalActualTime, // Arrival time from the API
          status: item.status, // Status of the delivery
          materials: item.Materials,  // Materials data
        }));
        setCurrentItems(items);  // Store it in the currentItems state
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };
  
  useEffect(() => {
    fetchChartReceivingData();
  }, [queryFilter.plantId, queryFilter.rangeDate]);


  const fetchVendors = async () => {
    try {
      const response = await getChartReceiving(
        queryFilter.plantId,
        "",
        "",
        queryFilter.rangeDate[0]?.toISOString().split("T")[0],
        queryFilter.rangeDate[1]?.toISOString().split("T")[0]
      );

      if (response && response.data) {
        console.log("Vendor Data:", response.data);

        // Ubah data menjadi format yang sesuai dengan react-select
        const vendorOptions = response.data.map((vendor) => ({
          label: `${vendor.supplierName}`,
          value: vendor.supplierId,
        }));

        setOptionsSelectVendor(vendorOptions);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [queryFilter.plantId, queryFilter.rangeDate]);

  const currentItemDashboard = dataSchedules.slice(indexOfFirstItem, indexOfLastItem);

  // Panggil hook `useChartData` dengan `currentItems`
  const { setChartData, getChartOption, selectedVendor } = useChartData({ currentItemDashboard });

  

  const [ showCard, setShowCard ] = useState({
    summary: true,
    schedule: true,
    receiving: true
  })

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
 
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const plantTimeBodyTemplate = (rowData) => {
    const timeFrom = rowData.deliveryNotes.arrivalPlanTime
    const timeTo = rowData.deliveryNotes.departurePlanTime
    return(
      <div>
        {timeFrom} - {timeTo}
      </div>
    )
  }

  const remainBodyTemplate = (rowBody, {rowIndex}) => {
    const colorText = formUpdate.remains[rowIndex] < 0 ? "red" : "black" 
    return(
      <p style={{color: colorText}}>
        {formUpdate.remains[rowIndex]}
      </p>
    )
  }

  const handleClickOpenMaterials = (data) => {
    setShowModalInput({...showModalInput, state: true})
    console.log("data vendor:", data.deliveryNotes)
    console.log("data material:", data.deliveryNotes.Materials)

    const dataVendor = data.deliveryNotes
    const dataMaterials = data.deliveryNotes.Materials
    setDataMaterialsByDNInquery(data.deliveryNotes.Materials)

    setFormUpdate({
      dnNumber: dataVendor.dnNumber,
      vendorName: dataVendor.supplierName,
      rit: dataVendor.rit,
      incomingIds: dataMaterials.map((data)=>data.incomingId),
      receivedQuantities: dataMaterials.map((data)=>data.receivedQuantity),
      statuses: dataMaterials.map((data)=>data.status),
      remains: dataMaterials.map((data)=>data.remain)
    })
  }
  const statusVendorBodyTemplate = (rowData) => {
    const status = rowData.deliveryNotes.status
    const bgColor = status === 'delayed' ? "#F64242" : status === "on schedule" ? "#35A535" : "transparent"
    return(
      <div className='text-center' style={{ backgroundColor: bgColor, padding: "5px 10px", color: "white" }}>
        {status}
      </div>
    )
  }
   const materialsBodyTemplate = (rowBody) => {
      return(
        <div className='d-flex align-items-center justify-content-center'>
         <CButton onClick={() => handleClickOpenMaterials(rowBody)} color='info' className='d-flex justify-content-center align-items-center p-2 '>
           <FaArrowUpRightFromSquare style={{ color: "white" }} size={9} />
         </CButton>
        </div>
      )
    }

     const statusQtyBodyTemplate = (rowData, rowIndex) => {
          return(
            <div className='d-flex justify-content-center'>
              <CTooltip 
                content={ 
                  rowData.status === "not complete" ? "NOT DELIVERED" : 
                  rowData.status === "partial" ? "NOT COMPLETED" : 
                  rowData.status === "completed" ? "COMPLETED" : 
                  "COMPLETED"
                } 
                placement="top"
                >
                <CButton style={{ border: 0}}>
                  { rowData.status === "not complete" ? <FaCircleXmark style={{ color: "#FF0000", fontSize: "24px"}}/> : 
                    rowData.status === "partial" ? <FaCircleExclamation style={{ color: "#FFD43B", fontSize: "24px"}}/> : 
                    rowData.status === "completed" ? <FaCircleCheck style={{ color: "#00DB42", fontSize: "24px"}}/> : 
                    <FaCircleCheck style={{ color: "#00DB42", fontSize: "24px"}}/>
                  }
                  
                </CButton>
              </CTooltip>
            </div>
          )
        }
        const handleChangeFilterPlant = (e) => {
          if(e.value !== undefined){
            setQueryFilter({ ...queryFilter, plantId: e.target.value})
          } else{
            setQueryFilter({ ...queryFilter, plantId: ""})
          }
        }

      
  return (
  <CContainer fluid>
    <CRow className='mt-4'>
         <CCard
          style={{
            position: "fixed",
            top: 66, // Tetap di bagian atas layar
            zIndex: 1050,
            cursor: "pointer",
            backgroundColor: "#6482AD",
            color: "white",
            padding: "10px",
            width: "calc(100% - 47px)", // Sesuaikan lebar agar sama dengan konten di bawah
            margin: "0 auto", // Posisikan di tengah
          }}
          onClick={() => setShowCard({ ...showCard, summary: !showCard.summary })}
           >
             <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
               <CCardTitle className="text-center fs-4">MONITORING RECEIVING WAREHOUSE</CCardTitle>
             </div>
          </CCard>
       <CCard
         className="px-0 bg-white text-black mb-3"
          style={{
          maxHeight: `${showCard.summary ? "1000px" : "50px"}`,
          overflow: "hidden",
          transitionDuration: "500ms",
          border: "1px solid #6482AD", // Menambahkan border dengan warna #074799
        }}>
             <CCardBody style={{overflow: 'auto'}}>
              <CRow className="d-flex justify-content-between align-items-center mb-2">
            {/* Tombol Hide/Show di pojok kiri */}

            {/* Kolom pertama */}
            <CCol sm={12} md={12} lg={5} xl={4}
             className="d-flex justify-content-center-start gap-3">
              {/* Filter Detail */}
            <div className="d-flex flex-column align-items-center">
              <CFormText style={{ alignSelf: "flex-start" }}>Filter Summary</CFormText>
              <button
                className="btn"
                style={{
                  backgroundColor: "#27445D",
                  color: "#FFF",
                }}
                onClick={toggleVisibility}
                        >
                {isVisible ? "Hide Recap" : "Show Recap"}
              </button>
            </div>
          
            {/* Filter Plant */}
            <div className="d-flex flex-column align-items-center" style={{ width: "60%" }}>
            <CFormText style={{ alignSelf: "flex-start" }}>Filter Plant</CFormText>
             <Dropdown
                                     value={queryFilter.plantId}
                                     options={plants}
                                     onChange={handleChangeFilterPlant}
                                     // onChange={(e)=>console.log(e.target.value)}
                                     placeholder="All plant"
                                     showClear
                                     style={{ width: '100%', borderRadius: '5px', padding: '1.75px' }}
                                   />
            </div>
          </CCol>
          {/* Kolom kedua */}
           <CCol sm={12} md={12} lg={6} xl={6}
           className="d-flex justify-content-end gap-3" // Elemen berada di pojok kanan dengan jarak antar elemen
         >
           <div className="d-flex flex-column align-items-end">
             <CFormText style={{ alignSelf: "flex-start" }}>Search vendor</CFormText>
             <Select 
               options={optionsSelectVendor} 
               isClearable 
               placeholder="Vendor code or name" 
               styles={{
                 container: (provided) => ({
                   ...provided,
                   width: "250px", // Sesuaikan lebar input Select
                   zIndex: 1000, // Z-index untuk elemen container
                 }),
               }}
             />
           </div>
         
           <div 
             className="flatpickr-wrapper d-flex flex-column align-items-end" 
             style={{ position: "relative", width: "250px" }} // Sesuaikan ukuran DatePicker
           >
             <CFormText style={{ alignSelf: "flex-start" }}>Filter by Date</CFormText>
             <DateRangePicker showOneCalendar placeholder='All time' position='start' value={queryFilter.rangeDate} />
           </div>
         </CCol>
         </CRow>
              <CRow >
              <DataTable
                 removableSort
                  className="p-datatable-sm  text-nowrap"
                 globalFilterFields={['deliveryNotes.dnNumber', 'deliveryNotes.supplierName', 'deliveryNotes.truckStation', '']}
                 filters={queryFilter}
                 size='small'
                 scrollable
                 scrollHeight="500px"
                 showGridlines
                 paginator
                 rows={10}
                 rowsPerPageOptions={[10, 25, 50, 100]}
                 value={dataDNInquery}
                 stripedRows
                 tableStyle={{ minWidth: '50rem', borderCollapse: 'separate', borderSpacing: '0 6px' }} // Menambahkan jarak antar baris
                 filterDisplay="row"
               >
                    <Column className='' header="No" body={(rowBody, {rowIndex})=>rowIndex+1}/>
                    <Column className='' field='deliveryNotes.dnNumber'  header="DN No"/>
                    <Column className='' field='deliveryNotes.supplierName'  header="Vendor Name" />
                    <Column className='' field='deliveryNotes.truckStation'  header="Truck Station" />
                    <Column className='' field='deliveryNotes.rit'  header="Rit" />
                    <Column className='' field='deliveryNotes.arrivalPlanDate'  header="Plan Date" />
                    <Column className='' field='deliveryNotes.arrivalPlanTime'  header="Plan Time" body={plantTimeBodyTemplate} />
                    <Column className='' field='deliveryNotes.arrivalActualDate'  header="Arriv. Date" />
                    <Column className='' field='deliveryNotes.arrivalActualTime'  header="Arriv. Time" />
                    {/* <Column className='' field='deliveryNotes.departureActualDate'  header="Departure Date" /> */}
                    <Column className='' field='deliveryNotes.departureActualTime'  header="Dept. Time" />
                    <Column className='' field='deliveryNotes.status'  header="Status" body={statusVendorBodyTemplate} />
                    <Column className='' field=''  header="Materials" body={materialsBodyTemplate} />
                
                  </DataTable>
                 
              </CRow>
               <CModal 
                        visible={showModalInput.state}
                        onClose={() => setShowModalInput({state: false, enableSubmit: false})}
                        size='xl'
                        backdrop="static"
                      >
                        <CModalHeader>
                          <CModalTitle>List Materials Received</CModalTitle>
                        </CModalHeader>
                        <CModalBody> 
                          <CRow>
                            <CCol sm='3'>
                              <CFormText>DN NO</CFormText>  
                              <CFormLabel>{formUpdate.dnNumber}</CFormLabel>
                            </CCol>
                            <CCol>
                              <CFormText>VENDOR NAME</CFormText>  
                              <CFormLabel>{formUpdate.vendorName}</CFormLabel>
                            </CCol>
                          </CRow>
                        <CRow className='pt-1'>
                        <DataTable
                             className="p-datatable-sm custom-datatable text-nowrap"
                             tableStyle={{ minWidth: '50rem' }}
                             removableSort
                             size="small"
                             scrollable
                             scrollHeight="50vh"
                             showGridlines
                             paginator
                             rows={10}
                             value={dataMaterialsByDNInquery}
                             filterDisplay="row"
                           >
                                  <Column header="No" body={(rowBody, {rowIndex})=>rowIndex+1} />
                                  <Column field='materialNo'  header="Material No" />
                                  <Column field='description'  header="Material Description" />
                                  <Column field='address'  header="Rack Address" />
                                  <Column field="reqQuantity" header="Req. Qty" body={(data) => <div className="text-center">{data.reqQuantity}</div>} />
                                  <Column field="receivedQuantity" header="Act. Qty" body={(data) => <div className="text-center">{data.receivedQuantity}</div>} />
                                  <Column field="remain" header="Remain" body={remainBodyTemplate} align="center" />
                                  <Column field='status'  header="Status" body={statusQtyBodyTemplate} />
                              
                                </DataTable>
                        </CRow>
                        <CRow className='mt-1 px-2'>
                        </CRow>
                        </CModalBody>
                        
                      </CModal>
            </CCardBody>   
       </CCard>
        </CRow>
        {isVisible && (
        <CRow className='mb-3'>
          <CCard className='px-0' style={{ maxHeight: `${showCard.schedule ? "2000px" : "50px"}`, overflow: "hidden", transitionDuration: '500ms'}}>
            <CCardHeader style={{ position: "relative", cursor: "pointer"}} onClick={()=>setShowCard({ ...showCard, schedule: !showCard.schedule})}>
                <CCardTitle className='text-center'> DETAIL VENDOR ARRIVAL SCHEDULE </CCardTitle>
                </CCardHeader>
                <CCardBody className="mt-1" style={{ overflow: "auto"  }}>
                 <CRow className="d-flex justify-content-between align-items-center">
                     <CCol 
                       md={6} 
                       className="d-flex justify-content-start gap-2" >
                       <div className="d-flex flex-column align-items-start">
                         <CFormText style={{ alignSelf: "flex-start" }}>Search vendor</CFormText>
                         <Select 
                           options={optionsSelectVendor} 
                           isClearable 
                           placeholder="Vendor code or name" 
                           styles={{
                             container: (provided) => ({
                               ...provided,
                               width: "250px", }),
                            }}
                         />
                       </div>
                      </CCol>
                    <CCol sm={3}>
                      <CFormText>Filter by Status</CFormText>
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
                  
                      </CRow>
                      <hr className="m-1" />
                       <CRow>
                         <CCol xs={12} sm={7} md={7} xl={7} >
                         <label className="fs-6 fw-bold text-center d-block mt-1">ARRIVAL MONITORING</label>
                          <CCard  style={{ backgroundColor: "white",border: "1px solid #BCCCDC"}} className="p-1">
             
                          <CRow className="justify-content-center gap-0">
                           <CCol  xs={6} sm={3} md={3} xl={3}>
                             <CCard 
                              className="mb-2 mt-1 bg-transparent" 
                              style={{ border: "1px solid #3D3D3D" }}
                             >
                                <CCardHeader
                                className="text-muted small text-center"
                                 style={{ backgroundColor: "#C62300" }}>
                                <h6 style={{ color: "white", fontSize: "12px" }}>DELAYED</h6>
                                </CCardHeader>
                                 <CCardBody className="text-center ">
                                 <CCardText className="fs-3 fw-bold" style={{ color: "black" }}> 
                                  {cardData.delayed}</CCardText>
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
                                style={{ backgroundColor: "#5CB338" }}
                                >
                                <h6 style={{ color: "white", fontSize: "12px" }}>ON SCHEDULE</h6>
                                </CCardHeader>
                                <CCardBody className="text-center">
                               <CCardText className="fs-3 fw-bold" style={{ color: "black" }}>
                                 {cardData.onSchedule}</CCardText>
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
                 style={{ backgroundColor: "#EB5B00" }}>
                  <h6 style={{ color: "white", fontSize: "12px" }}>REMAINING</h6>
                 </CCardHeader>
                   <CCardBody className="text-center">
                    <CCardText className="fs-3 fw-bold" style={{ color: "black" }}>{cardData.remaining}</CCardText>
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
                 style={{ backgroundColor: "black" }}
               >
                 <h6 style={{ color: "white", fontSize: "12px" }}>TOTAL</h6>
               </CCardHeader>
                 <CCardBody className="text-center">
                   <CCardText className="fs-3 fw-bold"style={{ color: "black" }}>{cardData.total}</CCardText>
                 </CCardBody>
                </CCard>
               </CCol>
              </CRow>
              </CCard>
             <CCard className='mt-2'>
             <CRow>
                <CCol className='d-flex gap-2' xxl={7} md={8}>
                <h7><CBadge color="warning">ARRIVAL PLAN</CBadge> </h7>
                <h7><CBadge color="success">ARRIVAL ON SCHEDULE</CBadge></h7>
                <h7><CBadge color="danger">ARRIVAL DELAYED</CBadge></h7>
                </CCol>
                </CRow>
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

              <CCol sm={5}>
  <label className="fs-6 fw-bold text-center d-block mt-1">TABLE RECEIVING MATERIAL</label>
  <CCard style={{ backgroundColor: "white", border: "1px solid #BCCCDC" }} className="p-1">
    {selectedVendor ? (
      currentItems
        .filter((data) => data.vendor_name === selectedVendor)
        .map((data, index) => (
          <div key={index}>
            <CRow className="mb-1">
              <CCol sm={12}>
                <div><strong>Supplier:</strong> {data.vendor_id}</div>
              </CCol>
              <CRow>
                <CCol sm={6}>
                  <div><strong>Day:</strong> {daysOfWeek[data.day]}</div>
                </CCol>
                <CCol sm={6}>
                  <div><strong>Schedule Plan:</strong> {data.schedule_from}</div>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm={6}>
                  <div><strong>Arrival:</strong> {data.arrival_time}</div>
                </CCol>
                <CCol sm={6}>
                  <div><strong>Status:</strong> {data.status}</div>
                </CCol>
              </CRow>
            </CRow>

            <CTable style={{ fontSize: '10px' }} bordered>
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
                {data.materials.map((material, materialIndex) => (
                  <CTableRow key={materialIndex}>
                    <CTableDataCell>{material.description}</CTableDataCell>
                    <CTableDataCell>{material.address}</CTableDataCell>
                    <CTableDataCell>{material.reqQuantity}</CTableDataCell>
                    <CTableDataCell>{material.receivedQuantity}</CTableDataCell>
                    <CTableDataCell>{material.remain}</CTableDataCell>
                    <CTableDataCell>{data.arrivalActualDate}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
        ))
    ) : (
      <div className="text-center p-3">
        <strong>SILAHKAN PILIH VENDOR. VENDOR BELUM DIPILIH</strong>
      </div>
    )}
  </CCard>
</CCol>

        </CRow>
      </CCardBody>
          </CCard>
        </CRow>
        
       )}
       
      </CContainer>
  )
}

export default Dashboard
