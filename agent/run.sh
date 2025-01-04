#!/bin/bash
# --trace-event-categories node,node.bootstrap,node.console,node.vm.script,v8,node.http,node.net.native,node.environment   
node --enable-source-maps --heap-prof --expose-gc  --prof --cpu-prof --loader ts-node/esm src/index.ts "--isRoot" "--characters=characters/eliza.character.json"
