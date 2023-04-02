import { describe, expect, it } from "vitest";
import { transform as transfronV7 } from "./version7/dist";
import { transform as transfronV6 } from "./version6/dist";

const svgCode = `
<svg xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect x="10" y="10" height="100" width="100"
    style="stroke:#ff0000; fill: #0000ff"/>
</svg>
`;

describe("测试基本功能", () => {
  it("transform api version6", async () => {
    const jsCode = await transfronV6(
      svgCode,
      { icon: true },
      { componentName: "MyComponent" },
    );
    expect(jsCode).toMatchInlineSnapshot(`
      "import * as React from \\"react\\";
      const MyComponent = props => <svg xmlns=\\"http://www.w3.org/2000/svg\\" xmlnsXlink=\\"http://www.w3.org/1999/xlink\\" width=\\"1em\\" height=\\"1em\\" {...props}><rect x={10} y={10} height={100} width={100} style={{
          stroke: \\"#ff0000\\",
          fill: \\"#0000ff\\"
        }} /></svg>;
      export default MyComponent;"
    `);
  });
  it("transform api version7", async () => {
    const jsCode = await transfronV7(
      svgCode,
      { icon: true },
      { componentName: "MyComponent" },
    );
    expect(jsCode).toMatchInlineSnapshot(`
      "
      <svg xmlns=\\"http://www.w3.org/2000/svg\\"
        xmlns:xlink=\\"http://www.w3.org/1999/xlink\\">
        <rect x=\\"10\\" y=\\"10\\" height=\\"100\\" width=\\"100\\"
          style=\\"stroke:#ff0000; fill: #0000ff\\"/>
      </svg>
      "
    `);
  });
});
