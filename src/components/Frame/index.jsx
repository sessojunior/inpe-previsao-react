import PropTypes from "prop-types"
import styled from "styled-components"
import Button from 'react-bootstrap/Button';
import Image from "../../assets/image.png"

const StyledFrame = styled.div`
  background-color: #ffffff;
  border-bottom: 1px solid #cbcbcb;
  height: 100%;
  width: 100%;
  padding: 24px;

  &:nth-child(odd) {
    border-right: 1px solid #cbcbcb;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;

    .title {
      flex-grow: 1;

      .model-region, .date-time {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .model-region {
        font-weight: bold;
        line-height: 1.25;
      }

      .date-time {
        font-size: 12px;
        color: #6C757D;
      }
    }

    .controls {
      display: flex;

      .buttons {
        display: flex;
        flex-wrap: nowrap;
        gap: 4px;

        button {
          height: fit-content;
        }
      }

      .time {
        display: flex;
        align-items: center;

        .label {
          font-weight: bold;
          padding: 0 16px;
          display: block;
          text-wrap: nowrap;
        }
      }
    }
  }

  .image {
    display: block;
    width: 100%;
    height: auto;
    background-color: #cbcbcb;

    img {
      width: 100%;
      height: auto;
    }
  }
`

export default function Frame({ model, region, dateTime }) {
  return (
    <StyledFrame>
      <div className="header">
        <div className="buttons"><Button variant="primary"><i className="bi bi-gear-fill"></i></Button></div>
        <div className="title">
          <div className="model-region">{model} &raquo; {region}</div>
          <div className="date-time">{dateTime}</div>
        </div>
        <div className="controls">
          <div className="buttons">
            <Button variant="primary"><i className="bi bi-chevron-left"></i></Button>
            <Button variant="primary"><i className="bi bi-play-fill"></i></Button>
            <Button variant="primary"><i className="bi bi-chevron-right"></i></Button>
          </div>
          <div className="time">
            <div className="label">024 horas</div>
            <div className="button"><Button variant="primary"><i className="bi bi-clock-history"></i></Button></div>
          </div>
        </div>
      </div>
      <div className="image">
        <img src={Image} alt="Imagem" />
      </div>
    </StyledFrame>
  )
}

Frame.propTypes = {
  model: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
}
