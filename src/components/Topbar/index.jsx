import styled from "styled-components"

const StyledTopBar = styled.div`
  height: 80px;
  background-color: #F8F8F8;
  border-bottom: 1px solid #cbcbcb;
  color: #000000;
  display: flex;
`;

export default function Topbar() {
  return (
    <StyledTopBar>
      Topbar Styled
    </StyledTopBar>
  )
}
