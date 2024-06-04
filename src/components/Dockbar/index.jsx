import './Dockbar.css'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default function Dockbar({ active }) {
  const buttons = [
    {
      name: "previsaoNumerica",
      label: "Previsão Numérica",
      icon: "bi bi-cloud-sun",
    },
    {
      name: "nowcasting",
      label: "Nowcasting",
      icon: "bi bi-umbrella",
    },
    {
      name: "clima",
      label: "Clima",
      icon: "bi bi-cloud-lightning",
    },
  ]

  return (
    <div className="dockbar">
      <div>
        {buttons.map(({ name, label, icon }) => (
          <div key={name} className="my-2">
            <Button className={active === name ? "btn active" : "btn"}><i className={icon}></i><span className="label ps-2">{label}</span></Button>
          </div>
        ))}
      </div>
    </div>
  )
}

Dockbar.propTypes = {
  active: PropTypes.oneOf(['previsaoNumerica', 'nowcasting', 'clima']).isRequired,
}
