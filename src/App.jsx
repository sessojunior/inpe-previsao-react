import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'
import Dockbar from './components/Dockbar'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import Main from './components/Main'

function App() {
  return (
    <>
      <Dockbar active="previsaoNumerica" />
      <Topbar />
      <Sidebar />
      <Toolbar />
      <Main />
    </>
  )
}

export default App
