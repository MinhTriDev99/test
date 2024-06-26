import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

interface ApiResponse<T = {}> {
  data?: T;
  [key: string]: any;
}

const useFetchData = <T = {}>(url: string): { data: T[]; loading: boolean; error: string } => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<T[]> = await axios.get(url);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetchData;
