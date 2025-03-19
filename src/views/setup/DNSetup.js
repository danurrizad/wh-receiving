import React,{useState,Suspense, useEffect} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { Button } from 'primereact/button'
import Flatpickr from 'react-flatpickr'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CSpinner,
  CFormLabel,
  CContainer,
  CCardTitle,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CFormText,
} from '@coreui/react'
import { FaInbox } from 'react-icons/fa6'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DatePicker, Input } from 'rsuite';

import useReceivingDataService from '../../services/ReceivingDataServices'
import useMasterDataService from '../../services/MasterDataService'
import { FilterMatchMode } from 'primereact/api'
import { InputText } from 'primereact/inputtext'
import Select  from 'react-select';
import { useToast } from '../../App'
import CustomTableLoading from '../../components/LoadingTemplate'
import { MultiSelect } from 'primereact/multiselect'

const DNSetup = () => {
  const colorMode = localStorage.getItem('coreui-free-react-admin-template-theme')
  const [loading, setLoading] = useState(true);
  const addToast = useToast()
  const { getDNByDateData, getAllWarehouseData } = useReceivingDataService()
  const { getMasterData, uploadMasterData } = useMasterDataService()
  const [dataDN, setDataDN] = useState([])
  const [optionsWarehouse, setOptionsWarehouse] = useState({})
  const [filterQuery, setFilterQuery] = useState({
    // date: new Date('2024-01-16'),
    date: "",
    dateArrival: new Date(),
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [ visibleColumns, setVisibleColumns ] = useState([])
  const [modalUpload, setModalUpload] = useState(false)
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
  const [loadingImport, setLoadingImport] = useState(false)
  const [uploadData, setUploadData] = useState({
    importDate: new Date().toLocaleDateString('en-CA'),
    file: ""
  })
  
  const columns = [
    {
      field: 'importBy',
      header: 'Imported By',
      sortable: true,
    },
    {
      field: 'importDate',
      header: 'Imported Date',
      sortable: true,
    },
    // {
    //   field: 'discrepancy',
    //   header: 'Discrepancy',
    //   sortable: true,
    // },
  ]

  const getOptionsWarehouse = async() => {
    try {
      const response = await getMasterData('warehouse-public') 
      setOptionsWarehouse({
        ...optionsWarehouse,
        list: response.data.map((data)=>{
          return{
            value: data.id,
            label: data.warehouseName
          }
        })
    })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    getOptionsWarehouse()
  }, [])

  const getDNbyDate = async(importedDate, dateArrival) => {
    try {
      setLoading(true)
      const dateFormat = importedDate !== null && importedDate !== "" ? importedDate.toLocaleDateString('en-CA') : importedDate
      const arrivalDateFormat = dateArrival !== null && dateArrival !== "" ? dateArrival.toLocaleDateString('en-CA') : dateArrival
      const response = await getDNByDateData(dateFormat, arrivalDateFormat)
      setDataDN(response.data.data)

    } catch (error) {
      console.error(error)
      setDataDN([])
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    getDNbyDate(filterQuery.date, filterQuery.dateArrival)
  }, [filterQuery.date, filterQuery.dateArrival])

  const onGlobalFilterChange = (e) => {
    const value = e;
    let _filters = { ...filterQuery };

    _filters['global'].value = value;

    setFilterQuery(_filters);
    setGlobalFilterValue(value);
};

const onColumnToggle = (event) => {
  let selectedColumns = event.value
  let orderedSelectedColumns = columns.filter((col) =>
    selectedColumns.some((sCol) => sCol.field === col.field),
  )
  setVisibleColumns(orderedSelectedColumns)
}

const header = () => (
  <MultiSelect
    value={visibleColumns}
    options={columns}
    optionLabel="header"
    onChange={onColumnToggle}
    className="w-full sm:w-20rem mb-2 mt-2"
    display="chip"
    placeholder="Show Hidden Columns"
    style={{ borderRadius: '5px' }}
  />
)

  

  const uploadDN = async(warehouseId, bodyForm) => {
    try {
      const response = await uploadMasterData(`upload-delivery-note/${warehouseId}`, bodyForm)
      setModalUpload(false)
      if(response.data.errors){
        response.data.errors.map((errs)=>{
          addToast(errs.error, 'danger', 'error')
        })
      }else{
        addToast(response.data.message, 'success', 'success')
        setFilterQuery({
          ...filterQuery,
          date: new Date(uploadData.importDate)
        })
        setUploadData({
          file: "",
          importDate: "",
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      getDNbyDate(filterQuery.date, filterQuery.dateArrival)
    }
  }

  const handleUploadFileDN = async(file, importDate) => {
    try {
      setLoadingImport(true)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('importDate', importDate)

      await uploadDN(optionsWarehouse.selected, formData)

    } catch (error) {
      console.log("Error response upload :", error)          
    } finally{
      setLoadingImport(false)
    }
  }

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const mappedData = dataDN.map((item) => ({
        "DN No": item.dnNumber,
        "Material No": item.materialNo,
        "Material Desc": item.description,
        "Rack Address": item.addressRackName,
        "Req. Qty": item.planningQuantity,
        "Arv. Date Plan": item.arrivalPlanDate,
        "Imported By": item.importBy,
        "Imported At": item.importDate,
      }))

      // Deklarasikan worksheet hanya sekali
      const worksheet = xlsx.utils.json_to_sheet(mappedData)
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Delivery Notes Setup')

      // Tulis workbook ke dalam buffer array
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })

      // Panggil fungsi untuk menyimpan file Excel
      saveAsExcelFile(excelBuffer, 'dn_setup')
    })
  }
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate[0])
    setUploadData((prevData) => ({
      ...prevData,
      importDate: selectedDate[0],
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setUploadData((prevData) => ({
      ...prevData,
      file: file,
    }))
  }

  const showModalUpload = () => {
    setModalUpload(true)
  } 

  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        let EXCEL_EXTENSION = '.xlsx'
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        })

        if (fileName === 'template_master_data_material') {
          module.default.saveAs(
            data,
            fileName + '_download_' + new Date().getTime() + EXCEL_EXTENSION,
          )
        } else {
          module.default.saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION,
          )
        }
      }
    })
  }

  const renderCustomEmptyMsg = () => {
    return(
      <div className='empty-msg w-100 d-flex flex-column align-items-center justify-content-center py-3' style={{ color: "black", opacity: "50%"}}>
        <FaInbox size={40}/>
        <p>DN Data Not Found!</p>
      </div>
    )
  }

  return (
    <CContainer fluid>
      <CRow>
        <CCard className='p-0 mb-4' style={{ border: "1px solid #6482AD"}}>
          <CCardHeader style={{ backgroundColor: "rgb(100, 130, 173)", color: "white"}}>
            <CCardTitle className="text-center">DELIVERY NOTE DATA</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow className='d-flex align-items-end justify-content-between'>
              <CCol>
                <div className="d-flex flex-wrap justify-content-start">
                  <Button
                    type="button"
                    label="Upload Data "
                    icon="pi pi-file-import"
                    severity="warning"
                    className="rounded-2 me-2 py-2 mb-1 text-white"
                    onClick={showModalUpload}
                    data-pr-tooltip="XLS"
                  /> 
                  <Button
                    type="button"
                    label="Export To Excel"
                    icon="pi pi-file-excel"
                    severity="success"
                    className="rounded-2 me-2 py-2 mb-1 text-white"
                    onClick={exportExcel}
                    data-pr-tooltip="XLS"
                  />
                </div>
              </CCol>
              <CCol className='d-flex justify-content-end gap-3'>
                <div>
                  <CFormText>Search</CFormText>
                  <Input value={globalFilterValue} onChange={onGlobalFilterChange} placeholder='Keyword search'/>
                </div>
                <div>
                  <CFormText>Filter by Arrival Plan</CFormText>
                  <DatePicker 
                    format='yyyy-MM-dd'
                    value={filterQuery.dateArrival ? filterQuery.dateArrival : null} 
                    placeholder="All time"
                    placement='bottomEnd'
                    oneTap
                    onChange={(e)=>{
                      setFilterQuery({ ...filterQuery, dateArrival: e !== null ? e : ""})
                    }} />
                </div>
                { visibleColumns.find((data)=>data.field === 'importDate') && (
                  <div>
                    <CFormText>Filter by Import Date</CFormText>
                    <DatePicker 
                      format='yyyy-MM-dd'
                      value={filterQuery.date ? filterQuery.date : null} 
                      placeholder="All time"
                      placement='bottomEnd'
                      oneTap
                      onChange={(e)=>{
                        setFilterQuery({ ...filterQuery, date: e !== null ? e : ""})
                      }} />
                  </div>
                )}
              </CCol>
            </CRow>
            <CRow className='mt-4 px-2'>
              <CCard className='p-0 overflow-hidden h-100' >
                <CCardBody className="p-0">
                  <DataTable 
                    className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap' style={{minHeight: "340px"}}
                    loading={loading} 
                    header={header}
                    loadingIcon={<CustomTableLoading/>}
                    emptyMessage={renderCustomEmptyMsg} 
                    filters={filterQuery}
                    value={dataDN} 
                    removableSort
                    scrollable 
                    scrollHeight="500px" 
                    showGridlines  
                    stripedRows
                    paginator 
                    rows={10} 
                    rowsPerPageOptions={[10, 25, 50, 100]} 
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    tableStyle={{ minWidth: '50rem' }}
                  >
                    <Column field="no" header="No" body={(rowData, { rowIndex }) => rowIndex + 1}></Column>
                    <Column field="dnNumber" sortable header="DN No"></Column> 
                    <Column field="supplierName" sortable header="Vendor"></Column> 
                    <Column field="materialNo" sortable header="Material No"></Column>
                    <Column field="description" sortable header="Material Desc"></Column>
                    <Column field="addressRackName" sortable header="Rack Address"></Column>
                    <Column field="planningQuantity" sortable header="Req. Qty"></Column>
                    <Column field="uom" sortable header="UoM"></Column>
                    <Column field="arrivalPlanDate" sortable header="Arrival Date Plan"></Column>
                    {/* <Column field="importBy" sortable header="Import By"></Column>
                    <Column field="importDate" sortable header="Import Date"></Column> */}
                    {visibleColumns.map((col, index) => (
                    <Column
                      key={index}
                      field={col.field}
                      header={col.header}
                      body={col.body}
                      sortable={col.sortable}
                      // headerStyle={col.headerStyle}
                      // bodyStyle={col.bodyStyle}
                    />
                  ))}
                  </DataTable>
                </CCardBody>
              </CCard>


            </CRow>
            <CModal visible={modalUpload} onClose={() => setModalUpload(false)} backdrop='static'>
              <CModalHeader>
                <CModalTitle id="LiveDemoExampleLabel">Upload Master Material</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <div className="mb-3">
                  <CFormLabel>Date</CFormLabel>
                  <Flatpickr
                    value={date}
                    options={{
                      dateFormat: 'Y-m-d',
                      maxDate: new Date(),
                      allowInput: true,
                    }}
                    disabled
                    onChange={handleDateChange}
                    className="form-control"
                    placeholder="Select a date"
                  />
                </div>
                <div className='mb-3'>
                  <CFormLabel>Warehouse</CFormLabel>
                  <Select 
                    options={optionsWarehouse.list} 
                    styles={{
                      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                        return {
                          ...styles,
                          backgroundColor: isDisabled
                            ? undefined
                            : isSelected ? "rgb(72, 96, 129)"
                            : isFocused ? "#6482AD"
                            : undefined,
                          color: colorMode === 'dark' && (!isFocused || isSelected) ? "white" : 
                          isFocused ? "white" : 
                          isSelected ? "white" :
                          colorMode === 'light' && (!isFocused) ? "black" : "",
                          ':active': {
                            ...styles[':active'],
                            color: "white",
                            backgroundColor: !isDisabled
                              ? isSelected
                                ? 'rgb(37, 50, 70)'
                                : 'rgb(37, 50, 70)'
                              : undefined,
                          },
                          ':hover': {
                            ...styles[':hover'],
                            color: "white"
                          }
                        };
                      },
                    }}
                    isClearable 
                    value={optionsWarehouse?.list?.find((opt)=>opt.value===optionsWarehouse.selected) || null} 
                    onChange={(e)=>{
                      setOptionsWarehouse({
                        ...optionsWarehouse,
                        selected: e !== null ? e.value : null
                      })
                  }}/>
                </div>
                <div className="mb-3">
                  <CFormInput
                    onChange={handleFileChange} // Handle perubahan file
                    type="file"
                    label="Excel File"
                    accept={[".xlsx", '.xls']} // Hanya menerima file Excel
                  />
                </div>
              </CModalBody>
              <CModalFooter>
          <Suspense
            fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }
          >
            <CButton color="success" disabled={loadingImport || !optionsWarehouse.selected || !uploadData.file} className='text-white' onClick={() => handleUploadFileDN(uploadData.file, uploadData.importDate)}>
              {loadingImport ? (
                <>
                  <CSpinner component="span" size="sm" variant="grow" className="me-2" />
                  Importing...
                </>
              ) : (
                'Import'
              )}
            </CButton>
          </Suspense>
        </CModalFooter>
      </CModal>
          </CCardBody>
        </CCard>
      </CRow>
    </CContainer>
  )
}

export default DNSetup