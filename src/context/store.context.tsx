import React, { createContext, ReactNode } from 'react'
import { DataType } from '@/types'

interface StoreProps {
  children?: ReactNode
}

interface DataState {
  data: DataType | null,
  searchValue: string,
  searchIds: string[],
  listOfNodes: string[],
  listOfAllNodesId: string[]
}

interface DataAction {
  type: 'SET_DATA' | 'SET_LIST_OF_NODES' | 'SET_All_NODE_IDS' | 'SET_SEARCH_VALUE' | 'SET_SEARCH_IDS';
  payload: DataState;
}

const initialState = {
  data: null,
  searchValue: '',
  searchIds: [],
  listOfNodes: [],
  listOfAllNodesId: []
}
const reducer = (state: DataState, action: DataAction) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload.data
      }
    case 'SET_SEARCH_VALUE':
      return {
        ...state,
        searchValue: action.payload.searchValue
      }
    case 'SET_SEARCH_IDS':
      return {
        ...state,
        searchIds: action.payload.searchIds
      }
    case 'SET_LIST_OF_NODES':
      return {
        ...state,
        listOfNodes: action.payload.listOfNodes
      }
    case 'SET_All_NODE_IDS':
      return {
        ...state,
        listOfAllNodesId: action.payload.listOfAllNodesId
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
