import PropTypes from "prop-types"

export default function Frame({ children }) {
  return (
    <div>
      {children}
    </div>
  )
}

Frame.propTypes = {
  children: PropTypes.node
}
