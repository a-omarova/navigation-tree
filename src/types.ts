export type NodeProps = {
  id: string,
  title: string,
  hasChildren: boolean,
  level: number,
  pages?: NodeProps[]
}

export type TreeSearchType = {
  node: NodeProps,
  id: string,
  data?: NodeProps[]
}
