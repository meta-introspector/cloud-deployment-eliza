import axios, { AxiosInstance } from "axios";
import { DefiLlamaEnvironment } from "../environment";

export class DefiLlamaProvider {
    private client: AxiosInstance;

    constructor(environment: DefiLlamaEnvironment) {
        this.client = axios.create({
            baseURL: environment.DEFILLAMA_API_URL,
            timeout: environment.DEFILLAMA_TIMEOUT,
        });
    }

    async getCurrentPrice(tokenId: string): Promise<number> {
        const { data } = await this.client.get(`/prices/current/${tokenId}`);
        const priceData = data.coins[tokenId];

        if (!priceData) {
            throw new Error(`No price data found for token: ${tokenId}`);
        }

        return priceData.price;
    }
}
