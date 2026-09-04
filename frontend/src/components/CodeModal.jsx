import React from "react";

function CodeModal({ isOpen, onClose, problem }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={modalOverlayStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <h2>Playground Sandbox</h2>
        <p>Sandbox content goes here.</p>
        <button onClick={onClose} style={{ marginTop: "20px" }}>Close Sandbox</button>
      </div>
    </div>
  );
}

const modalOverlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
};

const modalContentStyle = {
  background: "#1e1e1e",
  padding: "2rem",
  borderRadius: "8px",
  color: "white",
  width: "80%",
  maxWidth: "800px"
};

export default CodeModal;
