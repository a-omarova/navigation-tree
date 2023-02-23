import { useCallback, useContext } from 'react'
import { NodeProps } from '@/types'
import { StoreContext } from '@/context/store.context'

type useCacheType = {
  node: NodeProps,
  id: string
}

export default function useCache () {
  const {state, dispatch} = useContext(StoreContext)

  const findInCache = useCallback(({node, id}: useCacheType) => {
    if (node.id === id) {

      console.log(node)
      return node
    } else if (node.pages) {
      node.pages.forEach((page) => {
        findInCache({node: page, id})
      })
    }
  }, [])

  const addToCache = useCallback((data: NodeProps[]) => {
    dispatch({
      type: 'SET_CACHE',
      payload: {cache: new Set([...state.cache, ...data])}
    })
  }, [dispatch, state.cache])

  return {
    addToCache,
    findInCache
  }
}
