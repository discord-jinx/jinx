import fetch, { Response } from "node-fetch";

export class JinxFetch {
    constructor() {};

    public async request(data: RequestOptions): Promise<JinxFetchPromiseResponse> {
        const { url = null, method = "get", headers = {}, options = {}, body = {} } = data;

        if (!url) throw new TypeError("You have to give the URL to fetch");
        var init = {...headers} as any;

        if (typeof (options) === "object") init = {...options};

        if (typeof (method) === "string") {
            init.method = method.toUpperCase();
        } else init.method = "GET";

        if (!init["headers"] && typeof (headers) === "object") {
            init = {headers, ...init};
        };

        if (!init.headers["Content-Type"]) {
            init.headers["Content-Type"] = "application/json";
        };

        if (!init["body"] && body) {
            init = {body, ...init};
        };

        if (method.toLowerCase() === "get") {
            delete init.body;
        };

        const raw = await fetch(url, init);
        const json = await raw.json().catch(() => null);
        const text = await raw.text().catch(() => null);
    
         return {
             raw,
             json,
             text,
             code: raw.status,
             isOkay: () => raw.ok,
             isRedirected: () => raw.redirected,
             isBodyUsed: () => raw.bodyUsed
         };
    };
};

export interface JinxFetchPromiseResponse {
    raw: Response;
    json: JSON | null;
    text: string | null;
    code: number;
    isOkay: () => boolean;
    isRedirected: () => boolean;
    isBodyUsed: () => boolean;
};

interface RequestOptions {
    url: string;
    method: "get" | "post" | "delete" | "put" | "patch";
    headers?: RequestInit["headers"];
    body?: BodyInit;
    options?: RequestInit;
};