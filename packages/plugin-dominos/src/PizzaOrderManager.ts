import { IAgentRuntime } from "@elizaos/core";
import {
    Customer,
    ErrorType,
    Order,
    OrderError,
    OrderItem,
    OrderManager,
    OrderProgress,
    OrderRequest,
    OrderStatus,
    PaymentMethod,
    PaymentStatus,
    PizzaCrust,
    PizzaSize,
    PizzaTopping,
    ToppingPortion,
    DominosPayment,
    DominosAddress,
    DominosProduct,
} from "./types";

export class PizzaOrderManager implements OrderManager {
    storeId: string = "";

    // System state
    availability = {
        isStoreOpen: true,
        isDeliveryAvailable: true,
        isCarryoutAvailable: true,
    };

    // Required field configuration
    requiredFields = {
        requiresCustomerName: true,
        requiresAddress: true,
        requiresPayment: true,
        requiresPhone: true,
        requiresEmail: true,
    };

    // Payment configuration
    paymentConfig = {
        acceptsCash: false,
        acceptsCredit: true,
        requiresCVV: true,
        requiresPostalCode: true,
        maxFailedAttempts: 3,
    };

    // Menu configuration
    private readonly menuConfig = {
        defaultProductCode: "PIZZA",
        basePrices: {
            [PizzaSize.SMALL]: 9.99,
            [PizzaSize.MEDIUM]: 11.99,
            [PizzaSize.LARGE]: 13.99,
            [PizzaSize.XLARGE]: 15.99,
        },
        crustPrices: {
            [PizzaCrust.HAND_TOSSED]: 0,
            [PizzaCrust.THIN]: 0,
            [PizzaCrust.PAN]: 1.0,
            [PizzaCrust.GLUTEN_FREE]: 2.5,
            [PizzaCrust.BROOKLYN]: 1.5,
        },
        toppingPrices: {
            STANDARD: 1.5,
            PREMIUM: 2.5,
            SPECIALTY: 3.5,
        },
        toppingCategories: {
            STANDARD: [
                "PEPPERONI",
                "MUSHROOMS",
                "ONIONS",
                "GREEN_PEPPERS",
                "BLACK_OLIVES",
                "TOMATOES",
            ],
            PREMIUM: [
                "ITALIAN_SAUSAGE",
                "BACON",
                "EXTRA_CHEESE",
                "GROUND_BEEF",
                "HAM",
                "PINEAPPLE",
                "JALAPENOS",
            ],
            SPECIALTY: [
                "GRILLED_CHICKEN",
                "PHILLY_STEAK",
                "FETA_CHEESE",
                "SPINACH",
                "ANCHOVIES",
                "ARTICHOKE_HEARTS",
            ],
        },
        availableToppings: {
            // Standard Toppings
            PEPPERONI: "Pepperoni",
            MUSHROOMS: "Fresh Mushrooms",
            ONIONS: "Fresh Onions",
            GREEN_PEPPERS: "Green Peppers",
            BLACK_OLIVES: "Black Olives",
            TOMATOES: "Diced Tomatoes",
            // Premium Toppings
            ITALIAN_SAUSAGE: "Italian Sausage",
            BACON: "Applewood Smoked Bacon",
            EXTRA_CHEESE: "Extra Cheese Blend",
            GROUND_BEEF: "Seasoned Ground Beef",
            HAM: "Premium Ham",
            PINEAPPLE: "Sweet Pineapple",
            JALAPENOS: "Fresh Jalapeños",
            // Specialty Toppings
            GRILLED_CHICKEN: "Grilled Chicken Breast",
            PHILLY_STEAK: "Premium Philly Steak",
            FETA_CHEESE: "Feta Cheese",
            SPINACH: "Fresh Baby Spinach",
            ANCHOVIES: "Premium Anchovies",
            ARTICHOKE_HEARTS: "Artichoke Hearts",
        },
        specialCombos: {
            MEAT_LOVERS: {
                name: "Meat Lovers",
                discount: 2.0,
                requiredToppings: [
                    "PEPPERONI",
                    "ITALIAN_SAUSAGE",
                    "BACON",
                    "HAM",
                ],
            },
            VEGGIE_SUPREME: {
                name: "Veggie Supreme",
                discount: 2.0,
                requiredToppings: [
                    "MUSHROOMS",
                    "GREEN_PEPPERS",
                    "ONIONS",
                    "BLACK_OLIVES",
                    "TOMATOES",
                ],
            },
            HAWAIIAN: {
                name: "Hawaiian",
                discount: 1.5,
                requiredToppings: ["HAM", "PINEAPPLE"],
            },
            SUPREME: {
                name: "Supreme",
                discount: 3.0,
                requiredToppings: [
                    "PEPPERONI",
                    "ITALIAN_SAUSAGE",
                    "MUSHROOMS",
                    "ONIONS",
                    "GREEN_PEPPERS",
                ],
            },
        },
        incompatibleToppings: [
            ["ANCHOVIES", "CHICKEN"],
            ["PINEAPPLE", "ANCHOVIES"],
            ["ARTICHOKE_HEARTS", "GROUND_BEEF"],
        ],
    };

