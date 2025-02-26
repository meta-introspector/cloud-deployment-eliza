import * as dotenv from "dotenv";
import * as crypto from 'crypto'; 
import * as sqliteAdapter from  "@elizaos-plugins/adapter-sqlite";
const de = dotenv.config();
//console.log("DEBUG",de)

const logFetch = async (url: string, options: any) => {
    console.debug(`Fetching ${url}`);
    // Disabled to avoid disclosure of sensitive information such as API keys
    // elizaLogger.debug(JSON.stringify(options, null, 2));
    return fetch(url, options);
};

import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";

if (de.error) {
    throw de.error;
}

import { defaultCharacter } from "../defaultCharacter.js";
import {


    AgentRuntime,
    UUID,
    // CacheManager,
    // CacheStore,
    composeContext,
    //messageHandlerTemplate,
    generateMessageResponse,
    ModelClass,
    // MessageHandlerTemplate,
    // MessageResponse,
    // MessageResponseOptions,  
    
    type Character,
    type Content,
    type Memory,
    //type ClientInstance,
    // DbCacheAdapter,
    //elizaLogger,
    embed,
    type Media,
    // FsCacheAdapter,
    type IAgentRuntime,
    //type IDatabaseAdapter,
    //type IDatabaseCacheAdapter,
    // ModelProviderName,
    // parseBooleanFromText,
    // settings,
    stringToUuid,
    getEmbeddingZeroVector,
    composeActionExamples,
    MemoryManager,
    IMemoryManager,
    // validateCharacterConfig,
} from "@elizaos/core";
//import { defaultCharacter } from "./defaultCharacter.ts";
//import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
//import { AzureOpenAIInput, ChatOpenAI, ChatOpenAIResponseFormat, ChatOpenAIStructuredOutputMethodOptions, ClientOptions, LegacyOpenAIInput, OpenAIChatInput, OpenAIClient, OpenAIToolChoice } from "@langchain/openai";

import type { Configuration } from "../Configuration.js";

export const messageCompletionFooter = `\nResponse format should be formatted in a valid JSON block like this:
\`\`\`json
{ "user": "{{agentName}}", "text": "<string>", "action": "<string>" }
\`\`\`

The “action” field should be one of the options in [Available Actions] and the "text" field should be the response you want to send.
`;
export const messageHandlerTemplate =
    // {{goals}}
    // "# Action Examples" is already included
    `{{actionExamples}}
(Action examples are for reference only. Do not use the information from them in your response.)

# Knowledge
{{knowledge}}

# Task: Generate dialog and actions for the character {{agentName}}.
About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{attachments}}

# Capabilities
Note that {{agentName}} is capable of reading/seeing/hearing various forms of media, including images, videos, audio, plaintext and PDFs. Recent attachments have been included above under the "Attachments" section.

{{messageDirections}}

{{recentMessages}}

{{actions}}

# Instructions: Write the next message for {{agentName}}.
` + messageCompletionFooter;

export const hyperfiHandlerTemplate = `{{actionExamples}}
(Action examples are for reference only. Do not use the information from them in your response.)

# Knowledge
{{knowledge}}

# Task: Generate dialog and actions for the character {{agentName}}.
About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{attachments}}

# Capabilities
Note that {{agentName}} is capable of reading/seeing/hearing various forms of media, including images, videos, audio, plaintext and PDFs. Recent attachments have been included above under the "Attachments" section.

{{messageDirections}}

{{recentMessages}}

{{actions}}

# Instructions: Write the next message for {{agentName}}.

Response format should be formatted in a JSON block like this:
\`\`\`json
{ "lookAt": "{{nearby}}" or null, "emote": "{{emotes}}" or null, "say": "string" or null, "actions": (array of strings) or null }
\`\`\`
`;

