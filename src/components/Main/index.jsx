import './Main.css'
import PropTypes from 'prop-types'

export default function Main({ children }) {
  return <div className="main">{children}</div>
}

Main.propTypes = {
  children: PropTypes.node,
}
