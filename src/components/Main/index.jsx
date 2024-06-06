import Proptypes from "prop-types"

export default function Main({ children }) {
  return (
    <>
      {children}
    </>
  )
}

Main.propTypes = {
  children: Proptypes.node
}
