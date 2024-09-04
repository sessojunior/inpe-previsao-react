import Header from './layouts/Header'
import Container from './layouts/Container'
import Footer from './layouts/Footer'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ConfigProvider from './contexts/ConfigContext'

export default function App() {
  return (
    <>
      <ConfigProvider>
        <Header />
        <Container />
        <ToastContainer toastClassName="text-sm font-sans"
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          stacked
          pauseOnHover
          theme="light"
          />
        <Footer />
      </ConfigProvider>
    </>
  )
}
