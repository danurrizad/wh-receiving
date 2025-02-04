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
import { DatePicker } from 'rsuite';

import useReceivingDataService from '../../services/ReceivingDataServices'

const DNSetup = () => {
  const [loading, setLoading] = useState(true);
  const { getDNByDateData } = useReceivingDataService()
  const [dataDN, setDataDN] = useState([])

  const [filterQuery, setFilterQuery] = useState({
    date: new Date('2024-01-16'),
  })
  
  const [dnsetup, setDnsetup] = useState([])
  const [modalUpload, setModalUpload] = useState(false)
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
  const [loadingImport, setLoadingImport] = useState(false)
  

  const getDNbyDate = async(importedDate) => {
    try {
      setLoading(true)
      const dateFormat = importedDate.toISOString().split('T')[0]
      const response = await getDNByDateData(dateFormat)
      console.log(response.data)
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


  
  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const mappedData = dnsetup.map((item) => ({
        dnNo: item.dnNo,
        materialNo: item.materialNo,
        description: item.description,
        addressRack: item.addressRack,
        qtyPlanning: item.qtyPlanning,
        date: item.date,
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
        <CCard className='p-0'>
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
                    label="Import By Excel"
                    icon="pi pi-file-excel"
                    severity="success"
                    className="rounded-4 me-2 mb-1 text-white"
                    onClick={exportExcel}
                    data-pr-tooltip="XLS"
                      />
                </div>
              </CCol>
              <CCol className='d-flex justify-content-end'>
                <div>
                  <CFormText>Filter by Import Date</CFormText>
                  <DatePicker value={filterQuery.date} onChange={(e)=>setFilterQuery({ ...filterQuery, date: e})} />
                </div>
              </CCol>
            </CRow>
            <CRow className='mt-4'>
              <DataTable className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap' loading={loading} emptyMessage={renderCustomEmptyMsg} value={dataDN} scrollable scrollHeight="500px" showGridlines  paginator rows={10} rowsPerPageOptions={[10, 25, 50, 100]} tableStyle={{ minWidth: '50rem' }}>
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
              onChange={handleDateChange}
              className="form-control"
              placeholder="Select a date"
            />
          </div>
          <div className="mb-3">
            <CFormInput
              onChange={handleFileChange} // Handle perubahan file
              type="file"
              label="Excel File"
              accept=".xlsx" // Hanya menerima file Excel
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
            <CButton color="primary" onClick={() => handleImport()}>
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