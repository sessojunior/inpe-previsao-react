import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Frame from './components/Frame'
import Main from './components/Main'
import Topbar from './components/Topbar'
import { useState } from 'react';

function App() {
  const [isHeaderFooterOpen, setIsHeaderFooterOpen] = useState(true)

  function toggleHeaderFooter() {
    setIsHeaderFooterOpen((isHeaderFooterOpen) => !isHeaderFooterOpen)
  }

  return (
    <>
      {isHeaderFooterOpen && <header>Header</header>}
      <main>
        <Topbar showHideHeaderFooter={toggleHeaderFooter} showQtyFrames={4} />
        <Main>
          <Frame model="BAM" region="Sul" dateTime="Qua 05 Jun 2024 00 UTC" />
          <Frame model="BRAMS 08km" region="América do Sul" dateTime="Qua 05 Jun 2024 00 UTC" />
          <Frame model="WRF" region="Centro-oeste" dateTime="Qua 05 Jun 2024 00 UTC" />
          <Frame model="Multimodelo" region="Nordeste" dateTime="Qua 05 Jun 2024 00 UTC" />
        </Main>
      </main>
      {isHeaderFooterOpen && <footer>Footer</footer>}
    </>
  )
}

export default App
