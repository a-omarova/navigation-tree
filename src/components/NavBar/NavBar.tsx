import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from './NavBar.module.css'
import axios from 'axios'
import { NavBarBranch } from '@/components/NavBar/NavBarBranch'
import { Icon } from '../Icon/Icon'
import { Search } from '@/components/NavBar/Search/Search'
import { NavBarDataContext } from '@/context/navBarData.context'
import { TreeSearchType } from '@/types'

export const NavBar = () => {
  const {state, dispatch} = useContext(NavBarDataContext)
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

  const addOrDeleteTreeNode = useCallback(({node, id, data}: TreeSearchType) => {
    if (node.id === id) {
      // if has response data
      if (data && !node.pages) {
        node.pages = data
      } else { // delete if hasn't
        delete node.pages
      }
    } else if (node.pages) {
      node.pages.forEach((page) => {
        addOrDeleteTreeNode({node: page, id, data})
      })
    }
  }, [])

  const onGetNode = useCallback(async (id: string, hasChildren: boolean) => {
    if (!hasChildren) return null

    const newData = [...state.data]
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
            addOrDeleteTreeNode({node, id, data: response.data})
          })
          dispatch({
            type: 'SET_DATA',
            payload: {data: newData}
          })
        }, 1000)
      })
      .catch(() => {
        setIdsPendingData((prevData) => deletePendingData(id, prevData))
      })
  }, [state.data, idsPendingData, dispatch, addOrDeleteTreeNode])

  const onDeleteNode = useCallback((id: string) => {
    const newData = [...state.data]
    newData.forEach((node) => {
      addOrDeleteTreeNode({node, id})
    })
  }, [addOrDeleteTreeNode, state.data])

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
