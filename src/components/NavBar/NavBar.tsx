import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from './NavBar.module.css'
import axios from 'axios'
import { NavBarBranch } from '@/components/NavBar/NavBarBranch'
import { Icon } from '../Icon/Icon'
import { Search } from '@/components/NavBar/Search/Search'
import { StoreContext } from '@/context/store.context'
import { NodeProps, TreeSearchType } from '@/types'


export const NavBar = () => {
  const {state, dispatch} = useContext(StoreContext)
  const [idsPendingData, setIdsPendingData] = useState<string[]>([])

  const getTopLvlData = useCallback(() => {
    axios.get('http://localhost:3000/api/data/top-level')
      .then(function (response) {
        setTimeout(() => {
          dispatch({
            type: "SET_DATA",
            payload: {data: response.data}
          })
        }, 1000)
      })
  }, [dispatch])

  useEffect(() => {
    getTopLvlData()
  }, [getTopLvlData])

  useEffect(() => {
    if (state.search.length === 0) {
      getTopLvlData()
    }
  }, [getTopLvlData, state.search.length])

  const addTreeNode = useCallback(({node, id, data}: TreeSearchType) => {
    if (node.id === id && !node.pages) {
      node.pages = data
    } else if (node.pages) {
      node.pages.forEach((page) => {
        addTreeNode({node: page, id, data})
      })
    }
  }, [])

  const deleteTreeNode = useCallback(({node, id}: TreeSearchType) => {
    if (node.id === id) {
      delete node.pages
    } else if (node.pages) {
      node.pages.forEach((page) => {
        deleteTreeNode({node: page, id})
      })
    }
  }, [])

  const findNodeInCache = useCallback((node: NodeProps, id: string) => {
    if (node.id === id) {
      console.log('node.pages', node.pages)
      return node.pages
    } else if (node.pages) {
      node.pages.forEach((page) => {
        findNodeInCache(page, id)
      })
    }
  }, [])

  const onGetNode = useCallback(async (id: string) => {
    const newData = [...state.data]
    const cache = [...state.cache]
    let dataFromCache;

    console.log('cache', cache.length)

    cache.forEach((node) => {
      dataFromCache = findNodeInCache(node, id)
    })

    if (dataFromCache) {
      dispatch({
        type: 'SET_DATA',
        payload: {data: newData}
      })

      return
    }

    const dataAlreadyPending = idsPendingData.find((dataId) => dataId === id)
    const deletePendingData = (deleteId: string, currentData: string[]) => currentData.filter((dataId) => dataId !== deleteId)

    if (!dataAlreadyPending) {
      setIdsPendingData((data) => [...data, id])
    }

    await axios.get(`http://localhost:3000/api/data/${id}`)
      .then(function (response) {
        setTimeout(() => {
          setIdsPendingData((prevData) => deletePendingData(id, prevData))
          newData.forEach((node) => {
            addTreeNode({node, id, data: response.data})
          })
          dispatch({
            type: 'SET_DATA',
            payload: {data: newData}
          })
          dispatch({
            type: 'SET_CACHE',
            payload: {cache: new Set([...state.cache, ...newData, ...state.cache])}
          })
        }, 1000)
      })
      .catch(() => {
        setIdsPendingData((prevData) => deletePendingData(id, prevData))
      })
  }, [state.data, state.cache, findNodeInCache, idsPendingData, addTreeNode, dispatch])

  const onDeleteNode = useCallback((id: string) => {
    const newData = [...state.data]
    newData.forEach((node) => {
      deleteTreeNode({node, id})
    })
  }, [deleteTreeNode, state.data])

  return (
    <nav className={styles.root}>
      <div className={styles.search}>
        <Search />
      </div>
      {state.data.length !== 0 && (
        <ul data-test="navBar">
          {state.data.map(topLvlNode => (
            <NavBarBranch
              key={topLvlNode.id}
              node={topLvlNode}
              onGetNode={onGetNode}
              onDeleteNode={onDeleteNode}
              idsPendingData={idsPendingData}
            />
          ))}
        </ul>
      )}
      {state.data.length === 0 && state.search.length === 0 && (
        <div data-test-preload="navBarPreload">
          <Icon
            name="navPreload"
            className={styles.preload}
          />
        </div>
      )}
    </nav>
  )
}
