import React,{useState,Suspense, useRef, useEffect} from 'react'
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
  CToaster,
  CTableDataCell,
} from '@coreui/react'
import useScheduleDataService from '../../services/ScheduleDataService'
import { useToast } from '../../App'
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';


const VendorSetup = () => {
      const addToast = useToast()
      const [dnsetup, setDnsetup] = useState([])
      const [modalUpload, setModalUpload] = useState(false)
      const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
      const [loadingImport, setLoadingImport] = useState(false)
      const [uploadData, setUploadData] = useState({
        file: null,
        importDate: new Date()
      })
      const { getScheduleAllData, uploadFileScheduleData } = useScheduleDataService()
      const [dataSchedule, setDataSchedule] = useState([])

      const getScheduleAll = async(plantId, day) => {
        try {
          const response = await getScheduleAllData(plantId, day)
          console.log("RESPONSE DATA SCHEDULE :", response.data.data)
          setDataSchedule(response.data.data)
        } catch (error) {
          addToast(error, 'error', 'error')
        } finally{
          setLoading(false)
        }
      }

      useEffect(()=>{
        getScheduleAll("", 1)
      }, [])


      const [filters, setFilters] = useState({
        day: { value: null, matchMode: FilterMatchMode.EQUALS },
        plant: { value: null, matchMode: FilterMatchMode.EQUALS },
      });
      const [loading, setLoading] = useState(true);
      const [days] = useState(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
      const [plants] = useState(['Karawang 1', 'Karawang 2', 'Karawang 3', 'Sunter 1', 'Sunter 2']);
      
      const getDays = (days) => {
        switch (days) {
            case 'Sunday':
                return 0;

            case 'Monday':
                return 1;

            case 'Tuesday':
                return 2;

            case 'Wednesday':
                return 3;

            case 'Thursday':
                return 4;

            case 'Friday':
                return 5;

            case 'Saturday':
                return 6;

            case 0:
                return 'Sunday';

            case 1:
                return 'Monday';

            case 2:
                return 'Tuesday';

            case 3:
                return 'Wednesday';

            case 4:
                return 'Thursday';

            case 5:
                return 'Friday';

            case 6:
                return 'Saturday';
        }
    };


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


      const handleUploadFileSchedule = async(file, importDate) => {
        try {
          // console.log("file :", file)
          // console.log("date :", importDate)
          
          const formData = new FormData()
          formData.append('file', file)
          formData.append('importDate', importDate)
          // console.log("formData :", formData)

          // Log FormData contents
            for (let [key, value] of formData.entries()) {
              console.log(`${key} blabla:`, value);
          }

          const response = await uploadFileScheduleData(formData)
          console.log("Response upload :", response)
          // addToast(TemplateToast("success", "success", response.message))
          addToast("File uploaded", 'success', 'success')

        } catch (error) {
          console.log("Error response upload :", error)
          addToast("Upload error!", 'error', 'error')
          
        }
      }

      const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      };

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
                    <DataTable className='py-2 px-1' showGridlines value={dataSchedule} paginator rows={10} dataKey="id" filters={filters} filterDisplay="row" loading={loading} emptyMessage="No schedules found.">
                        <Column field="" header="No" body={(rowData, { rowIndex }) => rowIndex + 1}/>
                        <Column field='Supplier.supplierCode' header="Vendor Code"  />
                        <Column field='Supplier.SupplierName' header="Vendor Name"  />
                        <Column field="schedule" header="Day" body={(rowData) => getDays(rowData.schedule)} />
                        <Column field="arrival" header="Arrival Time" dataType="date" body={(rowData) => formatTime(rowData.arrival)}   />
                        <Column field="departure" header="Departure Time" dataType="date" body={(rowData) => formatTime(rowData.departure)}  />
                        <Column field="rit" header="Rit" dataType="number"   />
                        <Column field="Plant.PlantName" header="Plant" />
                        <Column field="truckStation" header="Truck Station"   />
                    </DataTable>
                    {/* <CTable bordered responsive className='mt-3'>
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
                          { dataSchedule?.map((data, index)=>{
                            const dateArrival = new Date(data.arrival) 
                            const timeArrival = dateArrival.toISOString().substring(11, 19);
                            
                            const dateDeparture = new Date(data.departure)
                            const timeDeparture = dateDeparture.toISOString().substring(11, 19);
                            
                            return(
                            <CTableRow key={index}>
                                <CTableDataCell>{index+1}</CTableDataCell>
                                <CTableDataCell>{data.Supplier.supplierCode}</CTableDataCell>
                                <CTableDataCell>{data.Supplier.SupplierName}</CTableDataCell>
                                <CTableDataCell>{data.schedule}</CTableDataCell>
                                <CTableDataCell>{timeArrival}</CTableDataCell>
                                <CTableDataCell>{timeDeparture}</CTableDataCell>
                                <CTableDataCell>{data.rit}</CTableDataCell>
                                <CTableDataCell>{data.Plant.PlantName}</CTableDataCell>
                                <CTableDataCell>{data.truckStation}</CTableDataCell>
                            </CTableRow>
                            )
                          })}
                        </CTableBody>
                    </CTable> */}
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
                             {/* <CButton color="primary" onClick={() => handleImport()}> */}
                             <CButton color="primary" onClick={() => handleUploadFileSchedule(uploadData.file, uploadData.importDate)}>
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