import React, { createContext, ReactNode } from 'react'
import { NodeProps } from '@/types'

interface StoreProps {
  children?: ReactNode
}

interface DataState {
  data: NodeProps[] | [],
  search: string,
  cache: NodeProps[] | [],
}

interface DataAction {
  type: 'SET_DATA' | 'SET_SEARCH' | 'SET_CACHE';
  payload: DataState;
}

const initialState = {
  data: [],
  search: '',
  cache: []
}
const reducer = (state: DataState, action: DataAction) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload.data
      }
    case 'SET_CACHE':
      return {
        ...state,
        cache: action.payload.cache
      }
    case 'SET_SEARCH':
      return {
        ...state,
        search: action.payload.search
      }
    default:
      return state
  }
}

export const StoreContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null
})

export const StoreProvider: React.FC<StoreProps> = ({children}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return <StoreContext.Provider value={{state, dispatch}}>{children}</StoreContext.Provider>
}
