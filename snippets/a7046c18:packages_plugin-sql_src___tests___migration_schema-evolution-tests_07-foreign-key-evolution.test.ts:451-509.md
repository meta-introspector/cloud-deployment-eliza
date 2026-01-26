# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_07-foreign-key-evolution.test.ts:451-509

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/07-foreign-key-evolution.test.ts:451-509
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    await db.insert(employeeTableV1).values([
      { id: emp1Id, name: "Alice (Manager)", departmentId: dept1Id },
      { id: emp2Id, name: "Bob", departmentId: dept1Id },
    ]);

    console.log("  ✅ Created department with manager reference");

    // V2: Add foreign keys (one direction only for this test)
    // Note: True circular FKs require special handling in Drizzle
    const employeeTableV2 = pgTable("employees", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      departmentId: uuid("department_id"),
    });

    const departmentTableV2 = pgTable("departments", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      managerId: uuid("manager_id").references(() => employeeTableV2.id, {
        onDelete: "set null", // Manager leaves, department remains
      }),
    });

    const schemaV2 = {
      departments: departmentTableV2,
      employees: employeeTableV2,
    };

    console.log("\n📦 Adding foreign key from departments to employees...");
    await migrator.migrate("@elizaos/circular-fk-v1", schemaV2);
    console.log("  ✅ Manager reference foreign key created successfully");

    // Test that constraints work
    console.log("\n🔍 Testing manager reference constraints...");

    // Try to insert invalid manager
    let insertError: Error | null = null;
    try {
      await db.execute(
        sql`INSERT INTO departments (name, manager_id) 
            VALUES ('Invalid Dept', '999e8400-e29b-41d4-a716-446655440999')`,
      );
    } catch (error) {
      insertError = error as Error;
    }

    expect(insertError).not.toBeNull();
    console.log("  ✅ Invalid manager reference blocked");

    // Delete employee who is a manager
    await db.execute(sql`DELETE FROM employees WHERE id = ${emp1Id}`);
    const deptAfter = await db.execute(
      sql`SELECT manager_id FROM departments WHERE id = ${dept1Id}`,
    );
    expect((deptAfter.rows[0] as DepartmentRow).manager_id).toBeNull();
    console.log("  ✅ Manager deletion sets department.manager_id to NULL");
  });
});
```