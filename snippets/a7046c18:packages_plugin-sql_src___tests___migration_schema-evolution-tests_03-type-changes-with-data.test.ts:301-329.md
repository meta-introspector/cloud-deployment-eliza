# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_03-type-changes-with-data.test.ts:301-329

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/03-type-changes-with-data.test.ts:301-329
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    });

    // V2: Convert boolean to text
    const settingsTableV2 = pgTable("settings", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      enabled: text("enabled").notNull().default("true"), // boolean → text
      verified: text("verified").default("false"), // boolean → text
      active: text("active"), // boolean → text
    });

    const schemaV2 = { settings: settingsTableV2 };

    await migrator.migrate("@elizaos/schema-evolution-test-bool-v1", schemaV2);

    const afterTextData = await db.select().from(settingsTableV2);
    console.log("\n📊 After boolean → text conversion:");
    afterTextData.forEach((row) => {
      console.log(
        `  - ${row.name}: enabled="${row.enabled}", verified="${row.verified}", active="${row.active}"`,
      );
    });

    // Verify conversion results
    expect(afterTextData[0].enabled).toBe("true");
    expect(afterTextData[1].enabled).toBe("false");
    expect(afterTextData[2].active).toBeNull();
  });
});
```