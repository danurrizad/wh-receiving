import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Schedule = React.lazy(() => import('./views/schedule/Schedule2'))
const Receiving = React.lazy(() => import('./views/receiving/Receiving2'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/schedule', name: 'Schedule', element: Schedule },
  { path: '/receiving', name: 'Receiving', element: Receiving },
]

export default routes
