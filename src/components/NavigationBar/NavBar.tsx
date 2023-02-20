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

  useEffect(() => {
    axios.get('http://localhost:3000/api/data/top-level')
      .then(function (response) {
        setTimeout(() => {
          setData(response.data)
        }, 1000)
      })

  }, [])

  const treeSearch = useCallback(({node, id, data}: TreeSearchType) => {
    if (node.id === id) {
      node.pages = data
    } else if (node.pages) {
      node.pages.forEach((page) => {
        console.log('aloha')
        treeSearch({node: page, id, data})
      })
    }
  }, [])

  const onGetNode = useCallback( (id: string) => {
    const newData = [...data]

    console.log(id)

    axios.get(`http://localhost:3000/api/data/${id}`)
      .then(function (response) {
        newData.forEach((node) => {
          treeSearch({node, id, data: response.data})
        })
      })
  }, [data, treeSearch])


  return (
    <nav className={styles.root}>
      <ul>
        {data && data.map(topLvlNode => (
          <NavBarBranch
            key={topLvlNode.id}
            node={topLvlNode}
            onGetNode={onGetNode}
          />
        ))}
      </ul>
    </nav>

  )
}
