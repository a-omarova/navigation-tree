import React from 'react'
import styles from './NavBarBranch.module.css'
import { Icon } from '@/components/Icon/Icon'
import Link from 'next/link'

type NodeProps = {
  id: string,
  title: string,
  hasChildren: boolean,
  level: number,
  pages?: NodeProps[]
}

type BranchProps = {
  node: NodeProps,
  onGetNode?: (id: string) => void
}

export const NavBarBranch = ({node, onGetNode}: BranchProps) => {
  return (
    <li>
      <Link
        className={styles.link}
        style={{'--lvl-padding': `${node.level} * 16px`} as React.CSSProperties}
        href=""
        onClick={() => onGetNode && onGetNode(node.id)}
      >
        {node.hasChildren && <Icon name="triangle" className={styles.linkIcon}/>}
        {node.id}
      </Link>
      {node.pages && (
        <ul>
          {node.pages.map((page: NodeProps) => (
            <NavBarBranch key={page.id} node={page} onGetNode={onGetNode}/>
          ))}
        </ul>
      )}
    </li>
  )
}
