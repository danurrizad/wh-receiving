import React,{useState,Suspense, useEffect} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { Button } from 'primereact/button'
import 'primereact/resources/themes/nano/theme.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
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

const DNSetup = () => {
  const [loading, setLoading] = useState(true);
  const addToast = useToast()
  const { getDNByDateData, getAllWarehouseData } = useReceivingDataService()
  const { getMasterData, uploadMasterData } = useMasterDataService()
  const [dataDN, setDataDN] = useState([])
  const [optionsWarehouse, setOptionsWarehouse] = useState({})
  const [filterQuery, setFilterQuery] = useState({
    date: new Date('2024-01-16'),
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [modalUpload, setModalUpload] = useState(false)
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
  const [loadingImport, setLoadingImport] = useState(false)
  const [uploadData, setUploadData] = useState({
    importDate: new Date().toLocaleDateString('en-CA'),
    file: ""
  })
  
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

  const getDNbyDate = async(importedDate) => {
    try {
      setLoading(true)
      // console.log("Imported Date :", importedDate)
      const dateFormat = importedDate !== null && importedDate !== "" ? importedDate.toLocaleDateString('en-CA') : importedDate
      console.log("dateFormat :", dateFormat)
      const response = await getDNByDateData(dateFormat)
      // console.log(response.data)
      setDataDN(response.data.data)

    } catch (error) {
      console.error(error)
      setDataDN([])
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    getDNbyDate(filterQuery.date)
  }, [filterQuery.date])

  const onGlobalFilterChange = (e) => {
    const value = e;
    let _filters = { ...filterQuery };

    _filters['global'].value = value;

    setFilterQuery(_filters);
    setGlobalFilterValue(value);
};
  

  const uploadDN = async(warehouseId, bodyForm) => {
    try {
      const response = await uploadMasterData(`upload-delivery-note/${warehouseId}`, bodyForm)
      addToast(response.data.mess)
      setModalUpload(false)
      setFilterQuery({
        ...filterQuery,
        date: uploadData.importDate
      })
      setUploadData({
        file: "",
        importDate: "",
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleUploadFileDN = async(file, importDate) => {
    try {
      setLoadingImport(true)
      // console.log("file :", file)
      // console.log("date :", importDate)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('importDate', importDate)
      // console.log("formData :", formData)

      // Log FormData contents
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
      }

      const response = await uploadDN(optionsWarehouse.selected, formData)
      console.log("Response upload :", response)  
      // addToast(TemplateToast("success", "success", response.message))
      // addToast("File uploaded", 'success', 'success')

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
      xlsx.utils.book_append_sheet(workbook, worksheet, 'material')

      // Tulis workbook ke dalam buffer array
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })

      // Panggil fungsi untuk menyimpan file Excel
      saveAsExcelFile(excelBuffer, 'master_data_material')
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
      <div className='w-100 d-flex flex-column align-items-center justify-content-center py-3' style={{ color: "black", opacity: "50%"}}>
        <FaInbox size={40}/>
        <p>DN Data Not Found!</p>
      </div>
    )
  }

  return (
    <CContainer fluid>
      <CRow>
        <CCard className='p-0 mb-4'>
          <CCardHeader>
          <CCardTitle className="text-center">Delivery Note Data</CCardTitle>
          </CCardHeader>
          <CCardBody>
            <CRow className='d-flex align-items-end justify-content-between'>
              <CCol>
                <div className="d-flex flex-wrap justify-content-start">
                  <Button
                  type="button"
                  label="Upload Data "
                  icon="pi pi-file-import"
                  severity="primary"
                  className="rounded-4 me-2 mb-1 text-white"
                  onClick={showModalUpload}
                  data-pr-tooltip="XLS"
                      /> 
                      <Button
                    type="button"
                    label="Export To Excel"
                    icon="pi pi-file-excel"
                    severity="success"
                    className="rounded-4 me-2 mb-1 text-white"
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
                  <CFormText>Filter by Import Date</CFormText>
                  <DatePicker 
                    value={filterQuery.date ? filterQuery.date : null} 
                    placeholder="All time"
                    onChange={(e)=>{
                      console.log(e)
                      setFilterQuery({ ...filterQuery, date: e !== null ? e : ""})
                    }} />
                </div>
              </CCol>
            </CRow>
            <CRow className='mt-4'>
              <DataTable 
                className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap' 
                loading={loading} 
                emptyMessage={renderCustomEmptyMsg} 
                filters={filterQuery}
                value={dataDN} 
                scrollable 
                scrollHeight="500px" 
                showGridlines  
                paginator 
                rows={10} 
                rowsPerPageOptions={[10, 25, 50, 100]} 
                tableStyle={{ minWidth: '50rem' }}
              >
                <Column field="no" header="No" body={(rowData, { rowIndex }) => rowIndex + 1}></Column>
                <Column field="dnNumber" header="DN No"></Column> 
                <Column field="materialNo" header="Material No"></Column>
                <Column field="description" header="Material Desc"></Column>
                <Column field="addressRackName" header="Rack Address"></Column>
                <Column field="planningQuantity" header="Req. Qty"></Column>
                <Column field="uom" header="UoM"></Column>
                <Column field="arrivalPlanDate" header="Arrival Date Plan"></Column>
                <Column field="importBy" header="Import By"></Column>
                <Column field="importDate" header="Import Date"></Column>
            </DataTable>


            </CRow>
            <CModal visible={modalUpload} onClose={() => setModalUpload(false)}>
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