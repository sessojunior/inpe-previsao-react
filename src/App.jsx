import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Frame from './components/Frame'
import Main from './components/Main'
import Topbar from './components/Topbar'

function App() {
  return (
    <>
      <header>Header</header>
      <main>
        <Topbar />
        <Main>
          <Frame model="BAM" region="Sul" dateTime="Qua 05 Jun 2024 00 UTC" />
          <Frame model="BRAMS 08km" region="América do Sul" dateTime="Qua 05 Jun 2024 00 UTC" />
          <Frame model="WRF" region="Centro-oeste" dateTime="Qua 05 Jun 2024 00 UTC" />
          <Frame model="Multimodelo" region="Nordeste" dateTime="Qua 05 Jun 2024 00 UTC" />
        </Main>
      </main>
      <footer>Footer</footer>
    </>
  )
}

export default App
