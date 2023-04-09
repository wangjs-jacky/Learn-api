import { describe, expect, it } from "vitest";

const { performance, PerformanceObserver } = require("perf_hooks");

describe("performance.now", () => {
  it("performance.now", () => {
    const start = performance.now();
    const memoryBefore = process.memoryUsage().heapUsed;

    // 统计耗时版 Fibonacci 函数
    let result = fib(35);
    const end = performance.now();

    const memoryAfter = process.memoryUsage().heapUsed;
    console.log(`【TEST1】fib(35) 执行时间为 ${end - start} 毫秒`);
    console.log(
      `【TEST1】fib(35) 内存使用量为 ${memoryAfter - memoryBefore} 字节`,
    );

    expect(`fib(35) = ${result}`).toMatchInlineSnapshot('"fib(35) = 9227465"'); // mac m1 16G 内存大约是 100ms
  });

  it("perfomance.mark", () => {
    const obs = new PerformanceObserver((list, observer) => {
      // 在这里处理性能指标, 如将数据发送到日志或监控系统等
      list.getEntries().forEach((entry) => {
        if (entry.name === "myMeasure") {
          console.log(`【TEST2】fib(35) 执行时间为 ${entry.duration} 毫秒`);
        }
      });
      performance.clearMarks();
    });

    obs.observe({ entryTypes: ["mark", "measure"], buffered: true });

    // 标记开始时间
    performance.mark("start");

    // 统计耗时版 Fibonacci 函数
    let result = fib(35);

    // 标记结束时间
    performance.mark("end");

    /* 使用 measure 去计算时间差 */
    // 计算从 "start" 到 "end" 之间的时间
    performance.measure("myMeasure", "start", "end");
  });
});

function fib(n: number) {
  if (n === 0 || n == 1) return n;
  return fib(n - 1) + fib(n - 2);
}
