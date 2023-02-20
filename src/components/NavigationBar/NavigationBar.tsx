import React, { useCallback, useMemo } from 'react'
import styles from './NavigationBar.module.css'
import { DataType, PageType } from '@/types'
import { Icon } from '@/components/Icon/Icon'
import Link from 'next/link'

type NavigationBarPropsType = {
  data: DataType | null
}

export const NavigationBar: React.FC<NavigationBarPropsType> = ({data}) => {

  const getTopLvlData = useMemo(() => {
    return (id: string) => {
      return data ? data.entities.pages[id] : undefined
    }
  }, [data])

  const renderSections = useCallback((section: PageType | undefined) => {
    return (
      section && (
        <li key={section.id}>
          <Link
            className={styles.link}
            style={{'--lvl-padding': `${section.level} * 16px`} as React.CSSProperties}
            href=""
          >
            {section.pages && <Icon name="triangle" className={styles.linkIcon}/>}
            {section.title}
          </Link>
          <ul style={{display: "none"}}>
            {section.pages && section.pages.map((id: string) => (
              data && renderSections(data?.entities.pages[id])
            ))}
          </ul>
        </li>
      )
    )
  }, [data])


  return (data && (
    <nav className={styles.root}>
      <ul>
        {data && data.topLevelIds.map(id => (
          renderSections(getTopLvlData(id))
        ))}
      </ul>
    </nav>
  ))
}