    // API Configuration
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

    // Helper Methods
    private getRequiredSetting(name: string): string {
        const value = this.runtime.getSetting(name);
        if (!value) {
            throw new Error(`Required setting ${name} is not configured`);
        }
        return value;
    }

    private getToppingInfo(toppingCode: string): {
        category: string;
        price: number;
    } {
        if (this.menuConfig.toppingCategories.STANDARD.includes(toppingCode)) {
            return {
                category: "STANDARD",
                price: this.menuConfig.toppingPrices.STANDARD,
            };
        }
        if (this.menuConfig.toppingCategories.PREMIUM.includes(toppingCode)) {
            return {
                category: "PREMIUM",
                price: this.menuConfig.toppingPrices.PREMIUM,
            };
        }
        if (this.menuConfig.toppingCategories.SPECIALTY.includes(toppingCode)) {
            return {
                category: "SPECIALTY",
                price: this.menuConfig.toppingPrices.SPECIALTY,
            };
        }
        throw new Error(`Invalid topping code: ${toppingCode}`);
    }

    private checkSpecialCombos(toppings: PizzaTopping[]): number {
        const toppingCodes = toppings.map((t) => t.code);
        let maxDiscount = 0;

        for (const [_, combo] of Object.entries(
            this.menuConfig.specialCombos
        )) {
            if (combo.requiredToppings.every((t) => toppingCodes.includes(t))) {
                maxDiscount = Math.max(maxDiscount, combo.discount);
            }
        }

        return maxDiscount;
    }

    private formatCurrency(amount: number): string {
        return `$${amount?.toFixed(2) || "?"}`;
    }

    private formatTopping(topping: PizzaTopping): string {
        const toppingInfo = this.getToppingInfo(topping.code);
        const amount = topping.amount > 1 ? "Extra " : "";
        const portion =
            topping.portion === ToppingPortion.ALL
                ? "Whole Pizza"
                : `${topping.portion} Half`;
        const category =
            toppingInfo.category.charAt(0) +
            toppingInfo.category.slice(1).toLowerCase();

        return (
            `${amount}${this.menuConfig.availableToppings[topping.code]} ` +
            `(${portion}) - ${category} Topping`
        );
    }

    // Cache Methods
    async getOrder(userId: string): Promise<Order | null> {
        const cachedOrder = await this.runtime.cacheManager.get<Order>(
            `pizza-order-${userId}`
        );
        return cachedOrder || null;
    }

    async saveOrder(userId: string, order: Order): Promise<void> {
        await this.runtime.cacheManager.set(`pizza-order-${userId}`, order);
    }

