import { useEffect, useReducer } from 'react'
import './App.css'
import { produce } from 'immer'

const initialState = {  
  users: [],
  cloneusers: [],
  toggleColor: false,
}

type State = typeof initialState

enum ActionTypes {
  SET_USERS = 'SET_USERS',
  SORT_USERS = 'SORT_USERS',
  TOGGLE_COLOR = 'TOGGLE_COLOR',
  RESTORE_USERS = 'RESTORE_USERS',
  DELETE_USER = 'DELETE_USER',
}

type Action = {
  type: ActionTypes;
  payload: any;
} 


interface User {
  name: {
    first: string
    last: string
  }
  location: {
    country: string
  }
  login: {
    uuid: string
  }
}


const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_USERS:
     return produce(state, (draftState) => {
        draftState.users = action.payload
        draftState.cloneusers = action.payload
      })
    case ActionTypes.SORT_USERS:
      return produce(state, (draftState) => {
        draftState.users = draftState.users.sort((a: User, b: User) => {
          if (a.location.country < b.location.country) {
            return -1
          }
          if (a.location.country > b.location.country) {
            return 1
          }
          return 0
        }
        )
      })
    case ActionTypes.TOGGLE_COLOR:
      return produce(state, (draftState) => {
        draftState.toggleColor = !draftState.toggleColor
      })

    case ActionTypes.RESTORE_USERS:
      return produce(state, (draftState) => {
        draftState.users = draftState.cloneusers
      })

    case ActionTypes.DELETE_USER:
      return produce(state, (draftState) => {
        draftState.users = draftState.users.filter((user: User) => user.login.uuid !== action.payload)
      })



    default:
      return state
  }
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchUsers = () => {
    fetch('https://randomuser.me/api/?results=100')
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: ActionTypes.SET_USERS,
          payload: json.results,
        })
      }
      )
    }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = (id: string) => {
    dispatch({
      type: ActionTypes.DELETE_USER,
      payload: id,
    })
  }

  const handleSort = () => {  
    dispatch({
      type: ActionTypes.SORT_USERS,
      payload: state.users,
    })

  }

  const handleColorToggle = () => {
    dispatch({
      type: ActionTypes.TOGGLE_COLOR,
      payload: state.toggleColor,
    })
  }

  const handleRefresh = () => {
    fetchUsers()
  }

  const handleRestore = () => {
    dispatch({
      type: ActionTypes.RESTORE_USERS,
      payload: state.cloneusers,
    })
  }


  return (
    <>
      <button onClick={handleSort}> Sort by country</button>
      <button onClick={handleColorToggle}> Toggle color</button>
      <button onClick={handleRefresh}> Refresh</button>
      <button onClick={handleRestore}> Restore</button>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Country</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
         {state.users.map((user: User, index) => (
            <tr key={user.login.uuid} className={state.toggleColor && index % 2 === 0 ? 'even-color' : 'odd-color'}>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => handleDelete(user.login.uuid)}>Delete</button>
              </td>
            </tr>
          ))}
          </tbody>
      </table>
    </>
  )
}

export default App