import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { API_END_POINT } from "../constants/constants";
import ChartsContainer from "./ChartsContainer";
import Loader from "../components/Loader";
import Failed from "../components/Failed";
import { FailState } from "./ChartsContainer";
type CurrencyType = {
  id: string;
  symbol: string;
  name: string;
};

export type ViewType = { key: string; view: boolean; lineColor: string };

type IProps = {
  interest: string[];
};

const defaultViewTypes: ViewType[] = [
  { key: "open", view: true, lineColor: "blue" },
  { key: "high", view: true, lineColor: "green" },
  { key: "low", view: true, lineColor: "red" },
  { key: "close", view: true, lineColor: "black" },
];

export default function CurrencyContainer({ interest }: IProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [failed, setFailed] = useState<FailState>({
    state: false,
    message: "",
  });
  const [isSavedProfile, setIsSavedProfile] = useState<boolean>(false);
  const [cur, setCur] = useState<CurrencyType[]>([]);
  const [activeCur, setActiveCur] = useState<string>("");
  const [startViewTypes, setStartViewTypes] =
    useState<ViewType[]>(defaultViewTypes);

  const getData = async () => {
    try {
      setLoading(true);
      setFailed({ state: false, message: "" });
      const response = await fetch(`${API_END_POINT}api/v3/coins/list`);
      const data = await response.text();
      const interestCurrency: CurrencyType[] = JSON.parse(data).filter(
        (d: CurrencyType) => interest.includes(d.id)
      );
      setCur(interestCurrency);
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setLoading(false);
      setFailed({ state: true, message: e.message });
    }
  };

  useEffect(() => {
    getData();
    const prevViewTypes: string | null = localStorage.getItem("preference");
    if (prevViewTypes !== null) {
      setIsSavedProfile(true);
      const savedViewTypes: { currency: string; viewTypes: ViewType[] } =
        JSON.parse(prevViewTypes);
      setActiveCur(savedViewTypes.currency);
      setStartViewTypes(savedViewTypes.viewTypes);
    }
  }, []);

  if (loading) return <Loader />;

  if (failed.state) return <Failed message={failed.message} />;

  return (
    <div className="currency-sdk">
      {isSavedProfile && (
        <h3 className="text-success">Your Preferences will be loaded</h3>
      )}
      <label className="text-primary" htmlFor="coins">
        Coins:
      </label>
      <select
        id="coins"
        value={activeCur}
        onChange={(e) => {
          setActiveCur(e.target.value);
          setStartViewTypes(defaultViewTypes);
        }}
      >
        <option value=""></option>
        {cur.length > 0 &&
          cur.map((c) => (
            <option key={nanoid()} value={c.id}>
              {c.name}
            </option>
          ))}
      </select>
      {activeCur !== "" && (
        <ChartsContainer currency={activeCur} startViewTypes={startViewTypes} />
      )}
    </div>
  );
}
