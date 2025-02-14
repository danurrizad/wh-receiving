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
import { FaAnglesLeft, FaAnglesRight, FaArrowUpRightFromSquare, FaChevronLeft, FaChevronRight, FaCircleCheck, FaCircleExclamation, FaCircleXmark } from 'react-icons/fa6';
import {
  CAvatar,
  CModal ,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CButton,
  CButtonGroup,
  CPaginationItem,
  CPagination,
  CImage ,
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
import Mapfoto from 'src/assets/images/map-plant-1.png'
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
import { useToast } from '../../App'


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const buttonPositions = {
    "TS 1-02": { top: "45%", left: "40%", color: "#074799" },
    "TS 1-01": { top: "27%", left: "15%", color: "#5bc0de" },
    "TS 1-06": { top: "35%", left: "50%", color: "#f0ad4e" },
    "TS 1-07": { top: "35%", left: "50%", color: "#d9534f" },
    "TS 1-14": { top: "20%", left: "60%", color: "#5bc0de" },
    "TS 1-12": { top: "20%", left: "30%", color: "#f0ad4e" },
    "OIL STORE": { top: "8%", left: "12%", color: "#d9534f" },
    "GAS STORAGE": { top: "18%", left: "48%", color: "#f0ad4e" },
    "TS - PACKING": { top: "8%", left: "25%", color: "#5bc0de" },
  };
  
  


const Dashboard = () => {
  const addToast = useToast()
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
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [visiblePages, setVisiblePages] = useState([])
  const [plants, setPlants] = useState([]); // Plants fetched from API
  const [selectedPlant, setSelectedPlant] = useState({ value: 'all', label: 'All' });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [dataSchedules, setDataSchedules] = useState([]); // Menyimpan data dari API
  const [isVisible, setIsVisible] = useState(true); // State to control visibility
  const [ dataDNInquery, setDataDNInquery ] = useState([])
   const [totalPages, setTotalPages] = useState(1);
   const [limitPerPage, setLimitPerPage] = useState({name: 10, code: 10})
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
    rangeDate: [
      new Date(new Date().setHours(0, 0, 0, 1)),  // Today at 00:00
      new Date(new Date().setHours(23, 59, 59, 999))  // Today at 23:59
    ],
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })


 
  const fetchPlants = async () => {
    try {
      const response = await getMasterData(apiPlant);
      // console.log("API Response:", response); // Log seluruh response
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
  // console.log("dataDNInquery",dataDNInquery);




  const getDNInquery = async (plantId, startDate, endDate) => {
    try {
      // console.log("Fetching DN Inquiry for Plant ID:", plantId || "All Plants");
      
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
      // console.log("Fetching Arrival Data for Plant ID:", plantId || "All Plants");
  
      const response = await getCardStatusArrival(
        plantId || "", // Jika "All" dipilih, kirim string kosong
        "",
        "",
        queryFilter.rangeDate[0].toISOString().split('T')[0], // Format YYYY-MM-DD
        queryFilter.rangeDate[1].toISOString().split('T')[0]  // Format YYYY-MM-DD
      );
  
      if (response && response.data) {
        // console.log("Cek Arrival Data:", response.data.data);
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
    const maxVisiblePages = 3 // Max number of pages to show
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

  const fetchChartReceivingData = async (status, currentPage, limitPerPage) => {
    try {
      const [fromDate, fromMonth, fromYear] = queryFilter.rangeDate[0].toLocaleDateString('en-GB').split("/").map(Number)
      const [toDate, toMonth, toYear] = queryFilter.rangeDate[1].toLocaleDateString('en-GB').split("/").map(Number)

      const formattedFrom = `${fromYear}-${fromMonth}-${fromDate}`
      const formattedTo = `${toYear}-${toMonth}-${toDate}`

      const response = await getChartReceiving(
        queryFilter.plantId, 
        status !== null ? status?.value : "", // status kosong
        "", // vendor kosong
        formattedFrom, 
        formattedTo,
        currentPage,
        limitPerPage
      );
      console.log("response fetchChartReceiving :", response)
      if (response) {
        // console.log("Data Chart Receiving:", response.data);
        setDataSchedules(response.data); // Simpan data dari API ke state
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);

        // Ubah data menjadi format yang sesuai dengan react-select
        const vendorOptions = response.data.map((vendor) => ({
          label: `${vendor.supplierName}`,
          value: vendor.supplierId,
        }));

        setOptionsSelectVendor(vendorOptions);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };
  
  // auto fetch in every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchChartReceivingData(selectedStatus, currentPage, limitPerPage.code);
    }, 10000);
  
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [selectedStatus, currentPage, limitPerPage]); 

  useEffect(() => {
      fetchChartReceivingData(selectedStatus, currentPage, limitPerPage.code);
  }, [queryFilter.plantId, queryFilter.rangeDate, currentPage]);

 

  const currentItemDashboard = dataSchedules.slice(indexOfFirstItem, indexOfLastItem);
  // console.log("Current Dashboard Data:", currentItemDashboard); // Ensure data is sliced correctly

  useEffect(()=>{
    setCurrentItems(dataSchedules.slice(indexOfFirstItem, indexOfLastItem))
  }, [currentPage])

  const handleClickOpenMaterials = (data) => {
    setShowModalInput({...showModalInput, state: true})
    
    const dataVendor = data?.deliveryNotes ? data?.deliveryNotes : data
    const dataMaterials = data?.deliveryNotes?.Materials ? data?.deliveryNotes?.Materials : data.Materials
    console.log("data vendor:", dataVendor)
    console.log("data material:", dataMaterials)
    setDataMaterialsByDNInquery(dataMaterials)

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

  const { setChartData, getChartOption, selectedVendor, isModalOpen, setIsModalOpen } = useChartData({ dataSchedules, handleClickOpenMaterials });

  // Panggil hook `useChartData` dengan `currentItems`

  

  const [ showCard, setShowCard ] = useState({

    schedule: true,
    receiving: true
  })

  const handleFilterSchedule = async (selectedOption) => {
    console.log(selectedOption)
    const status = selectedOption !== null ? selectedOption.value : ""; // Jika tidak ada status, kirim ""
    setSelectedStatus(selectedOption); // Update state
    fetchChartReceivingData(selectedOption, 1, limitPerPage.code)
    console.log("Fetching chart data with status:", status);
  
    // try {
    //   const response = await getChartReceiving(
    //     queryFilter.plantId, 
    //     status,  // Kirim status dari filter
    //     "",      // vendor kosong
    //     queryFilter.rangeDate[0]?.toISOString().split("T")[0], 
    //     queryFilter.rangeDate[1]?.toISOString().split("T")[0]
    //   );
  
    //   if (response && response.data) {
    //     console.log("Filtered Chart Receiving Data:", response.data);
    //     setDataSchedules(response.data); // Simpan data hasil filter ke state
  
    //     // Ubah data agar sesuai dengan format yang digunakan di UI
    //     const items = response.data.map((item) => ({
    //       vendor_id: item.supplierCode,
    //       vendor_name: item.supplierName,
    //       day: item.rit,
    //       schedule_from: item.arrivalPlanTime,
    //       arrival_time: item.arrivalActualTime,
    //       status: item.status,
    //       materials: item.Materials,
    //     }));
        
    //     setCurrentItems(items); // Simpan data yang diformat ke state
    //   }
    // } catch (error) {
    //   console.error("Error fetching filtered chart data:", error);
    // }
  };
  

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
  
  const plantTimeBodyTemplate = (rowData) => {
    const timeFrom = rowData.arrivalPlanTime
    const timeTo = rowData.departurePlanTime
    return(
      <div>
        {timeFrom} - {timeTo}
      </div>
    )
  }
  const statusVendorBodyTemplate = (rowData) => {
    const status = rowData.status
    const bgColor = status === 'delayed' ? "#F64242" : status === "on schedule" ? "#35A535" : "transparent"
    return(
      <div className='text-center' 
      style={{ backgroundColor: bgColor, 
        padding: "5px 10px",
        fontWeight: "bold",
        color: "white",
        borderRadius: "8px", 
        textTransform: "uppercase"}}>
        {status !== 'schedule plan' ? status : ""}
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

        const selectStyles = {
          placeholder: (base) => ({
            ...base,
            // color: "red", // Warna merah untuk placeholder
            // fontWeight: "bold",
          }),
          singleValue: (base, state) => ({
            ...base,
            color: "white",
            // color: state.data.value === "delayed" ? "red" : "green", // Warna sesuai status
            backgroundColor: state.data.value === "delayed" ? "#F74F4F" : "#43AB43",
            fontWeight: "bold",
            padding: "5px 10px",
            borderRadius: "5px"
          }),
          control: (base) => ({
            ...base,
            height: "42px",
            minWidth: "220px"
          })
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
        border: "1px solid #6482AD",
    }}
    >
    <CCardHeader
        style={{
        zIndex: 4,
        backgroundColor: "#6482AD",
        color: "white",
        padding: "10px",
        }}
    >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
    <CTooltip content="Toggle Filter Visibility">
        <button
            className="btn d-flex align-items-center justify-content-center btn-toggle"
            style={{
            // backgroundColor: "#B0B0B0",
            // backgroundColor: "white",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            }}
            onClick={toggleFilterVisibility}
        >
            <CIcon icon={cilCog} size="sm" className='icon-toggle' />
        </button>
        </CTooltip>   
        <CCardTitle className="text-center fs-4" style={{ flexGrow: 1 }}>
        MAP TRUCK STATION WAREHOUSE #1 & #2
        </CCardTitle>
    </div>
    </CCardHeader>
      {/* Body dengan Gambar */}
      <CCardBody className="position-relative">
      {isFilterVisible && (
            <div className="d-flex mt-1 mb-2">
              <CCol sm={12} md={12} lg={5} xl={5} className="d-flex gap-1">
                <div>
                  <CFormText>Filter Plant</CFormText>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    id="plant"
                    options={[{ value: 'all', label: 'All' }, ...plants]} // Tambahkan opsi "All"
                    value={selectedPlant}
                    onChange={handlePlantChange}
                    styles={{
                      control: (base) => {
                        return ({
                          ...base,
                          width: '250px', // Atur lebar lebih kecil agar lebih proporsional
                          minWidth: '200px',
                          maxWidth: '100%',
                          borderRadius: '5px',
                          padding: '2px',
                          zIndex: 3, // Memberikan prioritas tinggi agar dropdown muncul di atas elemen lain
                          position: 'relative',
                          height: "100%"
                        })
                      },
                      menu: (base) => ({
                        ...base,
                        zIndex: 3, // Pastikan menu dropdown tidak tertutup elemen lain
                      })
                    }}
                  />
                </div>
                <div>
                  <CFormText >Filter by Status</CFormText>
                  <Select
                    onChange={handleFilterSchedule}
                    placeholder="All" // Default placeholder
                    isClearable
                    styles={ selectStyles}
                    value={selectedStatus} // Default ke ""
                    options={[
                      { label: "ON SCHEDULE", value: "on schedule" },
                      { label: "DELAYED", value: "delayed" },
                      
                    ]}
                  />
                </div>
              </CCol>
              {/* Kolom kedua */}
              <CCol sm={12} md={12} lg={7} xl={7} className="d-flex justify-content-end gap-2 "> 
                <div>
                  <CFormText style={{ alignSelf: "flex-start" }}>Search vendor</CFormText>
                  <Select 
                    options={optionsSelectVendor} 
                    isClearable 
                    placeholder="Vendor name" 
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: "250px", // Sesuaikan lebar input Select
                        zIndex: 1000, // Z-index untuk elemen container
                      }),
                      control: (base) => ({
                        ...base,
                        height: '42px'
                      })
                    }}
                  />
                </div>
                {/* <div className="flatpickr-wrapper d-flex flex-column align-items-end" style={{ position: "relative", width: "100%" }}> */}
                <div>
                  <CFormText>Filter by Date</CFormText>
                  <DateRangePicker 
                    showOneCalendar 
                    placeholder='All time' 
                    position='start' 
                    value={queryFilter.rangeDate} 
                    onChange={(e)=>{
                      console.log(e)
                      setQueryFilter({ 
                        ...queryFilter, 
                        rangeDate: [
                          new Date(e[0].setHours(0, 0, 0, 1)), 
                          new Date(e[1].setHours(23, 59, 59, 59))
                        ]
                      })
                    }}/>
                </div>
              </CCol>
            </div>
          )}
        {/* Tombol 1 (Tengah) */}
        {/* Loop untuk menampilkan tombol berdasarkan buttonPositions */}
        {Object.keys(buttonPositions).map((location) => {
          const pos = buttonPositions[location];
          return (
            <CButton
              key={location}
              className="position-absolute translate-middle"
              style={{
                top: pos.top,
                left: pos.left,
                backgroundColor: pos.color,
                borderColor: pos.color,
                color: "white",
                fontSize: "0.8rem",
                fontWeight: "bold",
                padding: "8px 16px",
                borderRadius: "8px",
              }}
            >
              {location}
            </CButton>
          );
        })}
        <CImage className="w-100" src={Mapfoto} height={620} style={{ borderRadius: "10px" }} />
        <CCard className=' mt-2'>
         
        <CFormLabel className='fs-4 fw-bold mt-2'> Table Detail Receiv By Truck Station</CFormLabel>
        <DataTable
                removableSort
                globalFilterFields={['dnNumber', 'supplierName', 'truckStation']}
                filters={queryFilter}
                showGridlines 
                size="small"
                // paginator
                rows={10}
                rowsPerPageOptions={[15, 25, 50, 100]}
                tableStyle={{ minWidth: '50rem' }}
                value={dataSchedules}
                filterDisplay="row"
                className="custom-table mt-2"
        >
                <Column className='' header="No" body={(rowBody, {rowIndex})=>rowIndex+1}></Column>
                <Column className='' field='dnNumber'  header="DN No"></Column>
                <Column className='' field='supplierName'  header="Vendor Name" ></Column>
                <Column className='' field='truckStation'  header="Truck Station" ></Column>
                <Column className='' field='rit'  header="Rit" ></Column>
                <Column className='' field='arrivalPlanDate'  header="Plan Date" ></Column>
                <Column className='' field='arrivalPlanTime'  header="Plan Time" body={plantTimeBodyTemplate} ></Column>
                <Column className='' field='arrivalActualDate'  header="Arriv. Date" ></Column>
                <Column className='' field='arrivalActualTime'  header="Arriv. Time" ></Column>
                {/* <Column className='' field='deliveryNotes.departureActualDate'  header="Departure Date" /> */}
                <Column className='' field='departureActualTime'  header="Dept. Time" ></Column>
                <Column className='' field='status'  header="Status" body={statusVendorBodyTemplate} ></Column>
                <Column className='' field=''  header="Materials" body={materialsBodyTemplate} ></Column>
            
        </DataTable>
           <CCol className="d-flex justify-content-center py-3" style={{ position: "relative" }}>
            <CPagination aria-label="Page navigation">
                <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                >
                    <FaAnglesLeft/>
                </CPaginationItem>
                <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    <FaChevronLeft/>
                </CPaginationItem>

                {visiblePages.map((page) => (
                    <CPaginationItem
                    key={page}
                    active={currentPage === page}
                    onClick={() => {
                        console.log("page:", page)
                        setCurrentPage(page)
                    }}
                    >
                    {page}
                    </CPaginationItem>
                ))}

                <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => {
                    console.log("currentPage in pagination:", currentPage)
                    setCurrentPage(currentPage + 1)
                    }}
                >
                    <FaChevronRight/>
                </CPaginationItem>
                <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                >
                    <FaAnglesRight/>
                </CPaginationItem>
            </CPagination>
           </CCol>
           </CCard>
    </CCardBody>
    </CCard>
  </CRow>
  </CContainer>
  )
}

export default Dashboard
