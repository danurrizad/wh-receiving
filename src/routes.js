import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const SummaryMaterials = React.lazy(()=> import('./views/dashboard/Summary'))
const Schedule = React.lazy(() => import('./views/input/Input'))
const InputVendor = React.lazy(() => import('./views/inputVendor/InputVendor'))
const Book = React.lazy(() => import('./views/logbook/Inquiry'))
const VendorSetup = React.lazy(() => import('./views/setup/VendorSetup'))
const DNSetup = React.lazy(() => import('./views/setup/DNSetup'))
const InputRequirement = React.lazy(() => import('./views/requirement/InputReq'))
const InputRequirementConsumable = React.lazy(() => import('./views/requirement/InputReqConsumable'))
const InputRequirementChemical = React.lazy(() => import('./views/requirement/InputReqChemical'))
const InqueryRequirment = React.lazy(() => import('./views/requirement/InqueryReq'))
const TrackRecord = React.lazy(() => import('./views/record/TrackRecord'))
const MapTruck = React.lazy(() => import('./views/dashboard/Map'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard Vendor', element: Dashboard },
  { path: '/summary', name: 'Dashboard Materials', element: SummaryMaterials },
  { path: '/input', name: 'Schedule', element: Schedule },
  { path: '/input-vendor', name: 'InputVendor', element: InputVendor },
  { path: '/inquiry', name: 'Book', element: Book },
  { path: '/setup/vendor', name: 'Vendor Setup', element: VendorSetup },
  { path: '/setup/dn', name: 'DN Setup', element: DNSetup },
  { path: '/vendor/input/requirement', name: 'Input Requirment', element: InputRequirement },
  { path: '/vendor/input/requirement-consumable', name: 'Input Requirement Consumable', element: InputRequirementConsumable },
  { path: '/vendor/input/requirement-chemical', name: 'Input Requirement Chemical', element: InputRequirementChemical },
  { path: '/vendor/inquiry/requirement', name: 'Inquiry Requirement', element: InqueryRequirment },
  { path: '/vendor/track-record', name: 'Track Record', element: TrackRecord },
  { path: '/dashboard/map-truck', name: 'Map Truck', element: MapTruck }

  
]

export default routes
