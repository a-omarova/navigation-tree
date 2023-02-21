import React, { useCallback, useEffect, useState } from 'react'
import styles from './NavBar.module.css'
import axios from 'axios'
import { NavBarBranch } from '@/components/NavigationBar/NavBarBranch'
import { Icon } from '../Icon/Icon'
import { Search } from '@/components/NavigationBar/Search/Search'

type NodeProps = {
  id: string,
  title: string,
  hasChildren: boolean,
  level: number,
  pages?: NodeProps[]
}

type TreeSearchType = {
  node: NodeProps,
  id: string,
  data?: NodeProps[]
}

export const NavBar = () => {
  const [data, setData] = useState<NodeProps[] | []>([])
  const [search, setSearch] = useState<string>('')
  const [searchTimer, setSearchTimer] = useState<number | undefined>(undefined)
  const [idsPendingData, setIdsPendingData] = useState<string[]>([])
  const [isPendingSearch, setIsPendingSearch] = useState<boolean>(false)

  const getTopLvlData = useCallback(() => {
    axios.get('http://localhost:3000/api/data/top-level')
      .then(function (response) {
        setTimeout(() => {
          setData(response.data)
        }, 1000)
      })
  }, [])

  useEffect(() => {
    getTopLvlData()
  }, [getTopLvlData])

  const addDeleteTreeNode = useCallback(({node, id, data}: TreeSearchType) => {
    if (node.id === id) {
      // if has response data
      if (data && !node.pages) {
        node.pages = data
      } else { // delete if hasn't
        delete node.pages
      }
    } else if (node.pages) {
      node.pages.forEach((page) => {
        addDeleteTreeNode({node: page, id, data})
      })
    }
  }, [])

  const onGetNode = useCallback(async (id: string, hasChildren: boolean) => {

    if (!hasChildren) return null

    const newData = [...data]
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
            addDeleteTreeNode({node, id, data: response.data})
          })
          setData(newData) // ?
        }, 1000)
      })
      .catch(() => {
        setIdsPendingData((prevData) => deletePendingData(id, prevData))
      })
  }, [data, idsPendingData, addDeleteTreeNode])

  const onDeleteNode = useCallback((id: string) => {
    const newData = [...data]
    newData.forEach((node) => {
      addDeleteTreeNode({node, id})
    })
  }, [addDeleteTreeNode, data])

  const onChangeSearch = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)

    window.clearTimeout(searchTimer)

    const newTimer: number = window.setTimeout(() => {
      setIsPendingSearch(true)
      axios.get(`http://localhost:3000/api/search/${search}`)
        .then(function (response) {
          setTimeout(() => {
            setData(response.data)
            setIsPendingSearch(false)
          }, 1000)
        })
        .catch(() => {
          setIsPendingSearch(false)
        })
    }, 500)

    setSearchTimer(newTimer)
  }, [search, searchTimer])

  const onClearSearch = useCallback(() => {
    setSearch('')
    getTopLvlData()
  }, [])

  return (
    <nav className={styles.root}>
      <div className={styles.search}>
        <Search
          search={search}
          onChangeSearch={onChangeSearch}
          onClearSearch={onClearSearch}
        />
        {isPendingSearch && <div className={styles.searchTitle}>Searching {search}...</div>}
      </div>
      {data.length !== 0 && (
        <ul>
          {data.map(topLvlNode => (
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
      {data.length === 0 && search.length === 0 && (
        <Icon name="navPreload" className={styles.preload}/>
      )}
    </nav>
  )
}
