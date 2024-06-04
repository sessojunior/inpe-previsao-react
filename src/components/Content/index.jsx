import './Content.css'
import PropTypes from 'prop-types'

export default function Content({ children }) {
  return (
    <div className="content">
      {children}
    </div>
  )
}

Content.propTypes = {
  children: PropTypes.node,
}
