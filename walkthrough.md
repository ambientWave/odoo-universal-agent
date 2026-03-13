# Odoo Orchestrator Agent Walkthrough (NestJS Version)

I have implemented an agentic system that uses a NestJS RESTful API to manage an Orchestrator agent. This agent dispatches work to a specialized Worker agent for Odoo 18 XML-RPC queries.

## Components

### [NestJS API](file:///e:/ag_scratch/pos_api/agentic_report/src/main.ts)
The system now runs as a NestJS application. 
- **Endpoint**: `POST /query`
- **Body**: `{"prompt": "Your query here"}`

### [Worker Agent](file:///e:/ag_scratch/pos_api/agentic_report/src/agents/worker.ts)
Integrated with LangChain v1, using the new [createAgent](file:///e:/ag_scratch/pos_api/agentic_report/node_modules/langchain/dist/agents/index.d.ts#163-168) API. It uses `odoo-xmlrpc-ts` via the [Odoo Query Tool](file:///e:/ag_scratch/pos_api/agentic_report/src/tools/odoo_rpc.ts).

### [Orchestrator Agent](file:///e:/ag_scratch/pos_api/agentic_report/src/agents/orchestrator.ts)
Acts as the dispatcher, analyzing user intent and instructing the worker.

### [Dockerfile](file:///e:/ag_scratch/pos_api/agentic_report/Dockerfile)
A `node:alpine` based image that builds the NestJS app and exposes port 3000.

## How to Run

1.  **Configure environment**: Rename [.env.example](file:///e:/ag_scratch/pos_api/agentic_report/.env.example) to `.env` and fill in your Odoo and Gradio credentials.
2.  **Local Run**:
    ```bash
    npm install
    npm run build
    npm start
    ```
    Then, send a request:
    ```bash
    curl -X POST http://localhost:3000/query -H "Content-Type: application/json" -d '{"prompt": "List the first 5 customers in Odoo"}'
    ```
3.  **Docker Run**:
    ```bash
    docker build -t odoo-orchestrator .
    docker run -p 3000:3000 --env-file .env odoo-orchestrator
    ```

## Verification Results
- [x] TypeScript build successful with ES modules.
- [x] NestJS structure (Module, Controller, Service) verified.
- [x] LangChain v1 integration complete.
- [x] Odoo tool integration with `odoo-xmlrpc-ts` verified.
