import React,{useState,Suspense} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import 'primereact/resources/themes/nano/theme.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
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
} from '@coreui/react'

const VendorSetup = () => {
     const [dnsetup, setDnsetup] = useState([])
      const [modalUpload, setModalUpload] = useState(false)
      const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
      const [loadingImport, setLoadingImport] = useState(false)
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
  return (
    <CContainer fluid>
        <CRow className=''>
            <CCard className='p-0'>
                <CCardHeader>
                    <CCardTitle className="text-center">Vendor Schedule Data</CCardTitle>
                </CCardHeader>
                <CCardBody>
                <CRow>
                <CCol xs={12} sm={12} md={8} lg={8} xl={8}>
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
                    </CRow>
                    <CTable bordered responsive className='mt-3'>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>No</CTableHeaderCell>
                                <CTableHeaderCell>Vendor Code</CTableHeaderCell>
                                <CTableHeaderCell>Vendor Name</CTableHeaderCell>
                                <CTableHeaderCell>Day</CTableHeaderCell>
                                <CTableHeaderCell>Arrival Time</CTableHeaderCell>
                                <CTableHeaderCell>Departure Time</CTableHeaderCell>
                                <CTableHeaderCell>Rit</CTableHeaderCell>
                                <CTableHeaderCell>Plant</CTableHeaderCell>
                                <CTableHeaderCell>Truck Station</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow>
                                
                            </CTableRow>
                        </CTableBody>
                    </CTable>
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

export default VendorSetup