import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { OdooClient } from 'odoo-xmlrpc-ts';

const odooConfig = {
    url: process.env.ODOO_URL || "",
    db: process.env.ODOO_DB || "",
    username: process.env.ODOO_USER || "",
    password: process.env.ODOO_PASSWORD || "",
};

export const odooQueryTool = new DynamicStructuredTool({
    name: "odoo_query",
    description: "Queries an Odoo 18 instance using XML-RPC. Use this tool to search, read, create, or write data in Odoo. The input should be the model name, method, and arguments.",
    schema: z.object({
        model: z.string().describe("The Odoo model to query (e.g., 'res.partner', 'sale.order')"),
        method: z.string().describe("The Odoo method to call (e.g., 'search_read', 'create', 'write')"),
        args: z.array(z.any()).describe("Arguments to pass to the method"),
        kwargs: z.string().optional().describe("JSON string of keyword arguments to pass to the method (e.g., '{\"limit\": 5, \"offset\": 0}')"),
    }),
    func: async ({ model, method, args, kwargs = "{}" }) => {
        const client = new OdooClient(odooConfig);
        try {
            const parsedKwargs = typeof kwargs === "string" ? JSON.parse(kwargs) : kwargs;
            const result = await client.execute(model, method, args, parsedKwargs);
            return JSON.stringify(result, null, 2);
        } catch (error: any) {
            return `Error querying Odoo: ${error.message}`;
        }
    },
});
