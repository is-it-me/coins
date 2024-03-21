import { ChangeEvent, useEffect, useState } from "react";
import LineChartComponent from "../components/LineChartComponent";
import { nanoid } from "nanoid";
import { API_END_POINT } from "../constants/constants";
import Loader from "../components/Loader";
import { ViewType } from "./CurrencyContainer";
import Failed from "../components/Failed";
import Toast from "../components/Toast";
import { debounce } from "lodash";

type IProps = {
  currency: string;
  startViewTypes: ViewType[];
};

export type CurrencyPriceType = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type FailState = {
  state: boolean;
  message: string;
};

const ChartsContainer = ({ currency, startViewTypes }: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [failed, setFailed] = useState<FailState>({
    state: false,
    message: "",
  });
  const [activeCurData, setActiveCurData] = useState<CurrencyPriceType[]>([]);
  const [viewTypes, setViewTypes] = useState<ViewType[]>(startViewTypes);
  const [isToast, setIsToast] = useState<boolean>(false);

  const changeView = (viewType: ViewType) => {
    setViewTypes((prevView: ViewType[]) => {
      return prevView.map((view: ViewType) => {
        if (view.key === viewType.key) {
          return viewType;
        }
        return view;
      });
    });
  };

  const getCoinData = async (id: string) => {
    try {
      setLoading(true);
      setFailed({ state: false, message: "" });
      const response = await fetch(
        `${API_END_POINT}api/v3/coins/${id}/ohlc?days=30&vs_currency=usd`
      );
      const data = await response.text();
      const currencyData: CurrencyPriceType[] = JSON.parse(data).map(
        (d: number[]) => {
          return {
            date: new Date(d[0]).toLocaleString(),
            open: d[1],
            high: d[2],
            low: d[3],
            close: d[4],
          };
        }
      );
      setActiveCurData(currencyData);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setLoading(false);
      setFailed({ state: true, message: e.message });
    }
  };

  const savePrefer = () => {
    localStorage.setItem("preference", JSON.stringify({ currency, viewTypes }));
    setIsToast(true);
    debounce(() => setIsToast(false), 1000)();
  };

  useEffect(() => {
    getCoinData(currency);
    setViewTypes(startViewTypes);
  }, [currency]);

  if (loading) return <Loader />;

  if (failed.state) return <Failed message={failed.message} />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {viewTypes.map((v: ViewType) => (
          <div key={nanoid()} style={{ padding: "20px" }}>
            <label htmlFor="viewCheck" style={{ color: v.lineColor }}>
              {v.key}
            </label>
            <input
              id={"viewCheck"}
              type="checkbox"
              checked={v.view}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                changeView({ ...v, view: e.target.checked });
              }}
            />
          </div>
        ))}
      </div>

      <button
        role="button"
        type="button"
        className="btn btn-success"
        onClick={savePrefer}
      >
        Save Preferences
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {viewTypes[0].view && (
          <LineChartComponent
            data={activeCurData}
            dataKey={viewTypes[0].key}
            lineColor={viewTypes[0].lineColor}
          />
        )}
        {viewTypes[1].view && (
          <LineChartComponent
            data={activeCurData}
            dataKey={viewTypes[1].key}
            lineColor={viewTypes[1].lineColor}
          />
        )}
        {viewTypes[2].view && (
          <LineChartComponent
            data={activeCurData}
            dataKey={viewTypes[2].key}
            lineColor={viewTypes[2].lineColor}
          />
        )}
        {viewTypes[3].view && (
          <LineChartComponent
            data={activeCurData}
            dataKey={viewTypes[3].key}
            lineColor={viewTypes[3].lineColor}
          />
        )}
      </div>
      {isToast && <Toast message="Preferences Saved" />}
    </div>
  );
};

export default ChartsContainer;
