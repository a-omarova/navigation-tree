import React, { useCallback, useState } from 'react'
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
  idsPendingData: string[]
}

export const NavBarBranch = ({node, onGetNode, idsPendingData}: BranchProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const onClickLink = useCallback((id: string) => {
    if (!isOpen) {
      onGetNode && onGetNode(id)
    }
    setIsOpen(!isOpen)
  }, [isOpen, onGetNode])

  const linkClassNames = [styles.link, isOpen && node.pages ? styles.open : ''].join(' ')
  const findPendingId: string | undefined = idsPendingData.find((id) => node.id === id)

  return (
    <li className={styles.listItem}>
      <Link
        className={linkClassNames}
        style={{'--lvl-padding': `${node.level} * 16px`} as React.CSSProperties}
        href=""
        onClick={() => onClickLink(node.id)}
      >
        {node.hasChildren && <Icon name="triangle" className={styles.linkIcon}/>}
        <span className={styles.linkTitle}>
          {node.title}
          {findPendingId && <span className={styles.dot}/>}
        </span>

      </Link>
      {node.pages && (
        <ul
          className={styles.list}
        >
          {node.pages.map((page: NodeProps) => (
            <NavBarBranch key={page.id} node={page} onGetNode={onGetNode} idsPendingData={idsPendingData}/>
          ))}
        </ul>
      )}
    </li>
  )
}
