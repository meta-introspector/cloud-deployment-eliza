# e5b94879:packages_client_src_components_agent-card.tsx:151-176

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/agent-card.tsx:151-176
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
              }}
              className="h-8 w-8 p-0 hover:bg-muted/50 cursor-pointer"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* New Chat button - ghost variant */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleNewChat(true);
              }}
              className="h-8 px-2 rounded-sm bg-muted hover:bg-muted/50 cursor-pointer"
            >
              New Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
```