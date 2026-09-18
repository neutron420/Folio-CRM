import { stripComments } from "../../src/utils/strip-comments";

describe("Comment Stripper Utility", () => {
  it("strips single-line comments while preserving code", () => {
    const input = `
const a = 1; // this is a single line comment
const b = 2;
// whole line comment
const c = 3;
`;
    const output = stripComments(input);
    expect(output).not.toContain("this is a single line comment");
    expect(output).not.toContain("whole line comment");
    expect(output).toContain("const a = 1;");
    expect(output).toContain("const b = 2;");
    expect(output).toContain("const c = 3;");
  });

  it("strips multi-line block comments while preserving surrounding code", () => {
    const input = `
/* 
 * Multi-line comment block
 */
function greet() {
  return "hello"; /* inline block */
}
`;
    const output = stripComments(input);
    expect(output).not.toContain("Multi-line comment block");
    expect(output).not.toContain("inline block");
    expect(output).toContain("function greet()");
    expect(output).toContain('return "hello";');
  });

  it("preserves comments inside string literals, template literals, and URLs", () => {
    const input = `
const url = "https://example.com/api//v1";
const message = 'This is not a // comment';
const template = \`Also not a /* comment */ inside template\`;
`;
    const output = stripComments(input);
    expect(output).toContain('"https://example.com/api//v1"');
    expect(output).toContain("'This is not a // comment'");
    expect(output).toContain("`Also not a /* comment */ inside template`");
  });
});
