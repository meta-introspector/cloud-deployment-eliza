import { IAgentRuntime } from "@elizaos/core";

// Types and Interfaces
interface Address {
    Street: string;
    City: string;
    Region: string;
    PostalCode: string;
}

interface CustomerInfo {
    FirstName: string;
    LastName: string;
    Email: string;
    Phone: string;
}

interface PizzaOption {
    [key: string]: {
        [key: string]: string;
    };
}

interface Product {
    Code: string;
    Options: PizzaOption;
}

interface Payment {
    Type: string;
    Amount: number;
    CardType: string;
    Number: string;
    Expiration: string;
    SecurityCode: string;
    PostalCode: string;
    TipAmount: number;
}

interface OrderRequest {
    Address: Address;
    StoreID: string;
    Products: Product[];
    OrderChannel: string;
    OrderMethod: string;
    LanguageCode: string;
    ServiceMethod: string;
    Payments?: Payment[];
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Phone?: string;
}

export class PizzaAPI {
    private readonly BASE_URL: string;
    private readonly TRACKER_URL: string;

    private readonly headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Referer: "order.dominos.com",
    };

    private readonly trackerHeaders = {
        "dpz-language": "en",
        "dpz-market": "UNITED_STATES",
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
    };

    constructor(private runtime: IAgentRuntime) {
        this.BASE_URL =
            this.runtime.getSetting("API_BASE_URL") ||
            "https://order.dominos.com/power";
        this.TRACKER_URL =
            this.runtime.getSetting("API_TRACKER_URL") ||
            "https://tracker.dominos.com/tracker-presentation-service/v2";
    }

    // Helper function to get required setting
    private getRequiredSetting(name: string): string {
        const value = this.runtime.getSetting(name);
        if (!value) {
            throw new Error(`Required setting ${name} is not configured`);
        }
        return value;
    }

    // Function to get customer info from settings
    private getCustomerInfo(): CustomerInfo {
        return {
            FirstName: this.getRequiredSetting("CUSTOMER_FIRST_NAME"),
            LastName: this.getRequiredSetting("CUSTOMER_LAST_NAME"),
            Email: this.getRequiredSetting("CUSTOMER_EMAIL"),
            Phone: this.getRequiredSetting("CUSTOMER_PHONE"),
        };
    }

    // Function to get address from settings
    private getAddress(): Address {
        return {
            Street: this.getRequiredSetting("CUSTOMER_STREET"),
            City: this.getRequiredSetting("CUSTOMER_CITY"),
            Region: this.getRequiredSetting("CUSTOMER_REGION"),
            PostalCode: this.getRequiredSetting("CUSTOMER_POSTAL_CODE"),
        };
    }

    // Function to get payment info from settings
    private getPayment(amount: number): Payment {
        return {
            Type: "CreditCard",
            Amount: amount,
            CardType: this.detectCardType(
                this.getRequiredSetting("PAYMENT_CARD_NUMBER")
            ),
            Number: this.getRequiredSetting("PAYMENT_CARD_NUMBER"),
            Expiration: this.getRequiredSetting("PAYMENT_EXPIRATION"),
            SecurityCode: this.getRequiredSetting("PAYMENT_CVV"),
            PostalCode: this.getRequiredSetting("PAYMENT_POSTAL_CODE"),
            TipAmount: parseFloat(
                this.getRequiredSetting("PAYMENT_TIP_AMOUNT")
            ),
        };
    }

    private detectCardType(cardNumber: string): string {
        if (cardNumber.startsWith("4")) return "VISA";
        if (cardNumber.startsWith("5")) return "MASTERCARD";
        if (cardNumber.startsWith("34") || cardNumber.startsWith("37"))
            return "AMEX";
        if (cardNumber.startsWith("6")) return "DISCOVER";
        return "UNKNOWN";
    }

    async findNearestStore(): Promise<any> {
        const address = this.getAddress();
        const encodedAddress = encodeURIComponent(address.Street);
        const encodedCityState = encodeURIComponent(
            `${address.City}, ${address.Region}`
        );
        const url = `${this.BASE_URL}/store-locator?s=${encodedAddress}&c=${encodedCityState}&type=Delivery`;

        const response = await fetch(url, {
            method: "GET",
            headers: this.headers,
        });
        return response.json();
    }

    async getStoreInfo(storeId: string): Promise<any> {
        const url = `${this.BASE_URL}/store/${storeId}/profile`;
        const response = await fetch(url, {
            method: "GET",
            headers: this.headers,
        });
        return response.json();
    }

    async validateOrder(orderData: OrderRequest): Promise<any> {
        const url = `${this.BASE_URL}/validate-order`;
        const response = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({ Order: orderData }),
        });
        return response.json();
    }

    async priceOrder(orderData: OrderRequest): Promise<any> {
        const url = `${this.BASE_URL}/price-order`;
        const response = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({ Order: orderData }),
        });
        return response.json();
    }

    async placeOrder(orderData: OrderRequest): Promise<any> {
        const url = `${this.BASE_URL}/place-order`;
        const response = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({ Order: orderData }),
        });
        return response.json();
    }

    async trackOrder(): Promise<any> {
        const customerPhone = this.getRequiredSetting("CUSTOMER_PHONE");
        const url = `${this.TRACKER_URL}/orders?phonenumber=${customerPhone.replace(/\D/g, "")}`;
        const response = await fetch(url, {
            method: "GET",
            headers: this.trackerHeaders,
        });
        return response.json();
    }

    async orderPizza() {
        try {
            // 1. Find nearest store using settings address
            const storeResponse = await this.findNearestStore();
            console.log(
                "Store Response:",
                JSON.stringify(storeResponse, null, 2)
            );
            const storeId = storeResponse.Stores[0].StoreID;

            // 2. Get store info
            const storeInfo = await this.getStoreInfo(storeId);
            console.log("Store Info:", JSON.stringify(storeInfo, null, 2));

            // 3. Create order request
            const address = this.getAddress();
            const orderRequest: OrderRequest = {
                Address: address,
                StoreID: storeId,
                Products: [
                    {
                        Code: "14SCREEN",
                        Options: {
                            X: { "1/1": "1" },
                            C: { "1/1": "1" },
                        },
                    },
                ],
                OrderChannel: "OLO",
                OrderMethod: "Web",
                LanguageCode: "en",
                ServiceMethod: "Delivery",
            };

            // 4. Validate order
            const validatedOrder = await this.validateOrder(orderRequest);
            console.log(
                "Validated Order:",
                JSON.stringify(validatedOrder, null, 2)
            );

            // 5. Price order
            const pricedOrder = await this.priceOrder(orderRequest);
            console.log("Priced Order:", JSON.stringify(pricedOrder, null, 2));

            // 6. Add payment and customer info for final order
            const customerInfo = this.getCustomerInfo();
            const finalOrder: OrderRequest = {
                ...orderRequest,
                FirstName: customerInfo.FirstName,
                LastName: customerInfo.LastName,
                Email: customerInfo.Email,
                Phone: customerInfo.Phone,
                Payments: [this.getPayment(pricedOrder.Order.Amounts.Customer)],
            };

            // 7. Place order
            const placedOrder = await this.placeOrder(finalOrder);
            console.log("Placed Order:", JSON.stringify(placedOrder, null, 2));

            // 8. Track order
            const trackingInfo = await this.trackOrder();
            console.log(
                "Tracking Info:",
                JSON.stringify(trackingInfo, null, 2)
            );

            return {
                storeInfo,
                orderDetails: placedOrder,
                tracking: trackingInfo,
            };
        } catch (error) {
            console.error("Error ordering pizza:", error);
            throw error;
        }
    }
}
