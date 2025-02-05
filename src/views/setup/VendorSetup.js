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
  CFormText,
} from '@coreui/react'
import { FaInbox } from 'react-icons/fa6'
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
          console.log("response :", response)
          console.log("response schedule:", response.data.data)
          setDataSchedule(response.data.data)
        } catch (error) {
          console.error(error)
          setDataSchedule([])
        } finally{
          setLoading(false)
        }
      }
      
      const [loading, setLoading] = useState(true);
      const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        day: "",
        plant: "",
      });
      const [globalFilterValue, setGlobalFilterValue] = useState('');
      const [days] = useState(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
      const [plants] = useState(['Karawang 1', 'Karawang 2', 'Karawang 3', 'Sunter 1', 'Sunter 2']);
      
      const getDays = (day) => {
        switch (day) {
          case 'Sunday':
            return 0
          case 'Monday':
            return 1
          case 'Tuesday':
            return 2
          case 'Wednesday':
            return 3
          case 'Thursday':
            return 4
          case 'Friday':
            return 5
          case 'Saturday':
            return 6
          case '':
            return ''
          case 0:
            return 'Sunday'
          case 1:
            return 'Monday'
          case 2:
            return 'Tuesday'
          case 3:
            return 'Wednesday'
          case 4:
            return 'Thursday'
          case 5:
            return 'Friday'
          case 6:
            return 'Saturday'
        }
      } 

      const getPlantId = (plant) => {
        switch (plant) {
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
        const value = e.target.value;
        console.log(e.target.value)
        let _filters = { ...filters };
    
        _filters['global'].value = value;
    
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

      useEffect(()=>{
        getScheduleAll(getPlantId(filters.plant), getDays(filters.day))
      }, [filters.day, filters.plant])


      const exportExcel = () => {
        import('xlsx').then((xlsx) => {
          const mappedData = dataSchedule.map((item) => ({
            "Vendor Code": item.Supplier.supplierCode,
            "Vendor Name": item.Supplier.SupplierName,
            "Day": getDays(item.schedule),
            "Arrival Time": formatTime(item.arrival),
            "Departure Time": formatTime(item.departure),
            "Rit": item.rit,
            "Plant": item.Plant.PlantName,
            "Truck Station": item.truckStation,
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
        }
      }

      const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      };

  
    const renderCustomEmptyMsg = () => {
        return(
          <div className='w-100 d-flex flex-column align-items-center justify-content-center py-3' style={{ color: "black", opacity: "50%"}}>
            <FaInbox size={40}/>
            <p>Schedules Data Not Found!</p>
          </div>
        )
      }

  return (
    <CContainer fluid>
      <CRow className=''>
          <CCard className='p-0 mb-3'>
              <CCardHeader>
                  <CCardTitle className="text-center">Vendor Schedule Data</CCardTitle>
              </CCardHeader>
              <CCardBody>
              <CRow>
                <CCol className='d-flex align-items-center'>
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
                </CCol>
              </CRow>
              <CRow className='mb-3'>
                <CCol xs={8}>
                  <CFormText>Search</CFormText>
                  <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder='Keyword search' style={{ borderRadius: '5px', padding: "5.5px"}}/>
                </CCol>
                <CCol xs={2}>
                  <CFormText>Filter by Plant</CFormText>
                  <Dropdown
                    value={filters.plant}
                    options={plants}
                    onChange={
                      (e) => {
                        console.log(e)
                        if(e.value !== undefined){
                          setFilters({
                            ...filters,
                            plant: e.value 
                          })
                        } else{
                          setFilters({
                            ...filters,
                            plant: "" 
                          })
                        }
                      }
                    }
                    placeholder="All plant"
                    className="p-column-filter mb-2"
                    showClear
                    style={{ width: '100%', borderRadius: '5px' }}
                  />
                </CCol>
                <CCol xs={2}>
                  <CFormText>Filter by Day</CFormText>
                  <Dropdown
                    value={filters.day}
                    options={days}
                    onChange={
                      (e) => {
                        if(e.value !== undefined){
                          setFilters({
                            ...filters,
                            day: e.value
                          })
                        } else{
                          setFilters({
                            ...filters,
                            day: ""
                          })
                        }
                      }
                    }
                    placeholder="All day"
                    className="p-column-filter mb-2"
                    showClear
                    style={{ width: '100%', borderRadius: '5px' }}
                  />
                </CCol>
              </CRow>
              <DataTable
                className='p-datatable-gridlines p-datatable-sm custom-datatable text-nowrap'
                removableSort
                filters={filters}
                size='small'
                emptyMessage={renderCustomEmptyMsg}
                scrollable
                scrollHeight="500px"
                showGridlines
                paginator
                rows={10}
                rowsPerPageOptions={[10, 25, 50, 100]}
                value={dataSchedule}
                dataKey="id"
                onFilter={(e) => setFilters(e.filters)}
                filterDisplay="row"
                loading={loading}
              >
                <Column className='' header="No" body={(rowData, { rowIndex }) => rowIndex + 1} />
                <Column className='' field='Supplier.supplierCode' sortable header="Vendor Code" />
                <Column className='' field='Supplier.SupplierName' filterField='Supplier.SupplierName' sortable header="Vendor Name" />
                <Column className='' field="schedule" filterField='schedule' sortable header="Day" body={(rowData) => getDays(rowData.schedule)} />
                <Column className='' field="arrival" sortable header="Arrival Time" dataType="date" body={(rowData) => formatTime(rowData.arrival)} />
                <Column className='' field="departure" sortable header="Departure Time" dataType="date" body={(rowData) => formatTime(rowData.departure)} />
                <Column className='' field="rit" sortable header="Rit" dataType="number" />
                <Column className='' field="Plant.PlantName" sortable header="Plant" />
                <Column className='' field="truckStation" sortable header="Truck Station" />
              </DataTable>
                  


              {/* ---------------------------------------------------------------------MODAL----------------------------------------------------------------------------- */}
              <CModal visible={modalUpload} onClose={() => setModalUpload(false)}>
                <CModalHeader>
                  <CModalTitle id="LiveDemoExampleLabel">Upload Vendor Schedule</CModalTitle>
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
                      disabled
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
                    <CButton color="success" className='text-white' onClick={() => handleUploadFileSchedule(uploadData.file, uploadData.importDate)}>
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