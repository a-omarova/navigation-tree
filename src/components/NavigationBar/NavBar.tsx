import React, { useCallback, useEffect, useState } from 'react'
import styles from './NavBar.module.css'
import axios from 'axios'
import { NavBarBranch } from '@/components/NavigationBar/NavBarBranch'

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
  data: NodeProps[]
}

export const NavBar = () => {
  const [data, setData] = useState<NodeProps[] | []>([])
  const [idsPendingData, setIdsPendingData] = useState<string[]>([])

  console.log(idsPendingData)

  useEffect(() => {
    axios.get('http://localhost:3000/api/data/top-level')
      .then(function (response) {
        setTimeout(() => {
          setData(response.data)
        }, 1000)
      })

  }, [])

  const treeSearch = useCallback(({node, id, data}: TreeSearchType) => {
    if (node.id === id && !node.pages) {
      node.pages = data
    } else if (node.pages) {
      node.pages.forEach((page) => {
        treeSearch({node: page, id, data})
      })
    }
  }, [])

  const onGetNode = useCallback(async (id: string) => {
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
            treeSearch({node, id, data: response.data})
          })

          setData(newData)
        }, 1000)
      })
      .catch(() => {
        setIdsPendingData((prevData) => deletePendingData(id, prevData))
      })
  }, [data, idsPendingData, treeSearch])

  return (
    <nav className={styles.root}>
      <ul>
        {data && data.map(topLvlNode => (
          <NavBarBranch
            key={topLvlNode.id}
            node={topLvlNode}
            onGetNode={onGetNode}
            idsPendingData={idsPendingData}
          />
        ))}
      </ul>
    </nav>

  )
}
