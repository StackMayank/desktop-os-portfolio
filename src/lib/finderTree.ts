import type { ProjectId } from "@/lib/projectContent";

export type DocFileKind = "resume-pdf" | "project";

export type DocNode =
  | { type: "folder"; id: string; name: string; children: DocNode[] }
  | { type: "file"; id: string; name: string; fileKind: DocFileKind; projectId?: ProjectId };

export function getChildrenAtPath(root: DocNode[], path: string[]): DocNode[] {
  if (path.length === 0) return root;

  let nodes = root;
  for (const segment of path) {
    const folder = nodes.find((n) => n.type === "folder" && n.id === segment);
    if (!folder || folder.type !== "folder") return [];
    nodes = folder.children;
  }
  return nodes;
}

export function getFolderNameAtPath(root: DocNode[], path: string[]): string | null {
  if (path.length === 0) return null;
  let nodes = root;
  let name: string | null = null;
  for (const segment of path) {
    const folder = nodes.find((n) => n.type === "folder" && n.id === segment);
    if (!folder || folder.type !== "folder") return null;
    name = folder.name;
    nodes = folder.children;
  }
  return name;
}

export function pathKey(path: string[]) {
  return path.join("/");
}

export function isProjectFile(
  node: DocNode
): node is DocNode & { type: "file"; fileKind: "project"; projectId: ProjectId } {
  return node.type === "file" && node.fileKind === "project" && !!node.projectId;
}