// import { TypeScriptParser } from "../TypeScriptParser.js";
// This is the retriever we will use in RAG
import { CodeFormatter } from "./utils/CodeFormatter.js";
import { run } from "node:test";
//import { CustomErrorParams, InputTypeOfTupleWithRest, IssueData, OutputTypeOfTupleWithRest, ParseParams, ParsePathComponent, ParseStatus, RefinementCtx, RefinementEffect, SafeParseReturnType, z, ZodBranded, ZodCatch, ZodCustomIssue, ZodDefault, ZodEffects, ZodError, ZodIntersection, ZodInvalidArgumentsIssue, ZodInvalidDateIssue, ZodInvalidEnumValueIssue, ZodInvalidIntersectionTypesIssue, ZodInvalidLiteralIssue, ZodInvalidReturnTypeIssue, ZodInvalidStringIssue, ZodInvalidUnionDiscriminatorIssue, ZodInvalidUnionIssue, ZodIssueBase, ZodIssueCode, ZodNotFiniteIssue, ZodNotMultipleOfIssue, ZodOptionalDef, ZodParsedType, ZodPipeline, ZodPromise, ZodReadonly, ZodTooBigIssue, ZodTooSmallIssue, ZodTupleDef, ZodUnion, ZodUnrecognizedKeysIssue } from "zod";
//import { StructuredToolInterface, StructuredToolParams } from "@langchain/core/tools.js";
//import { ToolChoice } from "@langchain/core/language_models/chat_models.js";
//import { BaseChatModelParams } from "@langchain/core/language_models/chat_models.js";
//import { FunctionDefinition } from "@langchain/core/language_models/base.js";
//import { BaseFunctionCallOptions } from "@langchain/core/language_models/base.js";
//import { Serialized } from "@langchain/core/dist/load/serializable.js";

//import { ChatOpenAIFields, ChatOpenAICallOptions, ChatOpenAIStructuredOutputMethodOptions } from "./types.js";



export class ChatWrapper {
    // private chatModel: ChatOpenAI;
    callKeys: string[] = [];
    lc_serializeable = true;
    lc_secrets = ["apiKey"];
    
    lc_serializable = true;
    lc_aliases = ["chat"];
    temperature = 0.5;
    topP = 1;
    frequencyPenalty= 0;
    presencePenalty= 0;
    n=1000;
    modelName = "gpt-4o";
    model="gpt-4o";       

    constructor({  }: { apiKey: string; model?: string }) {
        // this.chatModel = new ChatOpenAI({ apiKey, model });
    }

    async invoke(_prompt: string) {
        // return this.chatModel.invoke( prompt );
        return { content: "mock response" };
    }
}


/**
 * Service for interacting with OpenAI chat API.
 */
export class AIService {
    private chatModel: ChatWrapper; //<ChatOpenAICallOptions>
    private codeFormatter: CodeFormatter;
    private chatModelFAQ: ChatWrapper;// <ChatOpenAICallOptions>
    
    private agents: Map<string, IAgentRuntime>; // container management
    runtime: AgentRuntime;
    knowledgeManager: IMemoryManager;

    /**
     * Constructor for initializing the ChatOpenAI instance.
     *
     * @param {Configuration} configuration - The configuration instance to be used
     * @throws {Error} If OPENAI_API_KEY environment variable is not set
     */
    constructor(private configuration: Configuration) {

        const de = dotenv.config();
    
        //console.log("DEBUG",de)
    
        let key = ""

        if (de.error) {
            throw de.error;
        }
        else {
            if (de.parsed) {
             key = de.parsed["OPENAI_API_KEY"];
            }
        }

        
        this.chatModel = new ChatWrapper({ apiKey: key});
        this.chatModelFAQ = new ChatWrapper({
            apiKey: key,
            model: "gpt-4o",
        });

	//        this.chatModel = new FakeListChatModel({ responses: []});
	//				this.chatModelFAQ = new FakeListChatModel({	    responses: []        });
        this.codeFormatter = new CodeFormatter();
        
     

        this.agents = new Map();
        const token = "token";
        const character = defaultCharacter;
    
        
        const sqliteAdapterPluginDefault = sqliteAdapter.default;
        const dbadapter = sqliteAdapterPluginDefault.adapters?.[0];
        if (!dbadapter) {
            throw new Error(
                "Internal error: No database adapter found for default adapter-sqlite"
            );
        }
        if (!dbadapter) {
            throw new Error(
                "Internal error: No database adapter found for default adapter-sqlite"
            );
        }
        
        this.runtime = new AgentRuntime({token,
            modelProvider: character.modelProvider,
            evaluators: [],
            character,
            
            // character.plugins are handled when clients are added
            plugins: [bootstrapPlugin].flat().filter(Boolean),
            providers: [],
            managers: [ 
                // memeory menages

            ],
            fetch: logFetch,})
            this.knowledgeManager = new MemoryManager({
                  runtime: this.runtime,
                  tableName: "lore",
              });
              console.log("KM",this.runtime.knowledgeManager)
              console.log("Before",this.runtime.memoryManagers)
              this.runtime.memoryManagers.set(this.runtime.knowledgeManager.tableName, this.runtime.knowledgeManager);
              this.runtime.messageManager =this.runtime.knowledgeManager;

              try {
              this.runtime.databaseAdapter = dbadapter.init(this.runtime);
              } catch (error) {
              console.error("Failed to initialize database adapter:", error);
              throw error;
              }
              console.log("After",this.runtime.memoryManagers)
        }
        

