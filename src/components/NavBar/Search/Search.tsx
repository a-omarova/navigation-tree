import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from './Search.module.css'
import { Icon } from '@/components/Icon/Icon'
import { facts } from './facts'
import { StoreContext } from '@/context/store.context'
import axios from 'axios'

export const Search = () => {
  const {state, dispatch} = useContext(StoreContext)
  const [isPending, setIsPending] = useState<boolean>(false)

  const getSearchData = useCallback((value: string) => {
    axios.get(`http://localhost:3000/api/search/${value}`)
      .then(function (response) {
        setIsPending(true)
        setTimeout(() => {
          dispatch({
            type: 'SET_DATA',
            payload: {data: response.data}
          })
          setIsPending(false)
        }, 1000)
      })
      .catch(() => {
        setIsPending(false)
      })
  }, [dispatch])

  const generateRandomInRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const onChangeSearch = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_SEARCH',
      payload: {search: e.currentTarget.value}
    })
  }, [dispatch])

  const onClearSearch = useCallback(() => {
    dispatch({
      type: 'SET_SEARCH',
      payload: {search: ''}
    })
  }, [dispatch])

  useEffect(() => {
    if (state.search.length === 0) return

    const delayDebounceFn = setTimeout(() => {
      getSearchData(state.search)
    }, 600)

    return () => clearTimeout(delayDebounceFn)
  }, [getSearchData, state.search])

  return (
    <div className={styles.container} data-test="searchContainer">
      <input
        type="text"
        data-test="searchInput"
        value={state.search}
        placeholder="Search"
        className={styles.search}
        onChange={(e) => onChangeSearch(e)}
      />
      {state.search.length !== 0 && (
        <button
          type="button"
          data-test="searchClearBtn"
          className={styles.clearBtn}
          onClick={onClearSearch}
        >
          <Icon name="close" onClick={onClearSearch}/>
        </button>
      )}
      {isPending && <Icon name="spinner" className={styles.spinner}/>}
      {state.data.length === 0 && state.search.length !== 0 && (
        <>
          <p className={styles.text}>
            Sorry, can&apos;t find <span className={styles.searchValue}>{state.search}</span>
          </p>
          <p className={styles.textTitle}>But here some interesting fact:</p>
          <p className={styles.facts}>{facts[generateRandomInRange(0, facts.length - 1)]}</p>
        </>
      )}
    </div>
  )
}
