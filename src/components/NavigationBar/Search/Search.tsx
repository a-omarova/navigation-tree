import React from 'react'
import styles from './Search.module.css';
import { Icon } from '@/components/Icon/Icon'

type Search = {
  onChangeSearch: (e: React.FormEvent<HTMLInputElement>) => void,
  search: string,
  onClearSearch: () => void
}
export const Search = ({search, onChangeSearch, onClearSearch}: Search) => {

  return (
    <div className={styles.container} data-test="searchContainer">
      <input
        type="text"
        data-test="searchInput"
        value={search}
        placeholder="Search"
        className={styles.search}
        onChange={(e) => onChangeSearch(e)}
      />
      <button
        type="button"
        data-test="searchClearBtn"
        className={styles.clearBtn}
        onClick={onClearSearch}
      >
        <Icon name="close" onClick={onClearSearch}/>
      </button>
    </div>
  )
}
