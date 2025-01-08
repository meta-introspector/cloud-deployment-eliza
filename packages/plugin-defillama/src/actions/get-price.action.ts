import { createAction } from "@elizaos/core";
import { z } from "zod";
import { DefiLlamaProvider } from "../providers/defillama.provider";

export const GetPriceSchema = z.object({
    tokenId: z.string(),
});

export const getPriceAction = createAction({
    name: "get-price",
    description: "Get current price for a token from DefiLlama",
    schema: GetPriceSchema,
    handler: async ({ tokenId }, { provider }) => {
        const defiLlama = provider as DefiLlamaProvider;
        const price = await defiLlama.getCurrentPrice(tokenId);
        return { price };
    },
});
