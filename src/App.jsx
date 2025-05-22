import { GlobalProvider } from './context/GlobalContext'
import Game from './components/Game/Game'
import Leaderboard from './components/Leaderboard/Leaderboard'
import './App.scss'
import Banner from './components/Banner/Banner'
import Rules from './components/Rules/Rules'

function App() {
  return (
    <GlobalProvider>
      <div className="app-container">
        <h1>Croco Promotion</h1>
        <div className="content">
          <Banner />
          <Game />
          <div className="leaderboards">
            <Leaderboard />
            <Leaderboard />
          </div>
          <Rules />
        </div>
      </div>
    </GlobalProvider>
  )
}

export default App
