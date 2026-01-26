# e5b94879:packages_client_src_components_agent-log-viewer.tsx:601-645

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/agent-log-viewer.tsx:601-645
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
                      Showing first 100 of {filteredLogs.length.toLocaleString()} logs
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="border-t bg-muted/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isLive && (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live updates enabled {useWebSocket ? '(streaming)' : '(polling)'}</span>
              </>
            )}
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearLogs}
            disabled={isClearing}
            className="h-8 px-3 text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {isClearing ? 'Clearing...' : 'Clear All Logs'}
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        title={options?.title || ''}
        description={options?.description || ''}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        variant={options?.variant}
        onConfirm={onConfirm}
      />
    </>
  );
}
```