const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

export const fetchProduct = async ({ queryKey }) => {
    try {
        const [, filter] = queryKey
        const { search, products } = filter
        // Convert filters to query string
        const queryParams = new URLSearchParams({
            search: search,
            products: products,
        })
        const response = await fetch(`${apiUrl}/api/product?${queryParams}`, {
            method: 'GET'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};


export const sendProduct = async (data) => {
    try {
        const res = await fetch(`${apiUrl}/api/product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data })
        })

    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};


export const deleteItem = async (id) => {
    try {
        console.log('chec id', id);
        const res = await fetch(`${apiUrl}/api/product`, {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });

    } catch (error) {
        console.log(error?.message);
    }
};