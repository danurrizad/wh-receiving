import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Schedule = React.lazy(() => import('./views/schedule/Schedule'))
const VendorSetup = React.lazy(() => import('./views/setup/VendorSetup'))
const DNSetup = React.lazy(() => import('./views/setup/DNSetup'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/input', name: 'Schedule', element: Schedule },
  { path: '/setup/vendor', name: 'Vendor Setup', element: VendorSetup },
  { path: '/setup/dn', name: 'DN Setup', element: DNSetup },
]

export default routes
