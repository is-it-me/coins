import "../index.css";
type IProps = {
  message: string;
};
const Failed = ({ message }: IProps) => {
  return <h1 className="failed">{message}</h1>;
};

export default Failed;