    async getCustomer(userId: string): Promise<Customer | null> {
        const customer = await this.runtime.cacheManager.get<Customer>(
            `pizza-customer-${userId}`
        );
        return customer || null;
    }

    async saveCustomer(userId: string, customer: Customer): Promise<void> {
        await this.runtime.cacheManager.set(
            `pizza-customer-${userId}`,
            customer
        );
    }

    // API Integration Methods
    private async findNearestStore(
        address: string,
        city: string,
        state: string
    ): Promise<any> {
        const encodedAddress = encodeURIComponent(address);
        const encodedCityState = encodeURIComponent(`${city}, ${state}`);
        const url = `${this.BASE_URL}/store-locator?s=${encodedAddress}&c=${encodedCityState}&type=Delivery`;

        const response = await fetch(url, {
            method: "GET",
            headers: this.headers,
        });
        return response.json();
    }

    private async getStoreInfo(storeId: string): Promise<any> {
        const url = `${this.BASE_URL}/store/${storeId}/profile`;
        const response = await fetch(url, {
            method: "GET",
            headers: this.headers,
        });
        return response.json();
    }

    private async validateOrderWithAPI(
        orderRequest: OrderRequest
    ): Promise<any> {
        const url = `${this.BASE_URL}/validate-order`;
        const response = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({ Order: orderRequest }),
        });
        return response.json();
    }

    private async priceOrderWithAPI(orderRequest: OrderRequest): Promise<any> {
        const url = `${this.BASE_URL}/price-order`;
        const response = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({ Order: orderRequest }),
        });
        return response.json();
    }

    private async placeOrderWithAPI(orderRequest: OrderRequest): Promise<any> {
        const url = `${this.BASE_URL}/place-order`;
        const response = await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({ Order: orderRequest }),
        });
        return response.json();
    }

    private async trackOrderWithAPI(phoneNumber: string): Promise<any> {
        const url = `${this.TRACKER_URL}/orders?phonenumber=${phoneNumber.replace(/\D/g, "")}`;
        const response = await fetch(url, {
            method: "GET",
            headers: this.trackerHeaders,
        });
        return response.json();
    }

    // Validation Methods
    private validateToppings(toppings: PizzaTopping[]): OrderError | null {
        for (const topping of toppings) {
            if (!this.menuConfig.availableToppings[topping.code]) {
                return {
                    type: ErrorType.VALIDATION_FAILED,
                    message: `Invalid topping code: ${topping.code}`,
                    code: "INVALID_TOPPING",
                };
            }

            if (!Object.values(ToppingPortion).includes(topping.portion)) {
                return {
                    type: ErrorType.VALIDATION_FAILED,
                    message: `Invalid topping portion: ${topping.portion}`,
                    code: "INVALID_PORTION",
                };
            }

            if (topping.amount !== 1 && topping.amount !== 2) {
                return {
                    type: ErrorType.VALIDATION_FAILED,
                    message: "Topping amount must be 1 (normal) or 2 (extra)",
                    code: "INVALID_AMOUNT",
                };
            }
        }

        if (toppings.length > 10) {
            return {
                type: ErrorType.VALIDATION_FAILED,
                message: "Maximum of 10 toppings per pizza",
                code: "TOO_MANY_TOPPINGS",
            };
        }

        return null;
    }

    private validateCustomerInfo(customer: Customer): OrderError | null {
        const phoneRegex = /^\d{3}[-.]?\d{3}[-.]?\d{4}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[a-zA-Z0-9\s'-]{2,50}$/;

        if (!customer.name || !nameRegex.test(customer.name)) {
            return {
                type: ErrorType.VALIDATION_FAILED,
                message: "Please provide a valid name (2-50 characters)",
                code: "INVALID_NAME",
            };
        }

        if (!customer.phone || !phoneRegex.test(customer.phone)) {
            return {
                type: ErrorType.VALIDATION_FAILED,
                message: "Please provide a valid 10-digit phone number",
                code: "INVALID_PHONE",
            };
        }

        if (!customer.email || !emailRegex.test(customer.email)) {
            return {
                type: ErrorType.VALIDATION_FAILED,
                message: "Please provide a valid email address",
                code: "INVALID_EMAIL",
            };
        }

        if (!customer.address || customer.address.length < 10) {
            return {
                type: ErrorType.VALIDATION_FAILED,
                message: "Please provide a complete delivery address",
                code: "INVALID_ADDRESS",
            };
        }

        return null;
    }

    private validatePaymentMethod(payment: PaymentMethod): OrderError | null {
        const cardNumberRegex = /^\d{16}$/;
        const cvvRegex = /^\d{3,4}$/;
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        const postalRegex = /^\d{5}(-\d{4})?$/;

        if (!payment.cardNumber || !cardNumberRegex.test(payment.cardNumber)) {
            return {
                type: ErrorType.PAYMENT_FAILED,
                message: "Please provide a valid 16-digit credit card number",
                code: "INVALID_CARD_NUMBER",
            };
        }

        if (!payment.expiryDate || !expiryRegex.test(payment.expiryDate)) {
            return {
                type: ErrorType.PAYMENT_FAILED,
                message: "Please provide a valid expiration date (MM/YY)",
                code: "INVALID_EXPIRY",
            };
        }

        // Check if card is expired
        if (payment.expiryDate) {
            const [month, year] = payment.expiryDate.split("/");
            const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
            if (expiry < new Date()) {
                return {
                    type: ErrorType.PAYMENT_FAILED,
                    message: "The card has expired",
                    code: "CARD_EXPIRED",
                };
            }
        }

        if (!payment.cvv || !cvvRegex.test(payment.cvv)) {
            return {
                type: ErrorType.PAYMENT_FAILED,
                message: "Please provide a valid CVV (3-4 digits)",
                code: "INVALID_CVV",
            };
        }

        if (
            this.paymentConfig.requiresPostalCode &&
            (!payment.postalCode || !postalRegex.test(payment.postalCode))
        ) {
            return {
                type: ErrorType.PAYMENT_FAILED,
                message: "Please provide a valid postal code",
                code: "INVALID_POSTAL",
            };
        }

        return null;
    }

    private calculatePizzaPrice(item: OrderItem): number {
        let price = this.menuConfig.basePrices[item.size];
        price += this.menuConfig.crustPrices[item.crust] || 0;

        if (item.toppings) {
            for (const topping of item.toppings) {
                const toppingInfo = this.getToppingInfo(topping.code);
                const portionMultiplier =
                    topping.portion === ToppingPortion.ALL ? 1 : 0.5;
                price += toppingInfo.price * topping.amount * portionMultiplier;
            }

            const comboDiscount = this.checkSpecialCombos(item.toppings);
            price -= comboDiscount;
        }

        return price * item.quantity;
    }

    private convertItemToProduct(item: OrderItem): DominosProduct {
        const sizeMap = {
            [PizzaSize.SMALL]: "10",
            [PizzaSize.MEDIUM]: "12",
            [PizzaSize.LARGE]: "14",
            [PizzaSize.XLARGE]: "16",
        };

        const crustMap = {
            [PizzaCrust.HAND_TOSSED]: "HANDTOSS",
            [PizzaCrust.THIN]: "THIN",
            [PizzaCrust.PAN]: "PAN",
            [PizzaCrust.GLUTEN_FREE]: "GLUTENF",
            [PizzaCrust.BROOKLYN]: "BK",
        };

        const code = `${sizeMap[item.size]}${crustMap[item.crust]}`;
        const options: { [key: string]: { [key: string]: string } } = {
            C: { "1/1": "1" }, // Base cheese
        };

        item.toppings?.forEach((topping) => {
            const coverage =
                topping.portion === ToppingPortion.ALL ? "1/1" : "1/2";
            options[topping.code] = { [coverage]: topping.amount.toString() };
        });

        return {
            Code: code,
            Options: options,
        };
    }

    private convertToOrderRequest(
        order: Order,
        customer: Customer
    ): OrderRequest {
        const [firstName, ...lastNameParts] = customer.name.split(" ");
        const lastName = lastNameParts.join(" ");

        const addressParts = customer.address
            .split(",")
            .map((part) => part.trim());
        const street = addressParts[0];
        const cityStateZip = addressParts[1].split(" ");
        const postalCode = cityStateZip.pop() || "";
        const state = cityStateZip.pop() || "";
        const city = cityStateZip.join(" ");

        const orderRequest: OrderRequest = {
            Address: {
                Street: street,
                City: city,
                Region: state,
                PostalCode: postalCode,
            },
            StoreID: this.storeId,
            Products:
                order.items?.map((item) => this.convertItemToProduct(item)) ||
                [],
            OrderChannel: "OLO",
            OrderMethod: "Web",
            LanguageCode: "en",
            ServiceMethod: "Delivery",
            FirstName: firstName,
            LastName: lastName,
            Email: customer.email,
            Phone: customer.phone,
        };

        if (order.paymentMethod && order.paymentMethod.cardNumber) {
            orderRequest.Payments = [
                {
                    Type: "CreditCard",
                    Amount: order.total,
                    CardType: this.detectCardType(
                        order.paymentMethod.cardNumber
                    ),
                    Number: order.paymentMethod.cardNumber,
                    Expiration:
                        order.paymentMethod.expiryDate?.replace("/", "") || "",
                    SecurityCode: order.paymentMethod.cvv || "",
                    PostalCode: order.paymentMethod.postalCode || "",
                    TipAmount: 0,
                },
            ];
        }

        return orderRequest;
    }

    private detectCardType(cardNumber: string): string {
        if (cardNumber.startsWith("4")) return "VISA";
        if (cardNumber.startsWith("5")) return "MASTERCARD";
        if (cardNumber.startsWith("34") || cardNumber.startsWith("37"))
            return "AMEX";
        if (cardNumber.startsWith("6")) return "DISCOVER";
        return "UNKNOWN";
    }

    async getNearestStoreId(address: string): Promise<string> {
        try {
            const parts = address.split(",").map((part) => part.trim());
            const street = parts[0];
            const cityState = parts[1].split(" ");
            const state = cityState.pop() || "";
            const city = cityState.join(" ");

            const storeResponse = await this.findNearestStore(
                street,
                city,
                state
            );

            if (!storeResponse.Stores || storeResponse.Stores.length === 0) {
                throw new Error("No nearby stores found.");
            }

            const deliveryStore = storeResponse.Stores.find(
                (store: any) =>
                    store.IsOnlineCapable &&
                    store.IsDeliveryStore &&
                    store.IsOpen &&
                    store.ServiceIsOpen.Delivery
            );

            if (!deliveryStore) {
                throw new Error("No open stores found for delivery.");
            }

            this.storeId = deliveryStore.StoreID;
            return this.storeId;
        } catch (error) {
            console.error("Error finding nearest store:", error);
            throw error;
        }
    }

    async processOrder(
        order: Order,
        customer: Customer
    ): Promise<Order | OrderError> {
        try {
            // Validate customer information
            const customerError = this.validateCustomerInfo(customer);
            if (customerError) return customerError;

            // Validate order items
            if (order.items) {
                for (const item of order.items) {
                    // Validate size
                    if (!Object.values(PizzaSize).includes(item.size)) {
                        return {
                            type: ErrorType.VALIDATION_FAILED,
                            message: `Invalid pizza size: ${item.size}`,
                            code: "INVALID_SIZE",
                        };
                    }

                    // Validate crust
                    if (!Object.values(PizzaCrust).includes(item.crust)) {
                        return {
                            type: ErrorType.VALIDATION_FAILED,
                            message: `Invalid crust type: ${item.crust}`,
                            code: "INVALID_CRUST",
                        };
                    }

                    // Validate toppings
                    if (item.toppings) {
                        const toppingError = this.validateToppings(
                            item.toppings
                        );
                        if (toppingError) return toppingError;
                    }

                    // Validate quantity
                    if (item.quantity < 1 || item.quantity > 10) {
                        return {
                            type: ErrorType.VALIDATION_FAILED,
                            message: "Quantity must be between 1 and 10",
                            code: "INVALID_QUANTITY",
                        };
                    }
                }
            }

            // Get store ID if not already set
            if (!this.storeId) {
                this.storeId = await this.getNearestStoreId(customer.address);
            }

            // Convert to API format
            const orderRequest = this.convertToOrderRequest(order, customer);

            // Validate with API
            const validatedOrder =
                await this.validateOrderWithAPI(orderRequest);
            if (validatedOrder.Status !== "Success") {
                return {
                    type: ErrorType.VALIDATION_FAILED,
                    message: validatedOrder.StatusItems.join(", "),
                    code: "API_VALIDATION_FAILED",
                };
            }

            // Price the order
            const pricedOrder = await this.priceOrderWithAPI(orderRequest);
            if (pricedOrder.Status !== "Success") {
                return {
                    type: ErrorType.VALIDATION_FAILED,
                    message: pricedOrder.StatusItems.join(", "),
                    code: "API_PRICING_FAILED",
                };
            }

            // Update total with API price
            order.total = pricedOrder.Order.Amounts.Customer;

            // If payment is provided and valid, attempt to place order
            if (order.paymentMethod) {
                const paymentError = this.validatePaymentMethod(
                    order.paymentMethod
                );
                if (paymentError) {
                    order.paymentStatus = PaymentStatus.INVALID;
                    return paymentError;
                }

                const placedOrder = await this.placeOrderWithAPI(orderRequest);
                if (placedOrder.Status !== "Success") {
                    return {
                        type: ErrorType.PAYMENT_FAILED,
                        message: placedOrder.StatusItems.join(", "),
                        code: "API_ORDER_FAILED",
                    };
                }

                order.status = OrderStatus.CONFIRMED;
                order.paymentStatus = PaymentStatus.PROCESSED;
                order.progress.isConfirmed = true;
            }

            return order;
        } catch (error) {
            console.error("Error processing order:", error);
            return {
                type: ErrorType.SYSTEM_ERROR,
                message:
                    "An unexpected error occurred while processing your order",
                code: "SYSTEM_ERROR",
            };
        }
    }

    getOrderSummary(order: Order, customer: Customer): string {
        // Format order details into readable summary
        return `Order Summary:\n${order.items.map(item =>
            `- ${item.quantity}x ${item.size} ${item.crust} Pizza${
                item.toppings?.length ? ` with ${item.toppings.map(t =>
                    `${t.amount}x ${t.code} (${t.portion})`).join(', ')}` : ''
            }`
        ).join('\n')}`;
    }

    getNextRequiredActionDialogue(order: Order, customer: Customer): string {
        // Return appropriate next step prompt
        if (!order.items[0].size) return "What size pizza would you like?";
        if (!order.items[0].crust) return "What type of crust would you prefer?";
        if (!order.items[0].toppings?.length) return "What toppings would you like?";
        return "Would you like to add any more items to your order?";
    }

    getNextRequiredAction(order: Order, customer: Customer): string {
        if (!customer.name || !customer.phone || !customer.email || !customer.address) {
            return "Customer information needs to be completed";
        }
        if (order.paymentStatus !== PaymentStatus.VALID) {
            return "Payment information needs to be provided";
        }
        if (order.status === OrderStatus.PROCESSING) {
            return "Order needs to be confirmed";
        }
        return "No additional actions required";
    }
}
