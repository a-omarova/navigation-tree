import React, { useCallback, useState } from 'react'
import styles from './NavBarBranch.module.css'
import { Icon } from '@/components/Icon/Icon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import debounce from 'lodash.debounce'

type NodeProps = {
  id: string,
  title: string,
  hasChildren: boolean,
  level: number,
  pages?: NodeProps[]
}

type BranchProps = {
  node: NodeProps,
  onGetNode: (id: string, hasChildren: boolean) => void
  onDeleteNode: (id: string) => void
  idsPendingData: string[]
}

export const NavBarBranch = ({node, onGetNode, onDeleteNode, idsPendingData}: BranchProps) => {
  const [isNodeOpen, setNodeIsOpen] = useState(false)
  const router = useRouter()

  const onClickLink = useCallback((id: string, hasChildren: boolean) => {
    return debounce(
      () => {
        if (!hasChildren) return

        if (!isNodeOpen) {
          onGetNode(id, hasChildren)
          setNodeIsOpen(true)
        } else {
          onDeleteNode(id)
          setNodeIsOpen(false)
        }
      },
      1000,
      {leading: true, maxWait: 100, trailing: false}
    )()
  }, [isNodeOpen, onGetNode, onDeleteNode])

  const linkContainerClassNames = [
    styles.listContainer,
    node.level > 0 ? styles.listContainerSubLvl : '',
    router.asPath === `/#${node.id}` ? styles.listContainerActive : ''
  ].join(' ')
  const linkClassNames = [styles.link, isNodeOpen && node.pages ? styles.open : ''].join(' ')
  const findPendingId: string | undefined = idsPendingData.find((id) => node.id === id)

  return (
    <>
      <li
        className={linkContainerClassNames}
        data-test-lvl={node.level}
        data-test-open={isNodeOpen}
        data-test-haschildren={node.hasChildren}
      >
        <Link
          className={linkClassNames}
          style={{'--lvl': `${node.level}`} as React.CSSProperties}
          href={`#${node.id}`}
          onClick={() => onClickLink(node.id, node.hasChildren)}
        >
          <div className={styles.linkTitle}>
            {node.hasChildren && (
              <Icon name="triangle" className={styles.linkIcon} aria-hidden={true}/>
            )}
            {node.title}
            {findPendingId && <span className={styles.dot} data-test-loading="navBarNodeLoading" aria-hidden={true}/>}
          </div>
        </Link>
      </li>
      {node.pages && node.pages.map((page: NodeProps) => (
        <NavBarBranch
          key={page.id}
          node={page}
          onGetNode={onGetNode}
          onDeleteNode={onDeleteNode}
          idsPendingData={idsPendingData}
        />
      ))}
    </>
  )
}
