import axios from 'axios'
import config from '../utils/config'

const useReceivingDataService = () => {
    const BACKEND_URL = config.BACKEND_URL

    const getReceivingData = async() => {
        try {
            const response = await axios.get(`${BACKEND_URL}/`)
            return response
        } catch (error) {
            throw error
        }
    }

    const uploadExcelReceivingData = async() => {
        try {
            const response = await axios.post(`${BACKEND_URL}/`)
            return response
        } catch (error) {
            throw error
        }
    }

    return{
        getReceivingData,
        uploadExcelReceivingData
    }
}

export default useReceivingDataService