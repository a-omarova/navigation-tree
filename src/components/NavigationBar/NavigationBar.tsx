import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './NavigationBar.module.css'
import newData from '@/data.json'
import { DataType, PageType } from '@/types'

export const NavigationBar = () => {
  const [data, setData] = useState<DataType | null>(null)

  useEffect(() => {
    setData(newData)
  }, [data])

  const getTopLvlData = useMemo(() => {
    return (id: string) => {
      return data ? data.entities.pages[id] : undefined
    }
  }, [data])

  const renderSections = useCallback((section: PageType | undefined) => {
    return (
      section && (
        <li key={section.id}>
          {section.pages
            ? (
              <>
                <button>{section.title}</button>
                {section.pages.map((id: string) => (
                  <ul key={id}>
                    {data && renderSections(data?.entities.pages[id])}
                  </ul>
                ))}
              </>
            )
            : (<div>{section.title}</div>)
          }
        </li>
      )
    )
  }, [data])


  return (
    <nav className={styles.root}>
      <ul>
        {data && data.topLevelIds.map(id => (
          renderSections(getTopLvlData(id))
        ))}
      </ul>
    </nav>
  )
}
