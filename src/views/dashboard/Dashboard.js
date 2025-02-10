import React, { useState, useEffect,useRef } from 'react'
import { dataSchedulesDummy, dataReceivingDummy,dataDummy } from '../../utils/DummyData'
import  colorStyles from '../../utils/StyleReactSelect'
import '../../scss/_tabels.scss'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.css'
import Pagination from '../../components/Pagination'
import { DatePicker, DateRangePicker } from 'rsuite';
import 'primeicons/primeicons.css'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import 'primereact/resources/themes/nano/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'; // Icon bawaan PrimeReact
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import useReceivingDataService from '../../services/ReceivingDataServices'
import { cilChart,cilCog} from '@coreui/icons';
import { FaArrowUpRightFromSquare, FaCircleCheck, FaCircleExclamation, FaCircleXmark } from 'react-icons/fa6';
import {
  CAvatar,
  CModal ,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CButtonGroup,
  CPagination,
  CPaginationItem,
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
  const apiPlant = 'plant-public'
  const { getCardStatusArrival,getChartReceiving } = useDashboardReceivingService()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const [currentItems, setCurrentItems] = useState([]); // State untuk opsi vendor
  // const currentItems = dataSchedules?.length > 0 ? dataSchedules?.slice(indexOfFirstItem, indexOfLastItem) : []
  const [optionsSelectVendor, setOptionsSelectVendor] = useState([]); // State untuk opsi vendor
  const [plant, setPlant] = useState([])
  const [visiblePages, setVisiblePages] = useState([])
  const [plants, setPlants] = useState([]); // Plants fetched from API
  const [selectedPlant, setSelectedPlant] = useState({ value: 'all', label: 'All' });
  const [selectedStatus, setSelectedStatus] = useState({ label: "Delayed", value: "delayed" });
  const [dataSchedules, setDataSchedules] = useState([]); // Menyimpan data dari API
  const [isVisible, setIsVisible] = useState(true); // State to control visibility
  const [ dataDNInquery, setDataDNInquery ] = useState([])
   const [totalPages, setTotalPages] = useState(1);
   const [isFilterVisible, setIsFilterVisible] = useState(false);
   const vendorScheduleRef = useRef(null);
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


 
  const fetchPlants = async () => {
    try {
      const response = await getMasterData(apiPlant);
      console.log("API Response:", response); // Log seluruh response
      if (response && response.data) {
        
        const plantOptions = response.data.map((plant) => ({
          value: plant.id,
          label: plant.plantName,
        }));
        setPlants(plantOptions);
      }
    } catch (error) {
      console.error("Error fetching plants:", error);
    }
  };

  // Call fetchPlants on component mount
  useEffect(() => {
    fetchPlants();
  }, []);
  console.log("dataDNInquery",dataDNInquery);




  const getDNInquery = async (plantId, startDate, endDate) => {
    try {
      console.log("Fetching DN Inquiry for Plant ID:", plantId || "All Plants");
      
      const response = await getDNInqueryData(plantId, startDate, endDate);
      
      console.log("Response DN:", response.data.data);
      setDataDNInquery(response.data.data);
    } catch (error) {
      console.error("Error fetching DN Inquiry:", error);
    }
  };
  
  
  useEffect(() => {
    getDNInquery(queryFilter.plantId, queryFilter.rangeDate[0], queryFilter.rangeDate[1]);
  }, [queryFilter.plantId, queryFilter.rangeDate]);
 


  const GetDataArrivalDashboard = async (plantId) => {
    try {
      console.log("Fetching Arrival Data for Plant ID:", plantId || "All Plants");
  
      const response = await getCardStatusArrival(
        plantId || "", // Jika "All" dipilih, kirim string kosong
        "",
        "",
        queryFilter.rangeDate[0].toISOString().split('T')[0], // Format YYYY-MM-DD
        queryFilter.rangeDate[1].toISOString().split('T')[0]  // Format YYYY-MM-DD
      );
  
      if (response && response.data) {
        console.log("Cek Arrival Data:", response.data.data);
        setCardData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching arrival monitoring data:", error);
    }
  };
  
    useEffect(() => {
    GetDataArrivalDashboard();
  }, []);

  useEffect(() => {
    const maxVisiblePages = 6 // Max number of pages to show
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)

    // Adjust if there are not enough pages before or after
    if (currentPage - startPage < halfVisible) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    if (endPage - currentPage < halfVisible) {
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    }

    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    setVisiblePages(pages)
  }, [currentPage, totalPages])

  const fetchChartReceivingData = async (status, page) => {
    try {
      const response = await getChartReceiving(
        queryFilter.plantId, 
        status, 
        "", 
        queryFilter.rangeDate[0]?.toISOString().split("T")[0], 
        queryFilter.rangeDate[1]?.toISOString().split("T")[0],
        page, // Make sure page is passed correctly
        // itemsPerPage // Also pass itemsPerPage to ensure the correct number of items per page
      );
  
      if (response && response.data) {
        console.log("Data Chart Receiving:", response.data);
        setDataSchedules(response.data); // Store the data in the state
        // setTotalPages(response.totalPages); // Update total pages for pagination
        // setCurrentPage(response.currentPage); // Update the current page
        // setCurrentItems(response.data.map(item => ({
        //   vendor_id: item.supplierCode,
        //   vendor_name: item.supplierName,
        //   day: item.rit,
        //   schedule_from: item.arrivalPlanTime,
        //   arrival_time: item.arrivalActualTime,
        //   status: item.status,
        //   materials: item.Materials,
        // })));
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };
  
  useEffect(() => {
    console.log("Fetching chart data for page:", currentPage, "and status:", selectedStatus.value);
    fetchChartReceivingData(selectedStatus.value, currentPage); // Fetch chart data when page or filter changes
  }, [queryFilter.plantId, queryFilter.rangeDate, selectedStatus.value, currentPage]);
  

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
  console.log("Chart Data fetch:", dataSchedules);
  console.log("Current Page:", currentPage, "Items Per Page:", itemsPerPage, "First Index:", indexOfFirstItem, "Last Index:", indexOfLastItem);

  const currentItemDashboard = dataSchedules.slice(indexOfFirstItem, indexOfLastItem);
  console.log("Current Dashboard Data:", currentItemDashboard); // Ensure data is sliced correctly

  // Panggil hook `useChartData` dengan `currentItems`
  const { setChartData, getChartOption, selectedVendor } = useChartData({ currentItemDashboard });

  

  const [ showCard, setShowCard ] = useState({

    schedule: true,
    receiving: true
  })

  const plantOptions = [
    { value: 'all', label: 'All' }, // Menambahkan opsi "All" di awal
    ...plant.map((plant) => ({
      value: plant.id,
      label: plant.plantName,
    })),
  ]

  const handlePlantChange = (selectedPlant) => {
    setSelectedPlant(selectedPlant);
  
    const plantId = selectedPlant.value !== 'all' ? selectedPlant.value : "";
  
    setQueryFilter((prevFilter) => ({
      ...prevFilter,
      plantId: plantId, // Simpan plantId yang dipilih
    }));
  
    // Panggil API untuk update data
    GetDataArrivalDashboard(plantId);
  };
  
  
 
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
      <div className='text-center' 
      style={{ backgroundColor: bgColor, 
        padding: "5px 10px",
         color: "white",
         borderRadius: "8px", 
        textTransform: "uppercase"}}>
        {status}
      </div>
    )
  }
   const materialsBodyTemplate = (rowBody) => {
      return(
        <div className='d-flex align-items-center justify-content-center'>
         <CButton onClick={() => handleClickOpenMaterials(rowBody)} color='info' className='d-flex justify-content-center align-items-center p-2 '>
           <FaArrowUpRightFromSquare style={{ color: "white" }} size={13} />
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

        const handlePageChange = (pageNumber) => {
          setCurrentPage(pageNumber); // Update current page
          fetchChartReceivingData(selectedStatus.value, pageNumber); // Fetch data for the selected page
        };
        

        const selectStyles = {
          placeholder: (base) => ({
            ...base,
            color: "red", // Warna merah untuk placeholder
            fontWeight: "bold",
          }),
          singleValue: (base, state) => ({
            ...base,
            color: state.data.value === "delayed" ? "red" : "green", // Warna sesuai status
            fontWeight: "bold",
          }),
        };
        const handleScrollToVendorSchedule = () => {
          if (vendorScheduleRef.current) {
            vendorScheduleRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        };

        const toggleFilterVisibility = () => {
          setIsFilterVisible(!isFilterVisible);
        };
        

      
  return (
  <CContainer fluid>
    <CRow className='mt-1'>
    <CCard
         className="px-0 bg-white text-black mb-1"
          style={{
          overflow: "hidden",
          transitionDuration: "500ms",
          border: "1px solid #6482AD", // Menambahkan border dengan warna #074799
        }}>
         <CCardHeader
          style={{
            zIndex: 4,
            backgroundColor: "#6482AD",
            color: "white",
            padding: "10px",
           
          }}
           >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <CTooltip content="Scroll to Vendor Schedule">
        <button
          className="btn d-flex align-items-center justify-content-center me-2"
          style={{
            backgroundColor: "#B0B0B0",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
          }}
          onClick={handleScrollToVendorSchedule}
        >
          <CIcon icon={cilChart} size="lg" style={{ color: "#27445D" }} />
        </button>
      </CTooltip>

      <CTooltip content="Toggle Filter Visibility">
        <button
          className="btn d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "#B0B0B0",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
          }}
          onClick={toggleFilterVisibility}
        >
          <CIcon icon={cilCog} size="sm" style={{ color: "#27445D" }} />
        </button>
      </CTooltip>
            
              <CCardTitle className="text-center fs-4" style={{ flexGrow: 1 }}>
                MONITORING RECEIVING WAREHOUSE
              </CCardTitle>
            </div>
          </CCardHeader>
            <CCardBody style={{overflow: 'auto'}}>
              <CRow className="d-flex justify-content-between align-items-center mb-2">
            {/* Tombol Hide/Show di pojok kiri */}

            {isFilterVisible && (
          <div className="d-flex flex-wrap gap-2 mt-1">
            <CCol sm={12} md={12} lg={5} xl={5}
             className="d-flex justify-content-center-start gap-1">
            <div className="d-flex flex-column align-items-center">
            <CFormText style={{ alignSelf: "flex-start" }}>Filter Plant</CFormText>
            <Select
            className="basic-single"
            classNamePrefix="select"
            id="plant"
            options={[{ value: 'all', label: 'All' }, ...plants]} // Tambahkan opsi "All"
            value={selectedPlant}
            onChange={handlePlantChange}
            styles={{
              control: (base) => ({
                ...base,
                width: '250px', // Atur lebar lebih kecil agar lebih proporsional
                minWidth: '200px',
                maxWidth: '100%',
                borderRadius: '5px',
                padding: '2px',
                zIndex: 3, // Memberikan prioritas tinggi agar dropdown muncul di atas elemen lain
                position: 'relative'
              }),
              menu: (base) => ({
                ...base,
                zIndex: 3, // Pastikan menu dropdown tidak tertutup elemen lain
              })
            }}
             />
             </div>
                 <div className="d-flex flex-column align-items-center">
              <CFormText style={{ alignSelf: "flex-start" }}>Filter by Status</CFormText>
                      <Select
                        onChange={handleFilterSchedule}
                        placeholder="Delayed" // Default placeholder
                        isClearable
                        styles={ selectStyles}
                        value={selectedStatus} // Default ke "Delayed"
                        options={[
                          { label: "On Schedule", value: "on schedule" },
                          { label: "Delayed", value: "delayed" },
                         
                        ]}
                         />
            </div>
          </CCol>
          {/* Kolom kedua */}
           <CCol sm={12} md={12} lg={7} xl={6}
           className="d-flex justify-content-end gap-2" // Elemen berada di pojok kanan dengan jarak antar elemen
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
             style={{ position: "relative", width: "240px" }} // Sesuaikan ukuran DatePicker
           >
             <CFormText style={{ alignSelf: "flex-start" }}>Filter by Date</CFormText>
             <DateRangePicker showOneCalendar placeholder='All time' position='start' value={queryFilter.rangeDate} />
           </div>
         </CCol>
         </div>
             
            )}
         </CRow>
              <CRow >
              <div className="card">
              <DataTable
  removableSort
  globalFilterFields={['deliveryNotes.dnNumber', 'deliveryNotes.supplierName', 'deliveryNotes.truckStation']}
  filters={queryFilter}
  showGridlines 
  size="small"
  paginator
  rows={15}
  rowsPerPageOptions={[15, 25, 50, 100]}
  tableStyle={{ minWidth: '50rem' }}
  value={dataDNInquery}
  filterDisplay="row"
   className="custom-table"
>
                    <Column className='' header="No" body={(rowBody, {rowIndex})=>rowIndex+1}></Column>
                    <Column className='' field='deliveryNotes.dnNumber'  header="DN No"></Column>
                    <Column className='' field='deliveryNotes.supplierName'  header="Vendor Name" ></Column>
                    <Column className='' field='deliveryNotes.truckStation'  header="Truck Station" ></Column>
                    <Column className='' field='deliveryNotes.rit'  header="Rit" ></Column>
                    <Column className='' field='deliveryNotes.arrivalPlanDate'  header="Plan Date" ></Column>
                    <Column className='' field='deliveryNotes.arrivalPlanTime'  header="Plan Time" body={plantTimeBodyTemplate} ></Column>
                    <Column className='' field='deliveryNotes.arrivalActualDate'  header="Arriv. Date" ></Column>
                    <Column className='' field='deliveryNotes.arrivalActualTime'  header="Arriv. Time" ></Column>
                    {/* <Column className='' field='deliveryNotes.departureActualDate'  header="Departure Date" /> */}
                    <Column className='' field='deliveryNotes.departureActualTime'  header="Dept. Time" ></Column>
                    <Column className='' field='deliveryNotes.status'  header="Status" body={statusVendorBodyTemplate} ></Column>
                    <Column className='' field=''  header="Materials" body={materialsBodyTemplate} ></Column>
                
                  </DataTable>
                 </div>
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
        <CRow className='mb-3 mt-5'>
          <CCard ref={vendorScheduleRef} className='px-0 ' style={{ maxHeight: `${showCard.schedule ? "2000px" : "50px"}`, overflow: "hidden", transitionDuration: '500ms'}}>
            <CCardHeader style={{ position: "relative", cursor: "pointer"}} onClick={()=>setShowCard({ ...showCard, schedule: !showCard.schedule})}>
                <CCardTitle className='text-center'> DETAIL VENDOR ARRIVAL SCHEDULE </CCardTitle>
                </CCardHeader>
                <CCardBody style={{ overflow: "auto"  }}>
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
               <CCol className="d-flex justify-content-center sticky-pagination">
                  <CPagination aria-label="Page navigation example">
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </CPaginationItem>

                    {visiblePages.map((page) => (
                      <CPaginationItem
                        key={page}
                        active={currentPage === page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </CPaginationItem>
                    ))}

                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </CCol>
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
