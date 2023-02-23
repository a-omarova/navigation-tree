import React, { createContext, ReactNode } from 'react'
import { NodeProps } from '@/types'

interface NavBarDataProps {
  children?: ReactNode
}

interface DataState {
  data: NodeProps[] | [],
  search: string
}

interface DataAction {
  type: 'SET_DATA' | 'SET_SEARCH';
  payload: DataState;
}

const initialState = {
  data: [],
  search: ''
}
const reducer = (state: DataState, action: DataAction) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload.data
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

export const NavBarDataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null
})

export const NavBarDataProvider: React.FC<NavBarDataProps> = ({children}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return <NavBarDataContext.Provider value={{state, dispatch}}>{children}</NavBarDataContext.Provider>
}
