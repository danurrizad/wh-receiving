import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster, CTooltip } from '@coreui/react'
import {  DateRangePicker, Input } from 'rsuite';
import { handleExport } from '../../utils/ExportToExcel'
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Receiving from '../receiving/Receiving';
import useReceivingDataService from '../../services/ReceivingDataServices'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { useToast } from '../../App';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { FaArrowUpRightFromSquare, FaCircleCheck, FaCircleExclamation, FaCircleXmark, FaInbox, FaTruckArrowRight } from 'react-icons/fa6';
import Swal from 'sweetalert2'
import { Row } from 'primereact/row';
import { ColumnGroup } from 'primereact/columngroup';
import CustomTableLoading from '../../components/LoadingTemplate';
import useVerify from '../../hooks/UseVerify';


const InquiryVendor = () => {
  const colorMode = localStorage.getItem('coreui-free-react-admin-template-theme')
  const { plantId } = useVerify()
  const [ loading, setLoading ] = useState(false)
  const { getDNInquiryVendorData } = useReceivingDataService()
  const [ dataDNInquery, setDataDNInquery ] = useState([])

  const [queryFilter, setQueryFilter] = useState({
    plantId: "",
    rangeDate: [
      new Date(), 
      new Date()
    ],
    status: "",
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

  // useEffect(()=>{
  //   if(plantId !== null){
  //     console.log("TES ANCOK")
  //     setQueryFilter({
  //       ...queryFilter,
  //       plantId: plantId
  //     })
  //   }
  // }, [plantId])

  const handleChangeRangeDate = (value) => {
    if(value !== null){
      setQueryFilter({
        ...queryFilter,
        rangeDate: value
      })
    } else{
      setQueryFilter({
        ...queryFilter,
        rangeDate: [null, null]
      })
    }
  }

  const handleChangeFilterPlant = (e) => {
    if(e.value !== undefined){
      setQueryFilter({ ...queryFilter, plantId: e.target.value})
    } else{
      setQueryFilter({ ...queryFilter, plantId: ""})
    }
  }

  const [globalFilterValue, setGlobalFilterValue] = useState('');
  
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

  const [statuses] = useState(['On Schedule', 'Overdue', 'Unscheduled'])

  const onGlobalFilterChange = (e) => {
    const value = e;
    let _filters = { ...queryFilter };

    _filters['global'].value = value;

    setQueryFilter(_filters);
    setGlobalFilterValue(value);
};

  const getDNInquery = async(plantId, startDate, endDate) => {
    try {
      setLoading(true)
      const idPlant = getPlantId(plantId)
      const formattedFrom = startDate?.toLocaleDateString('en-CA') || ""
      const formattedTo = endDate?.toLocaleDateString('en-CA') || ""
      const response = await getDNInquiryVendorData(idPlant, formattedFrom, formattedTo, queryFilter.status) 
      setDataDNInquery(response.data.data)
    } catch (error) {
      console.error(error)
      setDataDNInquery([])
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    getDNInquery(queryFilter.plantId, queryFilter.rangeDate[0], queryFilter.rangeDate[1])
  }, [queryFilter])
 


  const planTimeBodyTemplate = (rowData) => {
    const timeFrom = rowData?.arrivalPlanTime?.split("T")[1].slice(0, 5) || ""
    const timeTo = rowData?.departurePlanTime?.split("T")[1].slice(0, 5) || ""
    return(
      <div>
        {timeFrom} - {timeTo}
      </div>
    )
  }

  const actualTimeBodyTemplate = (rowData) => {
    return(
      <div>
        {rowData.arrivalActualTime.split("T")[1].slice(0, 5)}
      </div>
    )
  }

  const statusVendorBodyTemplate = (rowData) => {
    const status = rowData.status
    const bgColor = 
      status === "delayed" ? "#F64242" : 
      status === "scheduled" ? "#6E9CFF" : 
      status === "overdue" ? "#FBC550" : 
      status === "on schedule" ? "#43AB43" : 
      status === "unscheduled" ? "gray" : 
      "transparent"
    return(
      <CTooltip 
        content={ 
          status === "delayed" ? "Vendor belum tiba dan melebihi jadwal" : 
          status === "scheduled" ? "Vendor belum tiba" : 
          status === "overdue" ? "Vendor telah tiba dengan melebihi jadwal" : 
          status === "on schedule" ? "Vendor telah tiba tepat waktu" : 
          status === "unscheduled" ? "Vendor tanpa jadwal telah tiba" : 
          ""
        } 
        placement="top"
      >
        <button
          className='text-center' 
          style={{ 
            backgroundColor: bgColor, 
            width: "100%",
            padding: "5px 10px",
            fontWeight: "bold",
            color: status === "overdue" ? "black" : "white",
            borderRadius: "8px", 
            textTransform: "uppercase",
            cursor: "pointer"
          }}
        >
          {status}
        </button>
      </CTooltip>
    )
  }

  const delayTimeBodyTemplate = (rowData) => {
    const delayTime = rowData.delayTime
    const status = rowData.status
    return(
      <p>{status === 'on schedule' ? '-' : delayTime}</p>
    )
  }
    
  const renderCustomEmptyMsg = () => {
      return(
        <div className='empty-msg w-100 d-flex flex-column align-items-center justify-content-center py-3' style={{ color: "black", opacity: "50%"}}>
          <FaInbox size={40}/>
          <p>Data Not Found!</p>
        </div>
      )
    }

  
  return (
    <CContainer fluid>
        <CRow>
          <CCard className='p-0 mb-4' style={{ border: "1px solid #6482AD"}}>
            <CCardHeader style={{ backgroundColor: "rgb(100, 130, 173)", color: "white"}}>
              <CCardTitle className='text-center'>INQUIRY VENDOR ARRIVAL</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow className='d-flex align-items-end'>
                
                <CCol md='12' xl='3' className=''>
                    <CFormText>Search</CFormText>
                    <Input value={globalFilterValue} className='' onChange={(e)=>onGlobalFilterChange(e)} placeholder="Keyword Search"/>
                </CCol>

                <CCol xl='9' className='d-xl-fle d-sm-block justify-content-end'>
                  <CRow>
                    <CCol sm='6' xs='6' xl='4' className='flex-shrink-0 '>
                        <CFormText>Filter by Status</CFormText>
                        <Dropdown
                          value={queryFilter.status}
                          options={statuses}
                          onChange={(e)=>{
                            setQueryFilter({ ...queryFilter, status: e.value !== undefined ? e.target.value : ""})
                          }}
                          placeholder="All status"
                          showClear
                          style={{ width: '100%', borderRadius: '5px', padding: '1.75px' }}
                        />
                    </CCol>
                    <CCol sm='6' xs='6' xl='4' className='flex-shrink-0 flex-grow-0' >
                        <CFormText>Filter by Plant</CFormText>
                        <Dropdown
                          value={queryFilter.plantId}
                          options={plants}
                          onChange={(e)=>{
                            console.log("E :", e)
                            setQueryFilter({ ...queryFilter, plantId: e.value !== undefined ? e.target.value : ""})
                          }}
                          placeholder="All plant"
                          showClear
                          style={{ width: '100%', borderRadius: '5px', padding: '1.75px' }}
                        />
                    </CCol>
                    <CCol sm='6' xs='6' xl='4' className='' >
                        <CFormText>Filter by Date</CFormText>
                        <DateRangePicker 
                          format="yyyy-MM-dd" 
                          character=' – ' 
                          showOneCalendar 
                          placeholder='All time' 
                          placement='bottomEnd'
                          style={{ width: "100%"}}
                          value={queryFilter.rangeDate} 
                          onChange={handleChangeRangeDate} 
                          />
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow className='mt-3 px-3'>
                <CCard className='p-0 overflow-hidden' >
                  <CCardBody className="p-0">
                    <DataTable
                      loading={loading}
                      loadingIcon={<CustomTableLoading/>}
                      className='p-datatable-gridlines p-datatable-sm custom-datatable'
                      style={{ minHeight: "200px"}}
                      removableSort
                      globalFilterFields={['Plant.plantName', 'Supplier.supplierName', 'truckStation', '']}
                      filters={queryFilter}
                      size='small'
                      emptyMessage={renderCustomEmptyMsg}
                      scrollHeight="500px"
                      showGridlines
                      stripedRows
                      paginator
                      rows={10}
                      rowsPerPageOptions={[10, 25, 50, 100]}
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                      value={dataDNInquery}
                      filterDisplay="row"
                    >
                      <Column className='' header="No" body={(rowBody, {rowIndex})=>rowIndex+1}/>
                      <Column className='' sortable field='movementDate' header="Movement Date"/>
                      <Column className='' sortable field='Supplier.supplierName' header="Vendor Name"/>
                      <Column className='' sortable field='truckStation' header="Truck Station" />
                      <Column className='' sortable field='Plant.plantName' header="Plant"/>
                      <Column className='' sortable field='' header="Planning" body={planTimeBodyTemplate}/>
                      <Column className='' sortable field='' header="Arrival" body={actualTimeBodyTemplate}/>
                      <Column className='' sortable field='' header="Status" body={statusVendorBodyTemplate}/>
                  
                    </DataTable>
                  </CCardBody>
                </CCard>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>
    </CContainer>
  )
}

export default InquiryVendor