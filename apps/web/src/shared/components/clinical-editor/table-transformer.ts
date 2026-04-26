import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  TableCellNode,
  TableNode,
  TableRowNode,
} from "@lexical/table";
import type { MultilineElementTransformer } from "@lexical/markdown";
import { $createParagraphNode, $createTextNode, type LexicalNode, ElementNode } from "lexical";

export const TABLE: MultilineElementTransformer = {
  dependencies: [TableNode, TableRowNode, TableCellNode],
  export: (node: LexicalNode) => {
    if (!(node instanceof TableNode)) {
      return null;
    }

    const output: string[] = [];
    for (const row of node.getChildren()) {
      if (row instanceof TableRowNode) {
        const rowOutput: string[] = [];
        for (const cell of row.getChildren()) {
          if (cell instanceof TableCellNode) {
            rowOutput.push(cell.getTextContent().replace(/\n/g, "<br />"));
          }
        }
        output.push(`| ${rowOutput.join(" | ")} |`);
      }
    }

    return output.join("\n");
  },
  regExpStart: /^\|(.+)\|$/,
  handleImportAfterStartMatch: ({ lines, startLineIndex, rootNode }) => {
    let index = startLineIndex;
    const tableLines: string[] = [];

    // 1. Collect all consecutive lines that look like table rows
    while (index < lines.length && lines[index].trim().match(/^\|(.+)\|$/)) {
      tableLines.push(lines[index].trim());
      index++;
    }

    // A valid table needs at least a header and content/separator
    if (tableLines.length < 2) {
      return null;
    }

    // 2. Create the Table
    const tableNode = $createTableNode();

    for (const line of tableLines) {
      // Skip the separator line (|---|---|)
      if (line.match(/^\|[\s-:\\|]+\|$/)) {
        continue;
      }

      const cells = line.slice(1, -1).split("|");
      const tableRowNode = $createTableRowNode();

      for (const cellText of cells) {
        const tableCellNode = $createTableCellNode(0);
        const paragraphNode = $createParagraphNode();
        paragraphNode.append($createTextNode(cellText.trim()));
        tableCellNode.append(paragraphNode);
        tableRowNode.append(tableCellNode);
      }
      tableNode.append(tableRowNode);
    }

    // 3. Append to the rootNode
    if (rootNode instanceof ElementNode) {
      rootNode.append(tableNode);
    }

    // Return true and the last index consumed
    return [true, index - 1];
  },
  type: "multiline-element",
  replace: () => true,
};
