import Proptypes from "prop-types"
import styled from "styled-components"

const StyledMain = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: start;
  align-items: start;
  justify-items: stretch;
`

export default function Main({ children }) {
  return (
    <StyledMain>
      {children}
    </StyledMain>
  )
}

Main.propTypes = {
  children: Proptypes.node
}
