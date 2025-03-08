import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import CustomTableLoading from './LoadingTemplate'

// routes config
import routes from '../routes'
import LoadingTWIIS from './LoadingTWIIS'

const AppContent = () => {
  return (
    <CContainer className="px-4 mb-4" style={{ flex: 1}} fluid>
      <Suspense 
        fallback={
        <div style={{ height: "100vh"}}>
          {/* <CustomTableLoading /> */}
          <LoadingTWIIS/>
        </div>
        }>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