    /**
     * Generates a comment based on the specified prompt by invoking the chat model.
     * @param {string} prompt - The prompt for which to generate a comment
     * @returns {Promise<string>} The generated comment
     */
    public async generateComment(prompt: string, isFAQ = false): Promise<string> {
        try {
            // First try with generous limit
            let finalPrompt = prompt;
            if (!isFAQ) {
                finalPrompt = this.codeFormatter.truncateCodeBlock(prompt, 8000);
            }

            try {            
                const agentId = "000-000-000-000-000";
                const token = "token";

                //characters = new Character()               
        
                //let runtime = this.agents.get(agentId);
                let runtime = this.runtime;
                if (!runtime) {
                    this.agents.set(agentId, runtime);
                }
                if (runtime) {
                    console.log("Runtime found for agentId:", agentId);
                    await processChunk(finalPrompt, "fragments", runtime);
                } else {                   
                    console.warn("No runtime found for agentId:", agentId);
                }
            } catch (error) {
                console.error("Failed to process chunk:", error);
                return "Failed";
            } finally {
                console.log("Chunk processing completed.");
            }
        } catch (error) {
            this.handleAPIError(error as Error);
            return "";
        }
        return "";       
    }

    /**
     * Handle API errors by logging the error message and throwing the error.
     *
     *
     * @param {Error} error The error object to handle
     * @returns {void}
     */
    public handleAPIError(error: Error): void {
        console.error("API Error:", error.message);
        throw error;
    }
}
function contentToUuid(content:string):UUID {
    // Step 1: Create a SHA-1 hash of the content
    const hash = crypto.createHash('sha1')
                      .update(content)
                      .digest('hex'); // Outputs a 40-character hex string

    // Step 2: Format the hash into a UUID-like structure
    // UUID format: 8-4-4-4-12 (e.g., 550e8400-e29b-41d4-a716-446655440000)
    const uuid = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;

    return uuid as `${string}-${string}-${string}-${string}-${string}`;
}

async function processChunk(prompt: string, manager: string, runtime: AgentRuntime): Promise<string> {
    console.log("process chunk");
    try {
        const mm = runtime.getMemoryManager(manager);
        if (!mm) {
            console.log("manager",manager);
            console.log("memoryManagers",runtime.memoryManagers);
            throw new Error(`Memory manager not found {manager}`);
        }

        const memId = contentToUuid (prompt);
        const existingResponse =
                        await mm.getMemoryById(
                            memId
                        );
        if (!existingResponse) {
            console.log("create new memory", memId);
            const memory = await mm.addEmbeddingToMemory({
                id: memId,
                agentId: runtime.agentId,
                userId: runtime.agentId, //|| runtime.userId,
                content: { text: prompt },
                roomId: runtime.agentId,
                embedding: await embed(runtime, prompt),
            });
            await mm.createMemory(memory);
            return "Success";
        }
        else {
            console.log("existingResponse", memId, existingResponse);
            return "Success";
        } 
        
    } catch (error: any) {
        console.error("Failed to process chunk:", error);
        return "Failed";
    }
}   




// async function  process_text(this: any, agentId: string, userName: string, name: string, sUserId: string | undefined,
//     sRoomId: string, text:string, agents: Map<string, any>) {
//     const roomId = stringToUuid(
//         sRoomId ?? "default-room-" + agentId
//     );
//     const userId = stringToUuid(sUserId ?? "user");

//     let runtime = agents.get(agentId);

//     if (!runtime) {
//         console.error(
//             `Runtime not found for agentId: ${agentId}`
//         );
//         return;
//     }

