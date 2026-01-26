# a7046c18:packages_docs_runtime_services.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/services.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    const service = new DiscordService(runtime);
    await service.initialize();
    return service;
  }
  
  private async initialize() {
    // Parse environment configuration
    const token = this.runtime.getSetting("DISCORD_API_TOKEN");
    if (!token) {
      this.runtime.logger.warn("Discord token not found");
      return;
    }
    
    // Initialize Discord client
    this.client = new Discord.Client({
      intents: [/* Discord intents */],
      partials: [/* Discord partials */]
    });
    
    // Set up event handlers
    this.setupEventHandlers();
    
    // Connect to Discord
    await this.client.login(token);
  }
  
  private setupEventHandlers() {
    this.client.on('messageCreate', async (message) => {
      // Convert Discord message to Memory format
      const memory = await this.convertToMemory(message);
      
      // Process through runtime
      await this.runtime.processActions(memory, []);
    });
  }
  
  async stop() {
    await this.client?.destroy();
  }
}
```

### Background Task Service

Services that perform periodic or scheduled tasks:

```typescript
class TaskService extends Service {
  static serviceType = ServiceType.TASK;
  capabilityDescription = 'Scheduled task execution';
  
  private interval: NodeJS.Timer;
  private readonly TICK_INTERVAL = 60000; // 1 minute
  
  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new TaskService(runtime);
    await service.startTimer();
    return service;
  }
  
  private async startTimer() {
    this.interval = setInterval(async () => {
      await this.checkTasks();
    }, this.TICK_INTERVAL);
  }
  
  private async checkTasks() {
    try {
      // Check for scheduled tasks
      const tasks = await this.runtime.databaseAdapter.getTasks({
        status: 'pending',
        scheduledFor: { $lte: new Date() }
      });
      
      // Execute each task
      for (const task of tasks) {
        await this.executeTask(task);
      }
    } catch (error) {
      this.runtime.logger.error('Task check failed:', error);
    }
  }
  
  private async executeTask(task: Task) {
    try {
      // Mark task as running
      task.status = 'running';
      await this.runtime.databaseAdapter.updateTask(task);
      
      // Execute task logic
      await this.processTask(task);
      
      // Mark task as complete
      task.status = 'completed';
      await this.runtime.databaseAdapter.updateTask(task);
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      await this.runtime.databaseAdapter.updateTask(task);
    }
  }
  
  async stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
```

### Data Service

Services that provide data access or caching:

```typescript
class SearchService extends Service {
  static serviceType = 'search' as const;
  capabilityDescription = 'Web search capabilities';
  
  private searchClient: SearchClient;
  private cache: Map<string, CachedResult>;
  
  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new SearchService(runtime);
    await service.initialize();
    return service;
  }
  
  private async initialize() {
    const apiKey = this.runtime.getSetting('SEARCH_API_KEY');
    
    this.searchClient = new SearchClient({
      apiKey,
      timeout: 5000
    });
    
    this.cache = new Map();
    
    // Clear cache periodically
    setInterval(() => this.clearOldCache(), 3600000); // 1 hour
  }
  
  async search(query: string): Promise<SearchResult[]> {
    // Check cache
    const cached = this.cache.get(query);
    if (cached && !this.isExpired(cached)) {
      return cached.results;
    }
    
    // Perform search
```