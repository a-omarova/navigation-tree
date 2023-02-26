import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from './NavBar.module.css'
import axios from 'axios'
import { NavBarBranch } from '@/components/NavBar/NavBarBranch'
import { Icon } from '../Icon/Icon'
import { Search } from '@/components/NavBar/Search/Search'
import { StoreContext } from '@/context/store.context'


export const NavBar = () => {
  const [activeNode, setActiveNode] = useState<string>('')
  const [openNodesList, setOpenNodesList] = useState<string[]>([])
  const {state, dispatch} = useContext(StoreContext)

  const getData = useCallback(() => {
    axios.get('http://localhost:3000/api/data')
      .then(function (response) {
        dispatch({
          type: "SET_DATA",
          payload: {data: response.data}
        })
        dispatch({
          type: "SET_LIST_OF_NODES",
          payload: {listOfNodes: response.data.topLevelIds}
        })
        dispatch({
          type: "SET_All_NODE_IDS",
          payload: {listOfAllNodesId: Object.keys(response.data.entities.pages)}
        })
      })
  }, [dispatch])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <nav className={styles.root}>
      <div className={styles.search}>
        <Search />
      </div>
      {state.data && state.searchValue.length === 0 && (
        <ul data-test-navbar="navBar">
          {state.listOfNodes.map(id => (
            state.data && (
              <NavBarBranch
                key={id}
                node={state.data.entities.pages[id]}
                isSearch={false}
                activeNode={activeNode}
                setActiveNode={setActiveNode}
                openNodesList={openNodesList}
                setOpenNodesList={setOpenNodesList}
              />
            )
          ))}
        </ul>
      )}
      {!state.data && (
        <div data-test-navbar="preload" >
          <span className="visually-hidden">Loading data</span>
          <Icon
            name="navPreload"
            className={styles.preload}
            aria-hidden={true}
          />
        </div>
      )}
      {state.searchIds.length !== 0 && (
        <ul data-test-navbar="search">
          {state.searchIds.map(id => (
            state.data && (
              <NavBarBranch
                key={id}
                node={state.data.entities.pages[id]}
                isSearch={true}
                activeNode={activeNode}
                setActiveNode={setActiveNode}
                openNodesList={openNodesList}
                setOpenNodesList={setOpenNodesList}
              />
            )
          ))}
        </ul>
      )}
    </nav>
  )
}
