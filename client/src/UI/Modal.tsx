import ReactDOM from "react-dom";

import styled from "./Modal.module.css";

type modalProps = {
  onClose: React.MouseEventHandler;
};

const Backdrop = (props: React.PropsWithChildren<modalProps>) => {
  return <div className={styled.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props: React.PropsWithChildren) => {
  return (
    <div className={styled.modal}>
      <div className={styled.content}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById("overlays") as HTMLElement;

const Modal = (props: React.PropsWithChildren<modalProps>) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export default Modal;
