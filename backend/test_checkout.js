async function testCheckout() {
    try {
        const response = await fetch('http://localhost:3001/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: null,
                total: 25.00,
                items: [
                    {
                        quantity: 1,
                        product: { name: "O Corvo", price: 25.00 }
                    }
                ],
                formData: {
                    fullName: "John Doe",
                    email: "henriquelimagusmao@gmail.com",
                    cpf: "123.456.789-00",
                    phone: "(11) 99999-9999",
                    zipCode: "01001-000",
                    street: "Praça da Sé",
                    number: "1",
                    complement: "Lado ímpar",
                    neighborhood: "Sé",
                    city: "São Paulo",
                    state: "SP"
                }
            })
        });
        const data = await response.json();
        console.log("Success:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}

testCheckout();
