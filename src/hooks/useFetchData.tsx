import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';

interface ApiResponse {
    id: number;
    name: string;
}

const useFetchData = (url: string): { data: ApiResponse[]; loading: boolean; error: string } => {
    const [data, setData] = useState<ApiResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse<ApiResponse[]> = await axios.get(url);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetchData;
