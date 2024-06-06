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
          <Frame>Quadro 1</Frame>
          <Frame>Quadro 2</Frame>
          <Frame>Quadro 3</Frame>
          <Frame>Quadro 4</Frame>
        </Main>
      </main>
      <footer>Footer</footer>
    </>
  )
}

export default App
