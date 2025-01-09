// Order status enums
export enum OrderStatus {
    NEW = "NEW",
    AWAITING_CUSTOMER_INFO = "AWAITING_CUSTOMER_INFO",
    AWAITING_PAYMENT = "AWAITING_PAYMENT",
    AWAITING_CONFIRMATION = "AWAITING_CONFIRMATION",
    PROCESSING = "PROCESSING",
    CONFIRMED = "CONFIRMED",
    FAILED = "FAILED",
}

// Payment status types
export enum PaymentStatus {
    NOT_PROVIDED = "NOT_PROVIDED",
    INVALID = "INVALID",
    VALID = "VALID",
    ON_FILE = "ON_FILE",
    PROCESSED = "PROCESSED",
}

// Pizza size enum
export enum PizzaSize {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE",
    XLARGE = "XLARGE",
}

// Pizza crust enum
export enum PizzaCrust {
    HAND_TOSSED = "HAND_TOSSED",
    THIN = "THIN",
    PAN = "PAN",
    GLUTEN_FREE = "GLUTEN_FREE",
    BROOKLYN = "BROOKLYN",
}

// Topping portion enum
export enum ToppingPortion {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    ALL = "ALL",
}

// Error types
export enum ErrorType {
    PAYMENT_FAILED = "PAYMENT_FAILED",
    VALIDATION_FAILED = "VALIDATION_FAILED",
    CUSTOMER_NOT_FOUND = "CUSTOMER_NOT_FOUND",
    SYSTEM_ERROR = "SYSTEM_ERROR",
    NETWORK_ERROR = "NETWORK_ERROR",
}

// Pizza topping interface
export interface PizzaTopping {
    code: string;
    portion: ToppingPortion;
    amount: number; // 1 for normal, 2 for extra
}

// Order item interface
export interface OrderItem {
    productCode: string;
    size: PizzaSize;
    crust: PizzaCrust;
    quantity: number;
    toppings: PizzaTopping[];
    specialInstructions?: string;
}

// Payment method interface
export interface PaymentMethod {
    type: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    postalCode?: string;
    isValid: boolean;
}

// Customer interface
export interface Customer {
    id?: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    paymentMethod?: {
        cardNumber?: string;
        expiryDate?: string;
        cvv?: string;
        postalCode?: string;
    };
    isReturning: boolean;
}

// Order progress tracking
export interface OrderProgress {
    hasCustomerInfo: boolean;
    hasPaymentMethod: boolean;
    hasValidPayment: boolean;
    isConfirmed: boolean;
}

// Order interface
export interface Order {
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: PaymentMethod;
    customer?: Customer;
    items?: OrderItem[];
    progress: OrderProgress;
    total: number;
}

// Custom error interface
export interface OrderError {
    type: ErrorType;
    message: string;
    code: string;
    details?: any;
}

// Dominos API specific types
export interface DominosAddress {
    Street: string;
    City: string;
    Region: string;
    PostalCode: string;
}

export interface DominosPayment {
    Type: string;
    Amount: number;
    CardType: string;
    Number: string;
    Expiration: string;
    SecurityCode: string;
    PostalCode: string;
    TipAmount: number;
}

export interface DominosProduct {
    Code: string;
    Options: {
        [key: string]: {
            [key: string]: string;
        };
    };
}

export interface OrderRequest {
    Address: DominosAddress;
    StoreID: string;
    Products: DominosProduct[];
    OrderChannel: string;
    OrderMethod: string;
    LanguageCode: string;
    ServiceMethod: string;
    Payments?: DominosPayment[];
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Phone?: string;
}

// Order manager interface
export interface OrderManager {
    storeId: string;
    availability: {
        isStoreOpen: boolean;
        isDeliveryAvailable: boolean;
        isCarryoutAvailable: boolean;
    };
    requiredFields: {
        requiresCustomerName: boolean;
        requiresAddress: boolean;
        requiresPayment: boolean;
        requiresPhone: boolean;
        requiresEmail: boolean;
    };
    paymentConfig: {
        acceptsCash: boolean;
        acceptsCredit: boolean;
        requiresCVV: boolean;
        requiresPostalCode: boolean;
        maxFailedAttempts: number;
    };
    getOrder(userId: string): Promise<Order | null>;
    saveOrder(userId: string, order: Order): Promise<void>;
    getCustomer(userId: string): Promise<Customer | null>;
    saveCustomer(userId: string, customer: Customer): Promise<void>;
    processOrder(order: Order, customer: Customer): Promise<Order | OrderError>;
}

// Event types for state management
export type OrderEvent =
    | { type: "UPDATE_CUSTOMER_INFO"; payload: Partial<Customer> }
    | { type: "ADD_ITEM"; payload: OrderItem }
    | { type: "REMOVE_ITEM"; payload: string }
    | { type: "UPDATE_PAYMENT"; payload: PaymentMethod }
    | { type: "PROCESS_ORDER"; payload: Order }
    | { type: "HANDLE_ERROR"; payload: OrderError };