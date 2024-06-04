import './Dockbar.css'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

function Dockbar({ active }) {

  return (
    <div className="dockbar">
      <div>
        <div className="my-2">
          <Button className={active === "previsaoNumerica" ? "btn active" : "btn"} variant="primary"><i className="bi bi-cloud-sun"></i><span className="label ps-2">Previsão Numérica</span></Button>
        </div>
        <div className="my-2">
          <Button className={active === "nowcasting" ? "btn active" : "btn"} variant="primary"><i className="bi bi-umbrella"></i><span className="label ps-2">Nowcasting</span></Button>
        </div>
        <div className="my-2">
          <Button className={active === "clima" ? "btn active" : "btn"} variant="primary"><i className="bi bi-cloud-lightning"></i><span className="label ps-2">Clima</span></Button>
        </div>
      </div>
    </div>
  )
}

Dockbar.propTypes = {
  active: PropTypes.oneOf(['previsaoNumerica', 'nowcasting', 'clima']).isRequired,
}

export default Dockbar
