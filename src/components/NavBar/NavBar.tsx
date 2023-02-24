import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from './NavBar.module.css'
import axios from 'axios'
import { NavBarBranch } from '@/components/NavBar/NavBarBranch'
import { Icon } from '../Icon/Icon'
import { Search } from '@/components/NavBar/Search/Search'
import { StoreContext } from '@/context/store.context'
import { NodeProps } from '@/types'
import useCache from '@/hooks/useCache'
import useTree from '@/hooks/useTree'
import cloneDeep from 'lodash.clonedeep'


export const NavBar = () => {
  const {state, dispatch} = useContext(StoreContext)
  const [idsPendingData, setIdsPendingData] = useState<string[]>([])
  const {addToCache, findInCache} = useCache();
  const {addNode, deleteNode} = useTree();

  const getTopLvlData = useCallback(() => {
    axios.get('http://localhost:3000/api/data/top-level')
      .then(function (response) {
        setTimeout(() => {
          dispatch({
            type: "SET_DATA",
            payload: {data: response.data}
          })
          dispatch({
            type: "SET_CACHE",
            payload: {cache: response.data}
          })
        }, 1000)
      })
  }, [dispatch])

  useEffect(() => {
    if (state.search.length === 0) {
      getTopLvlData()
    }
  }, [getTopLvlData, state.search.length])

  const onGetNode = useCallback(async (id: string) => {
    const newData = cloneDeep(state.data)
    let dataFromCache: NodeProps | undefined = findInCache(id);

    if (dataFromCache) {
      newData.forEach((node) => {
        if (dataFromCache) {
          addNode({node, id, data: dataFromCache.pages})
        }
      })

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
            addNode({node, id, data: response.data})
          })
          dispatch({
            type: 'SET_DATA',
            payload: {data: newData}
          })
          addToCache(id, response.data);
        }, 1000)
      })
      .catch(() => {
        setIdsPendingData((prevData) => deletePendingData(id, prevData))
      })
  }, [state.data, findInCache, idsPendingData, dispatch, addNode, addToCache])

  const onDeleteNode = useCallback((id: string) => {
    const newData = [...state.data]
    newData.forEach((node) => {
      deleteNode({node, id})
    })

  }, [deleteNode, state.data])

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
        <div data-test-preload="navBarPreload" >
          <span className="visually-hidden">Loading data</span>
          <Icon
            name="navPreload"
            className={styles.preload}
            aria-hidden={true}
          />
        </div>
      )}
    </nav>
  )
}
