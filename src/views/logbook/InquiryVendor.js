import React, { useState, useEffect} from 'react'
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CButton, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormLabel, CFormText, CModal, CModalBody, CModalHeader, CModalTitle, CRow, CTooltip } from '@coreui/react'
import {  DateRangePicker, Input } from 'rsuite';
import useReceivingDataService from '../../services/ReceivingDataServices'
import { Dropdown } from 'primereact/dropdown'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { FaArrowUpRightFromSquare, FaCircleCheck, FaCircleExclamation, FaCircleXmark, FaInbox } from 'react-icons/fa6';
import CustomTableLoading from '../../components/LoadingTemplate';
import { Button } from 'primereact/button';
import { exportExcelInquiryVendor } from '../../utils/ExportToExcel';


const InquiryVendor = () => {
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

  const [ showModalInput, setShowModalInput] = useState({
    state: false,
    enableSubmit: false
  })
  const [ formUpdate, setFormUpdate ] = useState({})
  const [ dataMaterialsByDNInquery, setDataMaterialsByDNInquery ] = useState([])
  const [ dataDN, setDataDN ] = useState([])

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
    
  const renderCustomEmptyMsg = () => {
      return(
        <div className='empty-msg w-100 d-flex flex-column align-items-center justify-content-center py-3' style={{ color: "black", opacity: "50%"}}>
          <FaInbox size={40}/>
          <p>Data Not Found!</p>
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

  const remainBodyTemplate = (rowBody, {rowIndex}) => {
    const colorText = rowBody.remain < 0 ? "red" : "black" 
    return(
      <p style={{color: colorText}}>
        {rowBody.remain}
      </p>
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

  const handleClickOpenMaterials = (data) => {
    setShowModalInput({...showModalInput, state: true})
    setFormUpdate({
      vendorName: data.supplierName
    })
    setDataDN(data.DeliveryNotes)
    let materials = []
    data.DeliveryNotes.map((data)=>{
      materials.push(data.Materials)
    })
    setDataMaterialsByDNInquery(materials)
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
                <CCol sm='6' xs='12' xl='2' className='flex-shrink-0' style={{ border: "2px solid yellow"}}>
                  <Button
                      type="button"
                      label="Export To Excel"
                      icon="pi pi-file-excel"
                      severity="success"
                      className="rounded-2 me-2 mb-1 py-2 text-white"
                      onClick={()=>exportExcelInquiryVendor(dataDNInquery)}
                      data-pr-tooltip="XLS"
                    />
                </CCol>
                <CCol xl='10' className='d-xl-fle d-sm-block justify-content-end'>
                  <CRow>
                    <CCol md='12' xl='3' className=''>
                      <CFormText>Search</CFormText>
                      <Input value={globalFilterValue} className='' onChange={(e)=>onGlobalFilterChange(e)} placeholder="Keyword Search"/>
                    </CCol>
                    <CCol sm='6' xs='6' xl='3' className='flex-shrink-0  '>
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
                    <CCol sm='6' xs='6' xl='3' className='flex-shrink-0 flex-grow-0' >
                        <CFormText>Filter by Plant</CFormText>
                        <Dropdown
                          value={queryFilter.plantId}
                          options={plants}
                          onChange={(e)=>{
                            setQueryFilter({ ...queryFilter, plantId: e.value !== undefined ? e.target.value : ""})
                          }}
                          placeholder="All plant"
                          showClear
                          style={{ width: '100%', borderRadius: '5px', padding: '1.75px' }}
                        />
                    </CCol>
                    <CCol sm='6' xs='6' xl='3' className='' >
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
                      globalFilterFields={['plantName', 'supplierName', 'truckStation', '']}
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
                      <Column className='' sortable field='supplierName' header="Vendor Name"/>
                      <Column className='' sortable field='rit' header="Rit" />
                      <Column className='' sortable field='truckStation' header="Truck Station" />
                      <Column className='' sortable field='plantName' header="Plant"/>
                      <Column className='' sortable field='' header="Planning" body={planTimeBodyTemplate}/>
                      <Column className='' sortable field='' header="Arrival" body={actualTimeBodyTemplate}/>
                      <Column className='' sortable field='' header="Status" body={statusVendorBodyTemplate}/>
                      <Column className='' sortable field='' header="Delivery Note" body={materialsBodyTemplate}/>
                  
                    </DataTable>
                  </CCardBody>
                </CCard>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>

        {/* -------------------------------------------MODAL----------------------------------------------------------- */}
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
            <CCol>
              <CFormText>VENDOR NAME</CFormText>  
              <CFormLabel>{formUpdate.vendorName}</CFormLabel>
            </CCol>
          </CRow>
          <CRow className='pt-1'>
            <CAccordion style={{ 
              '--cui-accordion-active-bg': '#6482AD',
              '--cui-accordion-active-color': 'white',
              '--cui-accordion-btn-focus-box-shadow': 'none',
              '--cui-accordion-btn-active-color': 'white'
              }}
            >
              {dataDN?.length !== 0 && dataDN?.map((data, index)=>{
                return(
                  <CAccordionItem itemKey={index+1} key={index}>
                    <CAccordionHeader>DN: {data.dnNumber} | STATUS: <div style={{ color: data.completeItems !== data.totalItems && 'red', padding: "0 5px"}}> {data.completeItems} </div> / {data.totalItems}</CAccordionHeader>
                    <CAccordionBody>
                      <DataTable
                        className="p-datatable-sm custom-datatable text-nowrap"
                        loading={loading}
                        loadingIcon={<CustomTableLoading/>}
                        tableStyle={{ minWidth: '50rem' }}
                        removableSort
                        size="small"
                        scrollable
                        scrollHeight="50vh"
                        showGridlines
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        value={dataMaterialsByDNInquery[index]}
                        filterDisplay="row"
                      >
                        <Column header="No" body={(rowBody, {rowIndex})=>rowIndex+1} />
                        <Column field='materialNo'  header="Material No" />
                        <Column field='description'  header="Material Description" />
                        <Column field='address'  header="Rack Address" />
                        <Column field="reqQuantity" header="Req. Qty" body={(data) => <div className="text-center">{data.reqQuantity}</div>} />
                        <Column field="actQuantity" header="Act. Qty" body={(data) => <div className="text-center">{data.actQuantity}</div>} />
                        <Column field="remain" header="Remain" body={remainBodyTemplate} align="center" />
                        <Column field='status'  header="Status" body={statusQtyBodyTemplate} />
                      </DataTable>
                    </CAccordionBody>
                  </CAccordionItem>
                )
              })}
            </CAccordion>
          </CRow>
          <CRow  className='mt-1 px-2'></CRow>
        </CModalBody>
      </CModal>
    </CContainer>
  )
}

export default InquiryVendor