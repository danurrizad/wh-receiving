import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Schedule = React.lazy(() => import('./views/input/Input'))
const Book = React.lazy(() => import('./views/logbook/Inquiry'))
const VendorSetup = React.lazy(() => import('./views/setup/VendorSetup'))
const DNSetup = React.lazy(() => import('./views/setup/DNSetup'))
const InputRequirment = React.lazy(() => import('./views/requirement/InputReq'))
const InqueryRequirment = React.lazy(() => import('./views/requirement/InqueryReq'))
const TrackRecord = React.lazy(() => import('./views/record/TrackRecord'))
const MapTruck = React.lazy(() => import('./views/dashboard/Map'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/input', name: 'Schedule', element: Schedule },
  { path: '/inquiry', name: 'Book', element: Book },
  { path: '/setup/vendor', name: 'Vendor Setup', element: VendorSetup },
  { path: '/setup/dn', name: 'DN Setup', element: DNSetup },
  { path: '/vendor/input/requirement', name: 'Input Requirment', element: InputRequirment },
  { path: '/vendor/inquery/requirement', name: 'Inquery Requirment', element: InqueryRequirment },
  { path: '/vendor/track-record', name: 'Track Record', element: TrackRecord },
  { path: '/dashboard/map-truck', name: 'Map Truck', element: MapTruck }

  
]

export default routes
