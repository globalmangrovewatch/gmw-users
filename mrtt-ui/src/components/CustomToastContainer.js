import { ToastContainer } from 'react-toastify'

export const CustomToastContainer = () => (
  <ToastContainer
    position='top-center'
    autoClose='5000'
    hideProgressBar={true}
    newestOnTop={false}
    closeOnClick={true}
    rtl={false}
    pauseOnFocusLoss={true}
    draggable={false}
    pauseOnHover={true}
  />
)
