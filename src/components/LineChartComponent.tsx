import { memo } from "react";
import { nanoid } from "nanoid";
import {
  LineChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type IProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  dataKey: string;
  lineColor: string;
};

const LineChartComponent = ({ data, dataKey, lineColor }: IProps) => {
  return (
    <div key={nanoid()} style={{ paddingTop: "50px" }}>
      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart data={data} margin={{ right: 300 }} width={100}>
          <CartesianGrid />
          <XAxis dataKey="date" interval={"preserveStartEnd"} />
          <YAxis></YAxis>
          <Legend />
          <Tooltip />
          <Line dataKey={dataKey} stroke={lineColor} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default memo(LineChartComponent);
