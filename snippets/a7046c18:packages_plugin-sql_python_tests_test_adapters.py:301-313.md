# a7046c18:packages_plugin-sql_python_tests_test_adapters.py:301-313

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/tests/test_adapters.py:301-313
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        # Get by name
        tasks = await pglite_adapter.get_tasks_by_name("test-task")
        assert len(tasks) >= 1

        # Update
        await pglite_adapter.update_task(task_id, {"status": "completed"})
        task = await pglite_adapter.get_task(task_id)
        assert task["status"] == "completed"

        # Delete
        await pglite_adapter.delete_task(task_id)
        task = await pglite_adapter.get_task(task_id)
        assert task is None
```