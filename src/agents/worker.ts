import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { odooQueryTool } from "../tools/odoo_rpc.js";
import { createAgent } from "langchain";
import * as dotenv from "dotenv";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY!,
    temperature: 0,
});

const tools = [odooQueryTool];

const odooSchema = {
    "res.partner": {
        "name_search": {
            "name": { "type": "str", "description": "The string to search for in the name field." },
            "args": { "type": "list", "description": "Additional search domain (e.g., [[field, operator, value]])" },
            "operator": { "type": "str", "description": "The search operator (e.g., ilike, =, in)", "default": "ilike" },
            "limit": { "type": "int", "description": "Maximum number of results to return" },
        },
        "search_read": {
            "domain": { "type": "list", "description": "A list of search criteria (e.g., [[field, operator, value]])" },
            "fields": { "type": "list", "description": "A list of field names to read (e.g., ['name', 'email'])", "default": "['name']" },
            "offset": { "type": "int", "description": "The number of records to skip", "default": 0 },
            "limit": { "type": "int", "description": "The maximum number of records to return", "default": 80 },
            "order": { "type": "str", "description": "The field(s) to order the results by (e.g., 'name ASC')" },
        },
        "read": {
            "ids": { "type": "list", "description": "A list of record IDs to read (e.g., [1, 2, 3])" },
            "fields": { "type": "list", "description": "A list of field names to read (e.g., ['name', 'email'])", "default": "['name']" },
        }
    },
    "product.product": {
        "name_search": {
            "name": { "type": "str", "description": "The string to search for in the product name field." },
            "args": { "type": "list", "description": "Additional search domain" },
            "operator": { "type": "str", "description": "The search operator (e.g., ilike)", "default": "ilike" },
            "limit": { "type": "int", "description": "Maximum number of results to return" },
        },
        "search_read": {
            "domain": { "type": "list", "description": "A list of search criteria" },
            "fields": { "type": "list", "description": "A list of field names to read", "default": "['name', 'list_price']" },
            "offset": { "type": "int", "description": "The number of records to skip", "default": 0 },
            "limit": { "type": "int", "description": "The maximum number of records to return", "default": 80 },
            "order": { "type": "str", "description": "The field(s) to order the results by" },
        },
        "read": {
            "ids": { "type": "list", "description": "A list of product IDs to read" },
            "fields": { "type": "list", "description": "A list of field names to read", "default": "['name', 'list_price']" },
        },
    },
    "pos.order": {
        "name_search": {
            "name": { "type": "str", "description": "The string to search for in the order name field." },
            "args": { "type": "list", "description": "Additional search domain" },
            "operator": { "type": "str", "description": "The search operator (e.g., ilike)", "default": "ilike" },
            "limit": { "type": "int", "description": "Maximum number of results to return" },
        },
        "search_read": {
            "domain": { "type": "list", "description": "A list of search criteria" },
            "fields": { "type": "list", "description": "A list of field names to read", "default": "['name', 'amount_total']" },
            "offset": { "type": "int", "description": "The number of records to skip", "default": 0 },
            "limit": { "type": "int", "description": "The maximum number of records to return", "default": 80 },
            "order": { "type": "str", "description": "The field(s) to order the results by" },
        },
        "read": {
            "ids": { "type": "list", "description": "A list of order IDs to read" },
            "fields": { "type": "list", "description": "A list of field names to read", "default": "['name', 'amount_total']" },
        },
    }
};

const systemPrompt = `You are an Odoo expert. You have access to a tool to query Odoo 18. 
Your job is to take a request from the orchestrator and translate it into a valid Odoo XML-RPC query. 
Use the odoo_query tool to get the data.

AVAILABLE SCHEMAS:
${JSON.stringify(odooSchema, null, 2)}

Ensure you follow the argument types and descriptions in the schema when constructing your query.

IMPORTANT: The 'kwargs' parameter in the 'odoo_query' tool MUST be a JSON-formatted string (e.g., '{"limit": 10}').
`;

export async function createWorkerAgent() {
    return createAgent({
        model,
        tools,
        systemPrompt: systemPrompt,
    });
}
