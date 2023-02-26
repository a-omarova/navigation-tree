import React, { useCallback, useContext } from 'react'
import styles from './NavBarBranch.module.css'
import { Icon } from '@/components/Icon/Icon'
import Link from 'next/link'
import { PageType } from '@/types'
import { StoreContext } from '@/context/store.context'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'

type BranchProps = {
  node: PageType,
  isSearch: boolean
}

export const NavBarBranch = ({node, isSearch}: BranchProps) => {
  const {state, dispatch} = useContext(StoreContext)
  const router = useRouter()

  const branch = useCallback((id: string) => {
    const branch: string[] = []

    const findBranch = (branchId: string) => {
      const childNodes = state.data && state.data.entities.pages[branchId].pages

      if (childNodes) {
        branch.push(...childNodes)
      } else {
        return
      }

      childNodes.forEach((childId) => {
        findBranch(childId)
      })
    }

    findBranch(id)

    return branch
  }, [state.data])

  const onClickLink = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    return debounce(
      () => {
        router.push(`/?url=${node.url || '' }`, undefined, {shallow: true})
        const pages = state.data?.entities.pages[node.id].pages

        if (!pages) return
        e.currentTarget.classList.toggle(styles.open);

        const nodeIndex = state.listOfNodes.indexOf(node.id)
        const childNodeIndex = state.listOfNodes.indexOf(pages[0], nodeIndex)
        let list = state.listOfNodes

        if (childNodeIndex > -1) {
          list = list.filter(item => {
            return !branch(node.id).includes( item );
          })
        } else {
          list.splice(nodeIndex + 1, 0, ...pages)
        }

        dispatch({
          type: 'SET_LIST_OF_NODES',
          payload: {listOfNodes: list}
        })
      },
      500,
      {leading: true, maxWait: 100, trailing: false}
    )()
  }, [branch, dispatch, node.id, node.url, router, state.data?.entities.pages, state.listOfNodes])

  const linkContainerClassNames = [
    styles.linkContainer,
    node.url && node.url === router.query.url && styles.listContainerActive
  ].join(' ')

  return (
    <li className={linkContainerClassNames}>
      <Link
        className={styles.link}
        style={{'--lvl': `${!isSearch ? node.level : 0}`} as React.CSSProperties}
        href={`${node.url}`}
        onClick={onClickLink}
      >
        <div className={styles.linkTitle}>
          {!isSearch && node.pages && (
            <Icon name="triangle" className={styles.linkIcon} aria-hidden={true}/>
          )}
          {node.title}
        </div>
      </Link>
    </li>
  )
}
