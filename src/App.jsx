import { GlobalProvider } from './context/GlobalContext'
import Game from './components/Game/Game'
import Leaderboard from './components/Leaderboard/Leaderboard'
import './App.scss'

function App() {
  return (
    <GlobalProvider>
      <div className="app-container">
        <h1>Croco Promotion</h1>
        <div className="content">
          <Game />
          <Leaderboard />
        </div>
      </div>
    </GlobalProvider>
  )
}

export default App