//     await runtime.ensureConnection(
//         userId,
//         roomId,
//         userName,
//         name,
//         "direct"
//     );

    
//     // if empty text, directly return
//     if (!text) {
//         console.error("Empty text");
//         return;
//     }

//     const messageId = stringToUuid(Date.now().toString());

//     const attachments: Media[] = [];
//     // if (req.file) {
//     //     const filePath = path.join(
//     //         process.cwd(),
//     //         "data",
//     //         "uploads",
//     //         req.file.filename
//     //     );
//     //     attachments.push({
//     //         id: Date.now().toString(),
//     //         url: filePath,
//     //         title: req.file.originalname,
//     //         source: "direct",
//     //         description: `Uploaded file: ${req.file.originalname}`,
//     //         text: "",
//     //         contentType: req.file.mimetype,
//     //     });
//     // }

//     const content: Content = {
//         text,
//         attachments,
//         source: "direct",
//         inReplyTo: "0-0-0-0-0",
//     };

//     const userMessage = {
//         content,
//         userId,
//         roomId,
//         agentId: runtime.agentId,
//     };

//     const memory: Memory = {
//         id: contentToUuid(content.text), // stringToUuid(messageId + "-" + userId),
//         ...userMessage,
//         agentId: runtime.agentId,
//         userId,
//         roomId,
//         content,
//         createdAt: Date.now(),
//     };

    

//     await runtime.messageManager.addEmbeddingToMemory(memory);
//     await runtime.messageManager.createMemory(memory);

//     let state = await runtime.composeState(userMessage, {
//         agentName: runtime.character.name,
//     });

//     const context = composeContext({
//         state,
//         template: messageHandlerTemplate,
//     });

//     const response = await generateMessageResponse({
//         runtime: runtime,
//         context,
//         modelClass: ModelClass.LARGE,
//     });

//     if (!response) {
//        // res.status(500).send(
//           ///  "No response from generateMessageResponse"
//           console.error("No response from generateMessageResponse");
//         //);
//         return;
//     }

//     // save response to memory
//     const responseMessage: Memory = {
//         id: stringToUuid(messageId + "-" + runtime.agentId),
//         ...userMessage,
//         userId: runtime.agentId,
//         content: response,
//         embedding: getEmbeddingZeroVector(),
//         createdAt: Date.now(),
//     };

//     await runtime.messageManager.createMemory(responseMessage);

//     state = await runtime.updateRecentMessageState(state);

//     let message = null as Content | null;

//     await runtime.processActions(
//         memory,
//         [responseMessage],
//         state,
//         async (newMessages: Content | null) => {
//             message = newMessages;
//             return [memory];
//         }
//     );

//     await runtime.evaluate(memory, state);

//     // Check if we should suppress the initial message
//     const action = runtime.actions.find(
//         (a: { name: string | undefined; }) => a.name === response.action
//     );
//     const shouldSuppressInitialMessage =
//         action?.suppressInitialMessage;

//     if (!shouldSuppressInitialMessage) {
//         if (message) {
//             //res.json([response, message]);
//             console.log([response, message]);
//         } else {
//             //res.json([response]);
//             console.log([response]);

//         }
//     } else {
//         if (message) {
//             //res.json([message]);
//             console.log([message]);
//         } else {
//             //res.json([]);
//             console.log([]);
//         }
//     }
// }

// interface IMemoryManager {
//   runtime: string;
//   tableName: string;
//   getMemories: () => Promise<any[]>;
//   getCachedEmbeddings: () => Promise<any[]>;
//   addEmbeddingToMemory: (data: any) => Promise<{}>;
//   createMemory: (memory: any) => Promise<void>;
//   // Add other properties and methods as required
// }

// function getMemoryManager(manager: string): IMemoryManager | null {
//   if (manager === 'someCondition') {
//     return {
//       runtime: 'someRuntime',
//       tableName: 'someTableName',
//       getMemories: async () => {
//         // Implementation here
//         return [];
//       },
//       getCachedEmbeddings: async () => {
//         // Implementation here
//         return [];
//       },
//       addEmbeddingToMemory: async (data: any) => {
//         // Implementation here
//         return {};
//       },
//       createMemory: async (memory: any) => {
//         // Implementation here
//       },
//       // Add other properties and methods as required
//     };
//   }
//   return null;
// }