import type { MarkedExtension, Tokens } from "marked";

interface MapContent {
  index: number;
  text: string;
}

const fnMap = new Map<string, MapContent>();

export function markedFootnotes(): MarkedExtension {
  return {
    extensions: [
      {
        name: `footnoteDef`,
        level: `block`,
        start(src: string) {
          fnMap.clear();
          return src.match(/^\[\^/)?.index;
        },
        tokenizer(src: string) {
          const match = src.match(/^\[\^(.*)\]:(.*)/);
          if (!match) {
            return undefined;
          }

          const [raw, fnId, text] = match;
          const index = fnMap.size + 1;
          fnMap.set(fnId, { index, text });
          return {
            type: `footnoteDef`,
            raw,
            fnId,
            index,
            text,
          };
        },
        renderer(token: Tokens.Generic) {
          const { index, text, fnId } = token;
          const content = `<span class="footnote-def"><code class="footnote-index">${index}.</code> <span class="footnote-text">${text}</span> <a class="footnote-backref" id="fnDef-${fnId}" href="#fnRef-${fnId}">↩︎</a></span>`;

          if (index === 1) {
            return `<p class="footnotes footnote-defs">${content}`;
          }

          if (index === fnMap.size) {
            return `${content}</p>`;
          }

          return content;
        },
      },
      {
        name: `footnoteRef`,
        level: `inline`,
        start(src: string) {
          return src.match(/\[\^/)?.index;
        },
        tokenizer(src: string) {
          const match = src.match(/^\[\^(.*?)\]/);
          if (!match) {
            return undefined;
          }

          const [raw, fnId] = match;
          if (!fnMap.has(fnId)) {
            return undefined;
          }

          return {
            type: `footnoteRef`,
            raw,
            fnId,
          };
        },
        renderer(token: Tokens.Generic) {
          const { fnId } = token;
          const found = fnMap.get(fnId);
          if (!found) {
            return "";
          }

          return `<sup class="footnote-ref"><a class="footnote-ref-link" href="#fnDef-${fnId}" id="fnRef-${fnId}">[${found.index}]</a></sup>`;
        },
      },
    ],
  };
}
