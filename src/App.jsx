import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'
import Dockbar from './components/Dockbar'
import Main from './components/Main'
import Topbar from './components/Topbar'
import Content from './components/Content'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import Frames from './components/Frames';

export default function App() {
  return (
    <>
      <Dockbar active="previsaoNumerica" />
      <Main>
        <Topbar />
        <Content>
          <Sidebar />
          <Toolbar />
          <Frames />
        </Content>
      </Main>
    </>
  )
}
