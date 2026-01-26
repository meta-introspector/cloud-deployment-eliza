# a7046c18:packages_plugin-sql_src___tests___migration_data-persistence.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/data-persistence.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          VALUES (${product.name}, ${product.price}, ${product.stock})
        `);
      }

      // Define schema with type changes
      const productsTable = pgTable("products", {
        id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
        name: text("name").notNull(),
        price: numeric("price", { precision: 10, scale: 2 }).notNull(), // Changed from INTEGER
        stock: integer("stock").default(0),
        description: text("description"), // New column
      });

      const schema = { products: productsTable };

      // Run migration
      await migrator.migrate("@elizaos/plugin-sql", schema, {
        verbose: false,
        force: true,
      });

      // Verify data is preserved and correctly converted
      const result = await db.execute(sql`
        SELECT * FROM products ORDER BY id
      `);

      expect(result.rows).toHaveLength(5);
      expect(result.rows[0].name).toBe("Product A");
      expect(result.rows[0].price).toBe("1999.00"); // Numeric type returns as string with precision
      expect(result.rows[0].stock).toBe(100);
      expect(result.rows[1].name).toBe("Product B");
      expect(result.rows[1].price).toBe("2999.00");
    });

    it("should preserve data in related tables with foreign keys", async () => {
      // Create related tables with data
      await db.execute(sql`
        CREATE TABLE departments (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          budget NUMERIC(12,2)
        )
      `);

      await db.execute(sql`
        CREATE TABLE employees (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          department_id INTEGER REFERENCES departments(id),
          salary NUMERIC(10,2),
          hired_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Insert department data
      const deptIds: number[] = [];
      const departments = ["Engineering", "Sales", "Marketing", "HR"];
      for (const dept of departments) {
        const result = await db.execute(sql`
          INSERT INTO departments (name, budget) 
          VALUES (${dept}, ${Math.random() * 1000000})
          RETURNING id
        `);
        deptIds.push(result.rows[0].id as number);
      }

      // Insert employee data
      for (let i = 1; i <= 50; i++) {
        const deptId = deptIds[Math.floor(Math.random() * deptIds.length)];
        await db.execute(sql`
          INSERT INTO employees (name, email, department_id, salary) 
          VALUES (
            ${`Employee ${i}`}, 
            ${`employee${i}@company.com`},
            ${deptId},
            ${50000 + Math.random() * 100000}
          )
        `);
      }

      // Verify initial state
      const empCount = await db.execute(
        sql`SELECT COUNT(*) as count FROM employees`,
      );
      expect(Number(empCount.rows[0].count)).toBe(50);

      const deptCount = await db.execute(
        sql`SELECT COUNT(*) as count FROM departments`,
      );
      expect(Number(deptCount.rows[0].count)).toBe(4);

      // Define schemas with modifications
      const departmentsTable = pgTable("departments", {
        id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
        name: text("name").notNull(),
        budget: numeric("budget", { precision: 12, scale: 2 }),
        created_at: timestamp("created_at").defaultNow(), // New column
        is_active: boolean("is_active").default(true), // New column
      });

      const employeesTable = pgTable("employees", {
        id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
        name: text("name").notNull(),
        email: text("email").notNull().unique(),
        department_id: integer("department_id").references(
          () => departmentsTable.id,
        ),
        salary: numeric("salary", { precision: 10, scale: 2 }),
        hired_at: timestamp("hired_at").defaultNow(),
        position: text("position"), // New column
        is_active: boolean("is_active").default(true), // New column
      });

      const schema = {
        departments: departmentsTable,
        employees: employeesTable,
      };

      // Run migration
      await migrator.migrate("@elizaos/plugin-sql", schema, {
        verbose: false,
        force: true,
      });

      // Verify all relationships are preserved
      const employeesAfter = await db.execute(sql`
        SELECT e.*, d.name as dept_name 
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.id
        ORDER BY e.id
      `);

      expect(employeesAfter.rows).toHaveLength(50);

      // Verify all employees still have valid department references
      for (const emp of employeesAfter.rows) {
        expect(emp.dept_name).toBeDefined();
        expect(departments).toContain(emp.dept_name as string);
        expect(emp.is_active).toBe(true); // New column should have default
      }

      // Verify departments data
      const deptsAfter = await db.execute(sql`
        SELECT * FROM departments ORDER BY id
      `);
      expect(deptsAfter.rows).toHaveLength(4);
      for (const dept of deptsAfter.rows) {
        expect(dept.is_active).toBe(true); // New column should have default
      }
```