import { Action, ActionExample, IAgentRuntime, Memory } from "@elizaos/core";
import { PizzaOrderManager } from "../PizzaOrderManager";
import { OrderStatus, PaymentStatus } from "../types";

export const confirmOrder: Action = {
    name: "CONFIRM_ORDER",
    description: "Confirms and places the current pizza order.",
    similes: ["PLACE_ORDER", "SUBMIT_ORDER", "FINALIZE_ORDER"],
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Yes, please place my order",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Great! I'll place your order now. Your pizza will be ready soon!",
                    action: "CONFIRM_ORDER",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Everything looks good, confirm the order",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Perfect! I'm confirming your order now. You'll receive a confirmation shortly!",
                    action: "CONFIRM_ORDER",
                },
            },
        ],
    ] as ActionExample[][],
    handler: async (runtime: IAgentRuntime, message: Memory) => {
        const orderManager = new PizzaOrderManager(runtime);
        const userId = message.userId;

        // Get the active order and customer
        const order = await orderManager.getOrder(userId);
        if (!order) {
            return "There is no active order to confirm. Please start a new order first.";
        }

        const customer = await orderManager.getCustomer(userId);
        if (!customer) {
            return "Customer details not found. Please provide your information before confirming the order.";
        }

        // Validate order status
        if (order.status !== OrderStatus.PROCESSING) {
            return "The order is not ready to be confirmed. Please complete all required information first.";
        }

        // Check payment status
        if (order.paymentStatus !== PaymentStatus.VALID) {
            return "Please provide valid payment information before confirming the order.";
        }

        // Process and place the order
        const processedOrder = await orderManager.processOrder(order, customer);
        if ("type" in processedOrder) {
            return `Unable to place order: ${processedOrder.message}`;
        }

        // Update order status
        processedOrder.status = OrderStatus.CONFIRMED;
        await orderManager.saveOrder(userId, processedOrder);

        return "Your order has been confirmed and is being prepared! You'll receive updates on your order status.";
    },
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        const orderManager = new PizzaOrderManager(runtime);
        const userId = message.userId;

        // Get the active order
        const order = await orderManager.getOrder(userId);
        if (!order) return false;

        // Check if order is in a state that can be confirmed
        return (
            order.status === OrderStatus.PROCESSING &&
            order.paymentStatus === PaymentStatus.VALID
        );
    },
};
