import { toast } from "react-toastify";

export const confirmToast = (message, onConfirm) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p style={{ marginBottom: "10px" }}>{message}</p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => {
              onConfirm();
              closeToast();
            }}
            style={{
              background: "#22c55e",
              color: "#fff",
              border: "none",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            YES
          </button>

          <button
            onClick={closeToast}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            NO
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
    }
  );
};
