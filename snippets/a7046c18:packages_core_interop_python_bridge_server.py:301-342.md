# a7046c18:packages_core_interop_python_bridge_server.py:301-342

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/bridge_server.py:301-342
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    ready_msg = {"type": "ready", "manifest": manifest}
    print(json.dumps(ready_msg), flush=True)

    # Process requests from stdin
    reader = asyncio.StreamReader()
    protocol = asyncio.StreamReaderProtocol(reader)
    await asyncio.get_event_loop().connect_read_pipe(lambda: protocol, sys.stdin)

    while True:
        try:
            line = await reader.readline()
            if not line:
                break

            line_str = line.decode("utf-8").strip()
            if not line_str:
                continue

            request = json.loads(line_str)
            response = await server.handle_request(request)
            print(json.dumps(response), flush=True)

        except json.JSONDecodeError as e:
            error_response = {"type": "error", "id": "", "error": f"JSON parse error: {e}"}
            print(json.dumps(error_response), flush=True)
        except Exception as e:
            error_response = {
                "type": "error",
                "id": "",
                "error": str(e),
                "details": traceback.format_exc(),
            }
            print(json.dumps(error_response), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="elizaOS Python Plugin Bridge Server")
    parser.add_argument("--module", "-m", required=True, help="Python module name to load")
    args = parser.parse_args()

    asyncio.run(main(args.module))

```