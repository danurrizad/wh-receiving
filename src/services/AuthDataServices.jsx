import axiosInstance from "../utils/AxiosInstance"
import { useToast } from "../App"

const useAuthDataService = () => {
    const addToast = useToast()

    const handleError = (error, message) => {
        console.error(message, error)
        addToast(error.response.data.message, 'danger', 'error')
        throw new Error(message + error.message)
      }

    const logout = async () => {
        try {
          const response = await axiosInstance.delete('/logout')
          return response
        } catch (error) {
          handleError(error, 'Error during logout:')
        }
      }

    return{
        logout
    }
}

export default useAuthDataService