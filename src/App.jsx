import Header from './layouts/Header'
import Container from './layouts/Container'
import Footer from './layouts/Footer'

import ConfigProvider from './contexts/Config'

export default function App() {
  return (
    <>
      <ConfigProvider>
        <Header />
        <Container />
        <Footer />
      </ConfigProvider>
    </>
  )
}
