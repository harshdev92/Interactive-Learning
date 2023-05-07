import { useEffect, useReducer } from 'react'
import './App.css'
import { produce } from 'immer'

const initialState = {  
  users: [],
  toggleColor: false,
}

type State = typeof initialState

type Action = {
  type: 'SET_USERS'
  payload: any;
} | {
  type: 'SORT_USERS'
  payload: any;

} | {
  type: 'TOGGLE_COLOR'
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
    case 'SET_USERS':
     return produce(state, (draftState) => {
        draftState.users = action.payload
      })
    case 'SORT_USERS':
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
    case 'TOGGLE_COLOR':
      return produce(state, (draftState) => {
        draftState.toggleColor = !draftState.toggleColor
      })
    default:
      return state
  }
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: 'SET_USERS',
          payload: json.results,
        })
      }
      )
  }, [])

  const handleDelete = (id: string) => {
    dispatch({
      type: 'SET_USERS',
      payload: state.users.filter((user: User) => user.login.uuid !== id),
    })
  }

  const handleSort = () => {  
    dispatch({
      type: 'SORT_USERS',
      payload: state.users,
    })

  }

  const handleColorToggle = () => {
    dispatch({
      type: 'TOGGLE_COLOR',
      payload: state.toggleColor,
    })
  }



  return (
    <>
      <button onClick={handleSort}> Sort by country</button>
      <button onClick={handleColorToggle}> Toggle color</button>
      <button> Refresh</button>
      <button> Restore</button>
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
            <tr key={user.login.uuid}>
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