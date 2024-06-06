import styled from "styled-components"
import Button from 'react-bootstrap/Button';

const StyledTopBar = styled.div`
  height: 80px;
  background-color: #F8F8F8;
  border-bottom: 1px solid #cbcbcb;
  color: #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;

  & .title {
    font-weight: 700;
  }

  & .buttons {
    display: flex;
    gap: 4px;
  }
`

export default function Topbar() {
  return (
    <StyledTopBar>
      <div className="buttons"><Button variant="primary"><i className="bi bi-arrows-fullscreen"></i></Button></div>
      <div className="title">Previsão Numérica do Tempo</div>
      <div className="buttons">
        <Button variant="primary"><i className="bi bi-window"></i></Button>
        <Button variant="primary"><i className="bi bi-window-split"></i></Button>
        <Button variant="primary"><i className="bi bi-border-all"></i></Button>
      </div>
    </StyledTopBar>
  )
}
