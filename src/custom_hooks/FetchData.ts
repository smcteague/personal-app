import React, { useState, useEffect } from 'react';
import { serverCalls } from '../api';


export const useGetData = () => {
    const [itemData, setData] = useState<any>([]);

    async function handleDataFetch() {
        const result = await serverCalls.get()
        setData(result)
    }

    useEffect( () => {
        handleDataFetch();
    }, [])

    return {itemData, getData: handleDataFetch}
}