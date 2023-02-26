import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from './Search.module.css'
import { Icon } from '@/components/Icon/Icon'
import { facts } from './facts'
import { StoreContext } from '@/context/store.context'

export const Search = () => {
  const {state, dispatch} = useContext(StoreContext)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [fact, setFact] = useState<string>('')

  const getSearchData = useCallback(() => {
    const list: string[] = []

    state.listOfAllNodesId.forEach((id) => {
      if (state.data && state.data.entities.pages[id].title.toLocaleLowerCase().includes(state.searchValue)) {
        list.push(id)
      }
    })

    dispatch({
      type: 'SET_SEARCH_IDS',
      payload: {searchIds: list}
    })
  }, [dispatch, state.data, state.listOfAllNodesId, state.searchValue])

  const generateRandomInRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const onClearSearch = useCallback(() => {
    dispatch({
      type: 'SET_SEARCH_VALUE',
      payload: {searchValue: ''}
    })
    setIsPending(false)
    dispatch({
      type: 'SET_SEARCH_IDS',
      payload: {searchIds: []}
    })
    dispatch({
      type: 'SET_SEARCH_VALUE',
      payload: {searchValue: ''}
    })
  }, [dispatch])

  const onChangeSearch = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setIsPending(true)

    dispatch({
      type: 'SET_SEARCH_VALUE',
      payload: {searchValue: e.currentTarget.value.toLocaleLowerCase()}
    })

    if (e.currentTarget.value.length === 0) {
      onClearSearch()
    }
  }, [dispatch, onClearSearch])

  useEffect(() => {
    if (state.searchValue.length === 0) return

    const delayDebounceFn = setTimeout(() => {
      getSearchData()
      setIsPending(false)
      setFact(facts[generateRandomInRange(0, facts.length - 1)])
    }, 600)

    return () => clearTimeout(delayDebounceFn)
  }, [getSearchData, state.searchValue])

  return (
    <div className={styles.container} data-test-search="container">
      <input
        type="text"
        data-test-search="input"
        value={state.searchValue}
        placeholder="Search"
        className={styles.search}
        onChange={(e) => onChangeSearch(e)}
      />
      {state.searchValue.length !== 0 && (
        <button
          type="button"
          data-test-search="clearButton"
          className={styles.clearBtn}
          onClick={onClearSearch}
        >
          <Icon name="close" onClick={onClearSearch} aria-hidden={true}/>
          <span className="visually-hidden">Clear search</span>
        </button>
      )}
      {isPending && <Icon name="spinner" className={styles.spinner} data-test-search="spinner"/>}
      {state.searchIds.length === 0 && state.searchValue.length !== 0 && !isPending && (
        <div data-test-search="emptyText">
          <p className={styles.text}>
            Sorry, can&apos;t find anything
          </p>
          <p className={styles.textTitle}>But here some interesting fact:</p>
          <p className={styles.facts}>{fact}</p>
        </div>
      )}
    </div>
  )
}
