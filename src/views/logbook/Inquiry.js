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
import { FaArrowUpRightFromSquare, FaCircleCheck, FaCircleExclamation, FaCircleXmark, FaInbox } from 'react-icons/fa6';
import Swal from 'sweetalert2'
import { Row } from 'primereact/row';
import { ColumnGroup } from 'primereact/columngroup';
import CustomTableLoading from '../../components/LoadingTemplate';


const Book = () => {
  // const addToast = useToast()
  const [ loading, setLoading ] = useState(false)
  const { getDNInqueryData, submitUpdateMaterialByDNData } = useReceivingDataService()
  const [ dataDNInquery, setDataDNInquery ] = useState([])
  const [ dataMaterialsByDNInquery, setDataMaterialsByDNInquery ] = useState([])

  const [ formUpdate, setFormUpdate ] = useState({})
  const [ isViewOnly, setIsViewOnly ] = useState({})

  const [ showModalInput, setShowModalInput] = useState({
    state: false,
    enableSubmit: false
  })
  const [ showModalScanner, setShowModalScanner ] = useState(false)

  const [queryFilter, setQueryFilter] = useState({
    plantId: "",

    rangeDate: [
      new Date(), 
      new Date()
    ],
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })

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
      if(startDate !== null && endDate !== null) {
        const formattedFrom = startDate.toLocaleDateString('en-CA')
        const formattedTo = endDate.toLocaleDateString('en-CA')
        const response = await getDNInqueryData(idPlant, formattedFrom, formattedTo) 
        setDataDNInquery(response.data.data)
      }else{
        const response = await getDNInqueryData(idPlant, "", "") 
        setDataDNInquery(response.data.data)
      }
    } catch (error) {
      console.error(error)
      setDataDNInquery([])
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    getDNInquery(queryFilter.plantId, queryFilter.rangeDate[0], queryFilter.rangeDate[1])
  }, [queryFilter.plantId, queryFilter.rangeDate])
 

  const handleClickOpenMaterials = (data) => {
    setShowModalInput({...showModalInput, state: true})    
    const dataVendor = data
    const dataMaterials = data.Materials
    setDataMaterialsByDNInquery(data.Materials)
    setIsViewOnly(dataMaterials.map((data)=>Boolean(data.viewOnly)))

    setFormUpdate({
      dnNumber: dataVendor.dnNumber,
      vendorName: dataVendor.supplierName,
      rit: dataVendor.rit,
      incomingIds: dataMaterials.map((data)=>data.incomingId),
      receivedQuantities: dataMaterials.map((data)=>data.receivedQuantity),
      statuses: dataMaterials.map((data)=>data.status),
      remains: dataMaterials.map((data)=>data.remain),
      warehouseId: dataVendor.warehouseId
    })
  }

  const headerGroup = (
    <ColumnGroup>
        <Row>
            <Column header="No" rowSpan={2} />
            <Column header="DN No" sortable field='deliveryNotes.dnNumber' rowSpan={2} />
            <Column header="Vendor Name" sortable field='deliveryNotes.supplierName' rowSpan={2} />
            <Column header="Truck Station" sortable field='deliveryNotes.truckStation' rowSpan={2} />
            <Column header="Rit" sortable field='deliveryNotes.rit' rowSpan={2} />
            <Column header="Plan" colSpan={2} align='center' />
            <Column header="Arrival" colSpan={2} align='center' />
            <Column header="Departure" sortable field='deliveryNotes.departureActualTime' rowSpan={2} />
            <Column header="Status Arrival" sortable field='deliveryNotes.status' rowSpan={2} />
            <Column header="Delay Time" sortable field='deliveryNotes.delayTime' rowSpan={2} />
            <Column header="Status Received" sortable rowSpan={2} />
            <Column header="Materials" rowSpan={2} />
        </Row>
        <Row>
            <Column header="Date" sortable field="deliveryNotes.arrivalPlanDate" />
            <Column header="Time" sortable field="deliveryNotes.arrivalPlanTime" />
            <Column header="Date" sortable field="deliveryNotes.arrivalActualDate" />
            <Column header="Time" sortable field="deliveryNotes.arrivalActualTime" />
        </Row>
    </ColumnGroup>
  );

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
    const bgColor = 
      status === "delayed" ? "#F64242" : 
      status === "scheduled" ? "#6E9CFF" : 
      status === "overdue" ? "#FBC550" : 
      status === "on schedule" ? "#43AB43" : 
      "transparent"
    return(
      <CTooltip 
        content={ 
          status === "delayed" ? "Vendor belum tiba dan melebihi jadwal" : 
          status === "scheduled" ? "Vendor belum tiba" : 
          status === "overdue" ? "Vendor telah tiba dengan melebihi jadwal" : 
          status === "on scheduled" ? "Vendor telah tiba tepat waktu" : 
          "COMPLETED"
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


  const [enabledRows, setEnabledRows] = React.useState([]); // Array of enabled row IDs
  const inputRefs = useRef({})
  const handleEnableInput = (rowData) => {
    setEnabledRows((prev) => [...prev, rowData.description]); // Add row ID to the enabled rows

    const refKey = rowData.description; // Use the row's unique identifier
    setTimeout(()=>{
      inputRefs.current[refKey]?.focus(); // Focus the specific input field
    }, 100)

  };

  const handleDisableInput = (rowData) => {
    setTimeout(()=>{
      // inputRefs.current[refKey]?.focus(); // Focus the specific input field
      setEnabledRows((prev) => prev.filter((id) => id !== rowData.description)); // Remove row ID from enabled rows
    }, 100)
  };

  const handleInputChangeQty = (rowIndex, rowData, eValue) => {
    setFormUpdate((prevState) => ({
      ...prevState,
      receivedQuantities: prevState.receivedQuantities.map((value, index) =>
        index === rowIndex && Number(eValue) <= rowData.reqQuantity ? ''+Number(eValue) : value
      ),
    }));
  };

  const handleEnterInputQty = (rowIndex, rowData, e) => {
    if (e.key === "Enter"){
      handleSubmitChangeQty(rowIndex, rowData)
    }
}

const handleSubmitChangeQty = (rowIndex, rowData) => {
  handleDisableInput(rowData)
  
  const remainInData = rowData.remain
  const reqQty = rowData.reqQuantity
  const inputAct = Number(formUpdate.receivedQuantities[rowIndex.rowIndex])
  const newRemainQty = inputAct - reqQty
  
  if(remainInData !== newRemainQty){
    setShowModalInput({...showModalInput, enableSubmit: true})
  }

  setFormUpdate((prevState) => ({
    ...prevState,
    remains: prevState.remains.map((value, index) =>
      index === rowIndex.rowIndex ? Number(newRemainQty) : value
    ),
    statuses: prevState.statuses.map((value, index) => 
      index === rowIndex.rowIndex && newRemainQty === 0 ? "completed" : 
      index === rowIndex.rowIndex && newRemainQty === rowData.remain ? value : 
      index === rowIndex.rowIndex && newRemainQty !== rowData.remain && newRemainQty < 0 ? "partial" : 
      index === rowIndex.rowIndex && newRemainQty !== rowData.remain && newRemainQty > 0 ? "completed" : 
      value
    ),
  }));
}

  const recQtyBodyTemplate = (rowData, rowIndex) => {
    const isInputEnabled = enabledRows.includes(rowData.description); 
    const recQty = rowData.receivedQuantity
    const indexMaterial = rowIndex.rowIndex
    
    return(
      <div className='d-flex gap-3 align-items-center justify-content-center'>
          <InputText
              ref={(el) => (inputRefs.current[rowData.description] = el)}
              id={`inputQty-${rowData.description}`}
              type='text'
            disabled={!isInputEnabled}
            placeholder='-'
            value={formUpdate.receivedQuantities[indexMaterial]}
            onChange={(e)=>handleInputChangeQty(indexMaterial, rowData, e.target.value)}
            onKeyDown={(e)=>handleEnterInputQty(rowIndex, rowData, e)}
            onBlur={()=>handleSubmitChangeQty(rowIndex, rowData)}
            style={{ width: "70px"}}
          />
         {/* { isInputEnabled && !isViewOnly[indexMaterial] && formUpdate.receivedQuantities[indexMaterial]!==rowData.reqQuantity ? ( */}
         { isInputEnabled && !isViewOnly[indexMaterial]  ? (
              <CButton
                color=''
                className="p-button-sm p-button-secondary text-white"
                onClick={()=>handleSubmitChangeQty(rowIndex, rowData)}
              >
                <CIcon style={{ color: "green"}} icon={icon.cilCheck}/>
              </CButton>
            // ) : !isInputEnabled && !isViewOnly[indexMaterial] && formUpdate.receivedQuantities[indexMaterial]!==rowData.reqQuantity ?  (
            ) : !isInputEnabled && !isViewOnly[indexMaterial]  ?  (
              <CButton
                color=''
                className="p-button-sm p-button-secondary text-white"
                onClick={()=>handleEnableInput(rowData)}
              >
                <CIcon style={{ color: "gray"}} icon={icon.cilPen}/>
              </CButton>
    
            ) : null}
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

  const statusQtyBodyTemplate = (rowData, rowIndex) => {
    const indexMaterial = rowIndex.rowIndex
      return(
        <div className='d-flex justify-content-center'>
          <CTooltip 
            content={ 
              formUpdate.statuses[indexMaterial] === "not complete" ? "NOT DELIVERED" : 
              formUpdate.statuses[indexMaterial] === "partial" ? "NOT COMPLETED" : 
              formUpdate.statuses[indexMaterial] === "completed" ? "COMPLETED" : 
              "COMPLETED"
            } 
            placement="top"
            >
            <CButton style={{ border: 0}}>
              { formUpdate.statuses[indexMaterial] === "not complete" ? <FaCircleXmark style={{ color: "#FF0000", fontSize: "24px"}}/> : 
                formUpdate.statuses[indexMaterial] === "partial" ? <FaCircleExclamation style={{ color: "#FFD43B", fontSize: "24px"}}/> : 
                formUpdate.statuses[indexMaterial] === "completed" ? <FaCircleCheck style={{ color: "#00DB42", fontSize: "24px"}}/> : 
                <FaCircleCheck style={{ color: "#00DB42", fontSize: "24px"}}/>
              }
              
            </CButton>
          </CTooltip>
        </div>
      )
    }

    const statusReceivedBodyTemplate = (rowData) => {
      const completedReceive = rowData.Materials.filter((data)=>data.status === 'completed')
      return(
        <div>
          <span style={{color: completedReceive.length !== rowData.Materials.length ? "red" : "black"}}>{completedReceive.length}</span> / <span>{rowData.Materials.length}</span>
        </div>
      )
    }

    const renderCustomEmptyMsg = () => {
        return(
          <div className='w-100 d-flex flex-column align-items-center justify-content-center py-3' style={{ color: "black", opacity: "50%"}}>
            <FaInbox size={40}/>
            <p>Data Not Found!</p>
          </div>
        )
      }

    const handleSaveChangesMaterials = async() => {
          // console.log("----------------------SUBMIT LOG---------------------", )
          const dnNumber = formUpdate.dnNumber
          const warehouseId = formUpdate.warehouseId
          const filteredQty = formUpdate.receivedQuantities.filter((data,index)=>Number(data) !== Number(dataMaterialsByDNInquery[index].receivedQuantity))

          const formBody = {
            incomingIds: formUpdate.incomingIds.filter((data,index)=>Number(formUpdate.receivedQuantities[index]) !== Number(dataMaterialsByDNInquery[index].receivedQuantity) && Number(data)),
            quantities: filteredQty.map(Number),
          }
    
          Swal.fire({
            title: "Save confirmation",
            text: "Please verify the material quantities before saving!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Save",
            preConfirm: async () => {
              try {
                const response = await submitUpdateMaterialByDNData(warehouseId, formBody)
                return "Material quantities updated!"
              } catch (error) {
                console.warn("ERROR :", error)
                return error
              } 
            }
          }).then(async(result) => {
            if (result.isConfirmed) {
              if(result.value === "Material quantities updated!"){
                setShowModalInput({ state: false, enableSubmit: false})
                Swal.fire({
                  title: "Saved!",
                  text: result.value,
                  icon: "success"
                });
                getDNInquery(queryFilter.plantId, queryFilter.rangeDate[0], queryFilter.rangeDate[1])
              } else{
                Swal.fire({
                  title: "Failed!",
                  text: result.value,
                  icon: "error",
                  confirmButtonColor: "#3085d6",
                });
              }
            }
          });   
      }

  return (
    <CContainer fluid>
        <CRow>
          <CCard className='p-0 mb-4' style={{ border: "1px solid #6482AD"}}>
            <CCardHeader style={{ backgroundColor: "rgb(100, 130, 173)", color: "white"}}>
              <CCardTitle className='text-center'>INQUIRY DATA</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow className='d-flex align-items-end'>
                
                <CCol md='3' className=''>
                    <CFormText>Search</CFormText>
                    <Input value={globalFilterValue} onChange={(e)=>onGlobalFilterChange(e)} placeholder="Keyword Search"/>
                </CCol>

                <CCol className='d-flex justify-content-end gap-4'>
                  <CCol sm='4' md='3' className=''>
                      <CFormText>Filter by Plant</CFormText>
                      <Dropdown
                        value={queryFilter.plantId}
                        options={plants}
                        onChange={handleChangeFilterPlant}
                        // onChange={(e)=>console.log(e.target.value)}
                        placeholder="All plant"
                        showClear
                        style={{ width: '100%', borderRadius: '5px', padding: '1.75px' }}
                      />
                  </CCol>
                  <CCol sm='auto' className=''>
                      <CFormText>Filter by Date</CFormText>
                      <DateRangePicker 
                        format="yyyy-MM-dd" 
                        character=' – ' 
                        showOneCalendar 
                        placeholder='All time' 
                        position='start' 
                        style={{ width: "210px"}}
                        value={queryFilter.rangeDate} 
                        onChange={handleChangeRangeDate} 
                        />
                  </CCol>
                </CCol>
              </CRow>
              <CRow className='mt-3 px-3'>
                <CCard className='p-0 overflow-hidden' >
                  <CCardBody className="p-0">
                    <DataTable
                      loading={loading}
                      loadingIcon={<CustomTableLoading/>}
                      headerColumnGroup={headerGroup}
                      className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap'
                      style={{ minHeight: "200px"}}
                      removableSort
                      globalFilterFields={['dnNumber', 'supplierName', 'truckStation', '']}
                      filters={queryFilter}
                      size='small'
                      emptyMessage={renderCustomEmptyMsg}
                      // scrollable
                      scrollHeight="500px"
                      showGridlines
                      stripedRows
                      paginator
                      rows={10}
                      rowsPerPageOptions={[10, 25, 50, 100]}
                      value={dataDNInquery}
                      filterDisplay="row"
                    >
                      <Column className='' header="No" body={(rowBody, {rowIndex})=>rowIndex+1}/>
                      <Column className='' field='dnNumber'  header="DN No"/>
                      <Column className='' field='supplierName'  header="Vendor Name" />
                      <Column className='' field='truckStation'  header="Truck Station" />
                      <Column className='' field='rit'  header="Rit" />
                      <Column className='' field='arrivalPlanDate'  header="Plan Date" />
                      <Column className='' field='arrivalPlanTime'  header="Plan Time" body={plantTimeBodyTemplate} />
                      <Column className='' field='arrivalActualDate'  header="Arv. Date" />
                      <Column className='' field='arrivalActualTime'  header="Arv. Time" />
                      {/* <Column className='' field='deliveryNotes.departureActualDate'  header="Departure Date" /> */}
                      <Column className='' field='departureActualTime'  header="Dpt. Time" />
                      <Column className='' field='status'  header="Status Arrival" body={statusVendorBodyTemplate} />
                      <Column className='' field='delayTime'  header="Delay Time" style={{ textTransform: "lowercase"}} />
                      <Column className='' field=''  header="Status Received" body={statusReceivedBodyTemplate} />
                      <Column className='' field=''  header="Materials" body={materialsBodyTemplate} />
                  
                    </DataTable>
                  </CCardBody>
                </CCard>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>


        {/* -----------------------------------------------------------------------------------MODAL RENDERING--------------------------------------------------------------------------------------- */}

        {/* Modal Upload File */}
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
          <CRow className='pt-3'>
            <DataTable
              loading={loading}
              loadingIcon={<CustomTableLoading/>}
              className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap'
              removableSort
              // filters={filters}
              size='small'
              // emptyMessage={renderCustomEmptyMsg}
              scrollable
              scrollHeight="50vh"
              showGridlines
              stripedRows
              paginator
              rows={10}
              // rowsPerPageOptions={[10, 25, 50, 100]}
              value={dataMaterialsByDNInquery}
              // dataKey="id"
              // onFilter={(e) => setFilters(e.filters)}
              filterDisplay="row"
              // loading={loading}
            >
              <Column className='' header="No" body={(rowBody, {rowIndex})=>rowIndex+1}/>
              <Column className='' field='materialNo'  header="Material No"/>
              <Column className='' field='description'  header="Material Description"/>
              <Column className='' field='address'  header="Rack Address"/>
              <Column className='' field='reqQuantity' header="Req. Qty"/>
              <Column className='' field='receivedQuantity'  header="Act. Qty" body={recQtyBodyTemplate}/>
              <Column className='' field='remain'  header="Remain" body={remainBodyTemplate}/>
              <Column className='' field='status'  header="Status" body={statusQtyBodyTemplate}/>
            </DataTable>
          </CRow>
          <CRow className='mt-3 px-3'>
            <CButton disabled={!showModalInput.enableSubmit} onClick={handleSaveChangesMaterials} color='success' className='text-white w-100'>Save changes</CButton>
          </CRow>
          </CModalBody>
          
        </CModal>
       
    </CContainer>
  )
}

export default Book