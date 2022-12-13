let token = `test_user_token`;


export const serverCalls = {
    create: async (data: any) => {
        const response = await fetch(`http://localhost:5000/db/api/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Failed to create new data on server')
        }
        return await response.json()
    },
    get: async () => {
        const response = await fetch(`http://localhost:5000/db/api/items`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from server')
        }
        return await response.json()
    },
    get_category: async (category: string) => {
        const response = await fetch(`http://localhost:5000/db/api/items/query_category/${category}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from server')
        }
        return await response.json()
    },
    get_keyword: async (keyword: string) => {
        const response = await fetch(`http://localhost:5000/db/api/items/query_category/${keyword}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from server')
        }
        return await response.json()
    },    
    update: async (id: string, data: any) => {
        const response = await fetch(`http://localhost:5000/db/api/items/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Failed to create new data on server')
        }
        return await response.json()
    },
    delete: async (id: string) => {
        const response = await fetch(`http://localhost:5000/db/api/items/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `Bearer ${token}`
            },
        });
    }
}

