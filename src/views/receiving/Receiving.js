import React, { useState, useEffect, useRef} from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import { CButton, CButtonGroup, CCard, CCardBody, CCardHeader, CCardTitle, CCol, CContainer, CFormInput, CFormLabel, CFormText, CInputGroup, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CToaster } from '@coreui/react'
import { dataReceivingDummy } from '../../utils/DummyData'
import Select from 'react-select'
import Pagination from '../../components/Pagination'
import TemplateToast from '../../components/TemplateToast'
import { handleExport } from '../../utils/ExportToExcel'

const Receiving = () => {
  const [ dataReceiving, setDataReceiving ] = useState(dataReceivingDummy)
  const [ showModalUpdate, setShowModalUpdate] = useState(false)
  const [ materialByDN, setMaterialByDN ] = useState({
    dn_no: "",
    // list_material_desc: [],
    material_desc: "",
    // list_rack_address: [],
    rack_address: "",
    list: {
      material_desc: [],
      rack_address: [],
    },
    actual_qty: "",
  })

  const [toast, addToast] = useState()
  const toaster = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems =
    dataReceiving.length > 0
          ? dataReceiving.slice(indexOfFirstItem, indexOfLastItem)
          : dataReceiving.slice(indexOfFirstItem, indexOfLastItem)

  useEffect(()=>{
     const currentItems = dataReceiving.length > 0
        ? dataReceiving.slice(indexOfFirstItem, indexOfLastItem)
        : dataReceiving.slice(indexOfFirstItem, indexOfLastItem)
  }, [currentPage])

  const options = [
    // { value: 'all', label: 'All' },
    { value: 'Shortage', label: 'Shortage' },
    { value: 'Optimal', label: 'Optimal' },
  ]

  const [ showCard, setShowCard ] = useState({
    schedule: true,
    receiving: true
  })

  const getDataReceiving = () => {
    setDataReceiving(dataReceivingDummy)
  }

 

  const handleFilterReceiving = (selectedOption) => {
    if (!selectedOption) {
      // If no option selected, reset to all data
      setDataReceiving(dataReceivingDummy);
    } else {
      // Filter based on the selected status
      const filtered = dataReceivingDummy.filter(
        (item) => item.status === selectedOption.value
      );
      setDataReceiving(filtered);
    }
  }
 
  
  
  const handleSubmitReceiving = (data) => {
    console.log("data to be submitted :", data)
    setDataReceiving(dataReceivingDummy)
    setMaterialByDN({
      dn_no: "",
      // list_material_desc: [],
      material_desc: "",
      // list_rack_address: [],
      rack_address: "",
      list: {
        material_desc: [],
        rack_address: [],
      },
      actual_qty: "",
    })
    addToast(TemplateToast("success", "success", "Data receiving has been submitted!"))
  }
  
  const optionsSelectDN = Array.from(
    new Set(dataReceivingDummy.map((data) => data.dn_no))
  ).map((uniqueValue) => {
    return {
      value: uniqueValue,
      label: uniqueValue,
    };
  });
  
  // const optionsSelectMaterial = ['tes']
  const optionsSelectMaterial = materialByDN?.list?.material_desc?.map(
    (data)=>{
      return{
        label: data, 
        value: data
      } 
  })


    // const finalOptionsSelectRack = ['tessssss']
    const optionsSelectRack = dataReceivingDummy.flatMap((data) => {
      if (data.material_desc === materialByDN.material_desc) {
        if (data.rack_address !== "") {
          // If the material has a rack_address, use it
          return {
            label: data.rack_address,
            value: data.rack_address,
          };
        } else {
          // If rack_address is empty, return all unique rack_address from dataReceivingDummy
          return Array.from(
            new Set(
              dataReceivingDummy
                .map((item) => item.rack_address)
                .filter((rack) => rack !== "") // Filter out empty rack addresses
            )
          ).map((uniqueRack) => ({
            label: uniqueRack,
            value: uniqueRack,
          }));
        }
      }
      return []; // No match, return an empty array
    });
    
    

  const handleChangeInputDN = (e) => {
    if(e){
      const listSelectedData = dataReceivingDummy.filter((data)=>data.dn_no === e.value)
      // console.log("list selected data :", listSelectedData)
      // setMaterialByDN({ ...materialByDN, dn_no: e.value, list_material_desc: listSelectedData.map((data)=>data.material_desc), list_rack_address: listSelectedData.map((data)=>data.rack_address)})
      setMaterialByDN({ ...materialByDN, dn_no: e.value, list: {material_desc: listSelectedData.map((data)=>data.material_desc), rack_address: listSelectedData.map((data)=>data.rack_address)} })
    } else{
      setMaterialByDN({ ...materialByDN, dn_no: "", list: { material_desc: [], rack_address: []}, material_desc: "", rack_address: ""})
      
    }
  }

  const handleChangeInputMaterial = (e) => {
    if(e){
      setMaterialByDN({ ...materialByDN, material_desc: e.value})
    } else{
      setMaterialByDN({ ...materialByDN, material_desc: ""})
    }
  }

  const handleChangeInputRack = (e) => {
    if(e){
      setMaterialByDN({ ...materialByDN, rack_address: e.value})
    } else{
      setMaterialByDN({ ...materialByDN, rack_address: ""})
    }
  }

  
  useEffect(()=>{
    getDataReceiving()
    console.log("materialDN :", materialByDN)
  }, [materialByDN])

  return (
    <CContainer fluid>
        <CToaster className="p-3" placement="top-end" push={toast} ref={toaster} />
        <CRow>
            <CCard className='p-0'>
                <CCardHeader>
                    <CCardTitle>INPUT</CCardTitle>
                </CCardHeader>
                <CCardBody>
                  <CRow className='mb-3'>
                    <CCol md={4}>
                        <CFormText>DN No</CFormText>
                        <Select isClearable value={optionsSelectDN.find(option => option.value === materialByDN.dn_no) || null} options={optionsSelectDN} onChange={handleChangeInputDN} className='w-100' placeholder='Search DN No'/>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={4}>
                        <CFormText>Material</CFormText>
                        <Select isClearable isDisabled={materialByDN.dn_no===""} value={optionsSelectMaterial.find(option => option.value === materialByDN.material_desc) || null} options={optionsSelectMaterial} onChange={handleChangeInputMaterial} className='w-100' placeholder='Select material'/>
                    </CCol>
                    <CCol md={4} className='pt-md-0 pt-3'>
                      <CFormText>Rack Address</CFormText>
                      <Select isClearable isDisabled={materialByDN.dn_no===""} value={optionsSelectRack.find(option => option.value === materialByDN.rack_address) || null} options={optionsSelectRack} onChange={handleChangeInputRack} className='w-100' placeholder='Select rack address'/>
                    </CCol>
                    <CCol md={2} xs={6} className='pt-md-0 pt-3'>
                      <CFormText>Quantity</CFormText>
                        <CInputGroup>
                          <CFormInput type='number' inputMode='numeric' disabled={materialByDN.dn_no === ''} value={materialByDN.actual_qty} onChange={(e)=>setMaterialByDN({...materialByDN, actual_qty: e.target.value})}/>
                        </CInputGroup>
                    </CCol>
                    <CCol md={2} xs={6} className='d-flex justify-content-end align-items-end'>
                      <CButton 
                        disabled={materialByDN.dn_no === "" || materialByDN.material_desc === "" || materialByDN.rack_address === ""} 
                        onClick={()=>handleSubmitReceiving(materialByDN)} 
                        // color={`${materialByDN.dn_no === "" || materialByDN.material_desc === "" || materialByDN.rack_address === "" ? "warning" : "success"}`} 
                        color='success'
                        style={{color: 'white'}} 
                        className='flex-grow-0 d-flex align-items-center gap-2'
                        >
                          { materialByDN.dn_no === "" || materialByDN.material_desc === "" || materialByDN.rack_address === "" ? <CIcon icon={icon.cilX}/> : <CIcon icon={icon.cilCheckAlt}/>}
                          <div style={{border: "0.5px solid white", height: "10px", width: "2px"}}></div>
                          <span>Submit</span>
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardBody>
            </CCard>
        </CRow>
        <CRow className='pt-4'>
          <CCard className='p-0'>
            <CCardHeader>
              <CCardTitle>RECEIVING DATA</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs='auto'>
                  <CButton color='info' style={{color: 'white'}} onClick={()=>setShowModalUpdate(true)} className='flex-grow-0 d-flex align-items-center gap-2'>
                    <CIcon icon={icon.cilCloudUpload}/>
                    <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                    <span>Upload a File</span>
                  </CButton>
                </CCol>
                <CCol>
                  <CButton onClick={()=>handleExport(dataReceiving, 'receiving')} color='success' style={{color: 'white'}} className='flex-grow-0 d-flex align-items-center gap-2'>
                    <CIcon icon={icon.cilCloudDownload}/>
                    <div style={{border: "0.5px solid white", height: "10px", width: "1px"}}></div>
                    <span>Export to File</span>
                  </CButton>
                </CCol>
              </CRow>
              <CRow className='p-2 pt-3'>
                <CTable bordered>
                  <CTableHead color='light'>
                    <CTableRow>
                      <CTableHeaderCell>DN No</CTableHeaderCell>
                      <CTableHeaderCell>Material No</CTableHeaderCell>
                      <CTableHeaderCell>Material Description</CTableHeaderCell>
                      <CTableHeaderCell>Rack Address</CTableHeaderCell>
                      <CTableHeaderCell>Planning Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Actual Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Difference</CTableHeaderCell>
                      <CTableHeaderCell>Date</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    { dataReceiving.map((data, index)=>{
                      return(
                        <CTableRow key={index} color={`${data.difference !== 0 ? "danger" : ""}`}>
                        {/* <CTableRow key={index} style={{ backgroundColor: `${data.difference !== 0 ? "red" : ""}`}}> */}
                          <CTableDataCell>{data.dn_no}</CTableDataCell>
                          <CTableDataCell>{data.material_no}</CTableDataCell>
                          <CTableDataCell>{data.material_desc}</CTableDataCell>
                          <CTableDataCell>{data.rack_address}</CTableDataCell>
                          <CTableDataCell>{data.req_qty}</CTableDataCell>
                          <CTableDataCell>{data.actual_qty}</CTableDataCell>
                          <CTableDataCell>{data.difference}</CTableDataCell>
                          <CTableDataCell>{data.date}</CTableDataCell>
                        </CTableRow>
                      )
                    })}
                    { dataReceiving.length === 0 && (
                      <CTableRow>
                        <CTableDataCell colSpan={10} style={{ opacity: "50%"}}>
                          <div className='d-flex flex-column align-items-center justify-content-center py-4'>
                            <CIcon icon={icon.cilInbox} size='4xl'/>
                            <span>Data not found</span>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CRow>
            </CCardBody>
          </CCard>
        </CRow>

        {/* Modal Upload File */}
        <CModal 
          visible={showModalUpdate}
          onClose={() => setShowModalUpdate(false)}
        >
          <CModalHeader>
            <CModalTitle>Upload Receiving Data</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow className=''>
              <CInputGroup className='d-flex flex-column'>
                <CFormLabel>File Excel (.xlsx)</CFormLabel>
                <CFormInput className='w-100' type='file'/>
              </CInputGroup>
            </CRow>

          </CModalBody>
          <CModalFooter>
            <CButton onClick={()=>setShowModalUpdate(false)} color="secondary">Close</CButton>
            <CButton color="success" style={{color: "white"}}>Upload</CButton>
          </CModalFooter>
        </CModal>
    </CContainer>
  )
}

export default Receiving