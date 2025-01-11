import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div className='text-center w-100'>
        <span className="ms-1">&copy; 2025 DX Warehouse</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
