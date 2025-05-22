import { GlobalProvider } from './context/GlobalContext'
import Game from './components/Game/Game'
import Leaderboard from './components/Leaderboard/Leaderboard'
import './App.scss'
import Banner from './components/Banner/Banner'
import Rules from './components/Rules/Rules'
import Balance from './components/Balance/Balance'
import Withdraw from './components/Withdraw/Withdraw'

function App() {
  return (
    <GlobalProvider>
      <div className="app-container">
        <h1>Croco Promotion</h1>
        <div className="content">
          <Banner />
          <Balance />
          <Game />
          <Withdraw />
          <Leaderboard />
          <Rules />
        </div>
      </div>
    </GlobalProvider>
  )
}

export default App
