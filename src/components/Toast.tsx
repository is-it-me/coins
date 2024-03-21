import { createPortal } from "react-dom";
type IProps = {
  message: string;
};
const Toast = ({ message }: IProps) => {
  return createPortal(
    <div
      style={{
        position: "absolute",
        top: 0,
        width: "300px",
        backgroundColor: "#DFFFFF",
        boxShadow: "0 10px 10px 0",
      }}
    >
      {message}
    </div>,
    document.getElementById("portal")!
  );
};

export default Toast;
