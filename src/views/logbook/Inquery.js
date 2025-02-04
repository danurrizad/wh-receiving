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
import { FaArrowUpRightFromSquare, FaCircleCheck, FaCircleExclamation, FaCircleXmark } from 'react-icons/fa6';


const Book = () => {
  const addToast = useToast()
  const [ loading, setLoading ] = useState(false)
  const { getDNInqueryData } = useReceivingDataService()
  const [ dataDNInquery, setDataDNInquery ] = useState([])
  const [ dataMaterialsByDNInquery, setDataMaterialsByDNInquery ] = useState([])

  const [ showModalInput, setShowModalInput] = useState(false)
  const [ showModalScanner, setShowModalScanner ] = useState(false)

  const [queryFilter, setQueryFilter] = useState({
    plantId: "",

    rangeDate: [new Date('2025-01-01'), new Date('2025-01-30')],
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

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

  const onGlobalFilterChange = (e) => {
    const value = e;
    let _filters = { ...queryFilter };

    _filters['global'].value = value;

    setQueryFilter(_filters);
    setGlobalFilterValue(value);
};

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
 

  const handleClickOpenMaterials = (data) => {
    setShowModalInput(true)
    console.log("data :", data.deliveryNotes.Materials)
    setDataMaterialsByDNInquery(data.deliveryNotes.Materials)
  }
  
  const materialsBodyTemplate = (rowBody) => {
    return(
      <div className='d-flex align-items-center justify-content-center'>
        <CButton onClick={()=>handleClickOpenMaterials(rowBody)} color='info' className='d-flex justify-content-center align-items-center p-2'>
          <FaArrowUpRightFromSquare style={{ color: "white"}}/>
        </CButton>
      </div>
    )
  }

  const plantTimeBodyTemplate = (rowData) => {
    const timeFrom = rowData.deliveryNotes.arrivalPlanTime
    const timeTo = rowData.deliveryNotes.departurePlanTime
    return(
      <div>
        {timeFrom} - {timeTo}
      </div>
    )
  }

  const statusVendorBodyTemplate = (rowData) => {
    const status = rowData.deliveryNotes.status
    const bgColor = status === 'delayed' ? "#F64242" : status === "on schedule" ? "#35A535" : "transparent"
    return(
      <div className='text-center' style={{ backgroundColor: bgColor, padding: "5px 10px", borderRadius: "5px", color: "white" }}>
        {status}
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

  return (
    <CContainer fluid>
        <CRow>
          <CCard className='p-0'>
            <CCardHeader>
              <CCardTitle>INQUERY DATA</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow className='d-flex align-items-end'>
                
                <CCol sm='3' className=''>
                    <CFormText>Search</CFormText>
                    <Input value={globalFilterValue} onChange={(e)=>onGlobalFilterChange(e)} placeholder="Keyword Search"/>
                </CCol>

                <CCol className='d-flex justify-content-end gap-4'>
                  <CCol sm='3' className=''>
                      <CFormText>Filter by Plant</CFormText>
                      <Dropdown
                        value={queryFilter.plantId}
                        options={plants}
                        // onChange={handleChangeDate}
                        placeholder="Select plant"
                        showClear
                        style={{ width: '100%', borderRadius: '5px', padding: '1.75px' }}
                      />
                  </CCol>
                  <CCol sm='auto' className=''>
                      <CFormText>Filter by Date</CFormText>
                      <DateRangePicker showOneCalendar placeholder='All time' position='start' value={queryFilter.rangeDate} />
                  </CCol>
                </CCol>
              </CRow>
              <CRow className='mt-3'>
                  <DataTable
                    className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap'
                    removableSort
                    globalFilterFields={['deliveryNotes.dnNumber', 'deliveryNotes.supplierName', 'deliveryNotes.truckStation', '']}
                    filters={queryFilter}
                    size='small'
                    // emptyMessage={renderCustomEmptyMsg}
                    scrollable
                    scrollHeight="500px"
                    showGridlines
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    value={dataDNInquery}
                    // dataKey="id"
                    // onFilter={(e) => setFilters(e.filters)}
                    filterDisplay="row"
                    // loading={loading}
                  >
                    <Column className='' header="No" body={(rowBody, {rowIndex})=>rowIndex+1}/>
                    <Column className='' field='deliveryNotes.dnNumber'  header="DN No"/>
                    <Column className='' field='deliveryNotes.supplierName'  header="Vendor Name" />
                    <Column className='' field='deliveryNotes.truckStation'  header="Truck Station" />
                    <Column className='' field='deliveryNotes.rit'  header="Rit" />
                    <Column className='' field='deliveryNotes.arrivalPlanDate'  header="Plan Date" />
                    <Column className='' field='deliveryNotes.arrivalPlanTime'  header="Plan Time" body={plantTimeBodyTemplate} />
                    <Column className='' field='deliveryNotes.arrivalActualDate'  header="Arrival Date" />
                    <Column className='' field='deliveryNotes.arrivalActualTime'  header="Arrival Time" />
                    {/* <Column className='' field='deliveryNotes.departureActualDate'  header="Departure Date" /> */}
                    <Column className='' field='deliveryNotes.departureActualTime'  header="Departure Time" />
                    <Column className='' field='deliveryNotes.status'  header="Status" body={statusVendorBodyTemplate} />
                    <Column className='' field=''  header="Materials" body={materialsBodyTemplate} />
                
                  </DataTable>
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
          <CRow className='pt-3'>
            <DataTable
                    className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap'
                    removableSort
                    // filters={filters}
                    size='small'
                    // emptyMessage={renderCustomEmptyMsg}
                    scrollable
                    scrollHeight="500px"
                    showGridlines
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    value={dataMaterialsByDNInquery}
                    // dataKey="id"
                    // onFilter={(e) => setFilters(e.filters)}
                    filterDisplay="row"
                    // loading={loading}
                  >
                    <Column className='' header="No" body={(rowBody, {rowIndex})=>rowIndex+1} />
                    <Column className='' field='materialNo'  header="Material No" />
                    <Column className='' field='description'  header="Material Description" />
                    <Column className='' field='address'  header="Rack Address" />
                    <Column className='' field='reqQuantity' header="Req. Qty" />
                    <Column className='' field='receivedQuantity'  header="Act. Qty" />
                    <Column className='' field='remain'  header="Remain" />
                    <Column className='' field='status'  header="Status" body={statusQtyBodyTemplate} />
                
                  </DataTable>
          </CRow>
          <CRow className='mt-3 px-3'>
            <CButton disabled color='success' className='text-white w-100'>Save changes</CButton>
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