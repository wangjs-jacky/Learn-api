import { describe, expect, it } from "vitest";
import readdirp from "readdirp";
import path from "path";

/* readdirp 使用说明：提供 stream api 和 promise api */

const targetDir = path.join(__dirname, "fakeFolder");

describe("介绍 readdirp 的用法", () => {
  it("1) Streams example with for-await.", async () => {
    const result = [] as string[];
    for await (const entry of readdirp(targetDir)) {
      const { path } = entry;
      result.push(path);
    }
    expect(result).toMatchInlineSnapshot(`
      [
        "c/c.js",
        "a/b/a.js",
      ]
    `);
  });

  it("2) Streams example, non for-await.", (ctx) => {
    const result = [] as any[];
    readdirp(targetDir, { fileFilter: "*.js", alwaysStat: true })
      .on("data", (entry) => {
        const {
          path,
          stats: { size },
        } = entry;
        result.push({ path, size });
      })
      .on("end", () => {
        ctx.expect(result).toMatchInlineSnapshot(`
          [
            {
              "path": "c/c.js",
              "size": 21,
            },
            {
              "path": "a/b/a.js",
              "size": 21,
            },
          ]
        `);
      });
  });

  it("3) Promise 写法", async () => {
    const files = await readdirp.promise(targetDir);
    expect(files).toMatchInlineSnapshot(`
      [
        {
          "basename": "c.js",
          "dirent": Dirent {
            "name": "c.js",
            Symbol(type): 1,
          },
          "fullPath": "/Users/jiashengwang/Project/Learn-api/packages/test-readdirp/fakeFolder/c/c.js",
          "path": "c/c.js",
        },
        {
          "basename": "a.js",
          "dirent": Dirent {
            "name": "a.js",
            Symbol(type): 1,
          },
          "fullPath": "/Users/jiashengwang/Project/Learn-api/packages/test-readdirp/fakeFolder/a/b/a.js",
          "path": "a/b/a.js",
        },
      ]
    `);
  });
});

describe("readdirp 参数的用法", () => {
  it("1) 过滤文件夹或文件夹", async () => {
    const files = await readdirp.promise(".", {
      directoryFilter: ["!node_modules"],
      fileFilter: ["!*.test.js", "!package.json"],
    });
    expect(files).toMatchInlineSnapshot(`
      [
        {
          "basename": "readdirp.test.ts",
          "dirent": Dirent {
            "name": "readdirp.test.ts",
            Symbol(type): 1,
          },
          "fullPath": "/Users/jiashengwang/Project/Learn-api/packages/test-readdirp/readdirp.test.ts",
          "path": "readdirp.test.ts",
        },
        {
          "basename": "vitest.config.ts",
          "dirent": Dirent {
            "name": "vitest.config.ts",
            Symbol(type): 1,
          },
          "fullPath": "/Users/jiashengwang/Project/Learn-api/packages/test-readdirp/vitest.config.ts",
          "path": "vitest.config.ts",
        },
        {
          "basename": "c.js",
          "dirent": Dirent {
            "name": "c.js",
            Symbol(type): 1,
          },
          "fullPath": "/Users/jiashengwang/Project/Learn-api/packages/test-readdirp/fakeFolder/c/c.js",
          "path": "fakeFolder/c/c.js",
        },
        {
          "basename": "a.js",
          "dirent": Dirent {
            "name": "a.js",
            Symbol(type): 1,
          },
          "fullPath": "/Users/jiashengwang/Project/Learn-api/packages/test-readdirp/fakeFolder/a/b/a.js",
          "path": "fakeFolder/a/b/a.js",
        },
      ]
    `);
  });

  it("2) 只搜索文件夹", async () => {
    const files = await readdirp.promise(".", {
      directoryFilter: ["!node_modules", "!*.json", "!*.test.js"],
      type: "directories",
    });
    expect(files).toMatchInlineSnapshot(`
      [
        {
          "basename": "fakeFolder",
          "dirent": Dirent {
            "name": "fakeFolder",
            Symbol(type): 2,
          },
          "fullPath": "/Users/jiashengwang/Project/Learn-api/packages/test-readdirp/fakeFolder",
          "path": "fakeFolder",
        },
        {
          "basename": "a",
          "dirent": Dirent {
            "name": "a",
            Symbol(type): 2,
          },
          "fullPath": "/Users/jiashengwang/Project/Learn-api/packages/test-readdirp/fakeFolder/a",
          "path": "fakeFolder/a",
        },
        {
          "basename": "c",
          "dirent": Dirent {
            "name": "c",
            Symbol(type): 2,
          },
          "fullPath": "/Users/jiashengwang/Project/Learn-api/packages/test-readdirp/fakeFolder/c",
          "path": "fakeFolder/c",
        },
        {
          "basename": "b",
          "dirent": Dirent {
            "name": "b",
            Symbol(type): 2,
          },
          "fullPath": "/Users/jiashengwang/Project/Learn-api/packages/test-readdirp/fakeFolder/a/b",
          "path": "fakeFolder/a/b",
        },
      ]
    `);
  });

  it("3) 统计文件大小", async () => {
    const result = [] as any[];
    for await (const entry of readdirp(".", {
      directoryFilter: ["!node_modules"],
      fileFilter: ["!*.test.js", "!*.json", "!*.config.ts"],
      alwaysStat: true /* 开启统计 */,
    })) {
      const {
        path,
        stats: { size },
      } = entry as any;
      result.push({ path, size });
    }
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "path": "readdirp.test.ts",
          "size": 5595,
        },
        {
          "path": "fakeFolder/c/c.js",
          "size": 21,
        },
        {
          "path": "fakeFolder/a/b/a.js",
          "size": 21,
        },
      ]
    `);
  });
});
