
export function stripComments(source: string): string {
  let result = "";
  let i = 0;
  const len = source.length;

  while (i < len) {
    const char = source[i];
    const nextChar = i + 1 < len ? source[i + 1] : "";

    if (char === '"') {
      result += char;
      i++;
      while (i < len) {
        const c = source[i];
        result += c;
        if (c === "\\") {
          if (i + 1 < len) {
            result += source[i + 1];
            i += 2;
            continue;
          }
        } else if (c === '"') {
          i++;
          break;
        }
        i++;
      }
      continue;
    }

    if (char === "'") {
      result += char;
      i++;
      while (i < len) {
        const c = source[i];
        result += c;
        if (c === "\\") {
          if (i + 1 < len) {
            result += source[i + 1];
            i += 2;
            continue;
          }
        } else if (c === "'") {
          i++;
          break;
        }
        i++;
      }
      continue;
    }

    if (char === "`") {
      result += char;
      i++;
      while (i < len) {
        const c = source[i];
        result += c;
        if (c === "\\") {
          if (i + 1 < len) {
            result += source[i + 1];
            i += 2;
            continue;
          }
        } else if (c === "`") {
          i++;
          break;
        }
        i++;
      }
      continue;
    }

    if (char === "/" && nextChar === "/") {
      i += 2;
      while (i < len && source[i] !== "\n" && source[i] !== "\r") {
        i++;
      }
      continue;
    }

    if (char === "/" && nextChar === "*") {
      i += 2;
      while (i < len) {
        if (source[i] === "*" && i + 1 < len && source[i + 1] === "/") {
          i += 2;
          break;
        }
        i++;
      }
      continue;
    }

    result += char;
    i++;
  }

  return result
    .split("\n")
    .filter((line, index, arr) => {
      if (line.trim() === "" && index > 0 && arr[index - 1]?.trim() === "") {
        return false;
      }
      return true;
    })
    .join("\n");
}
