import { useCallback, useContext } from 'react'
import { NodeProps } from '@/types'
import { StoreContext } from '@/context/store.context'
import cloneDeep from 'lodash.clonedeep'

export default function useCache () {
  const {state, dispatch} = useContext(StoreContext)

  const findInCache = useCallback((id: string) => {
    let findNode: NodeProps | undefined = undefined
    const find = (node: NodeProps, id: string) => {
      if (node.id === id && node.pages) {
        findNode = node
      } else if (node.pages) {
        node.pages.forEach((page) => {
          find(page, id)
        })
      }
    }

    cloneDeep(state.cache).forEach((node) => {
      find(node, id)
    })

    return findNode
  }, [state.cache])

  const addToCache = useCallback((id: string, data: NodeProps[]) => {
    // @ts-ignore
    const newData = [...new Set(cloneDeep(state.cache))]



    const add = (node: NodeProps, id: string) => {
      if (node.id === id && !node.pages) {
        node.pages = data
      } else if (node.pages) {
        node.pages.forEach((page) => {
          add(page, id)
        })
      }
    }

    // @ts-ignore
    newData.forEach((node) => {
      add(node, id)
    })

    dispatch({
      type: 'SET_CACHE',
      payload: {cache: newData}
    })

  }, [dispatch, state.cache])

  return {
    addToCache,
    findInCache
  }
}
