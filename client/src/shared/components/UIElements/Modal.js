import React from 'react';
import ReactDom from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

function ModalOverlay(props) {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form onSubmit={props.onSubmit ? props.onSubmit : e => e.preventDefault()}>
        <div className={`modal__content ${props.contentClass}`}>{props.children}</div>
        <footer className={`modal__footer ${props.footerClass}`}>{props.footer}</footer>
      </form>
    </div>
  );

  return ReactDom.createPortal(
    content,
    document.getElementById('modal-portal')
  );
}

function Modal(props) {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show} // if show is false the childer of this are hidden
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
}

export default Modal;
