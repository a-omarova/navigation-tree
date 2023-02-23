import { useCallback } from 'react'
import { TreeSearchType } from '@/types'

export default function useTree () {
  const addNode = useCallback(({node, id, data}: TreeSearchType) => {
    if (node.id === id && !node.pages) {
      node.pages = data
    } else if (node.pages) {
      node.pages.forEach((page) => {
        addNode({node: page, id, data})
      })
    }
  }, [])

  const deleteNode = useCallback(({node, id}: TreeSearchType) => {
    if (node.id === id) {
      delete node.pages
    } else if (node.pages) {
      node.pages.forEach((page) => {
        deleteNode({node: page, id})
      })
    }
  }, [])

  return {
    addNode,
    deleteNode
  }
}
