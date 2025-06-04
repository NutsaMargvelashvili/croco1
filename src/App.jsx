import { GlobalProvider } from './context/GlobalContext'
import Game from './components/Game/Game'
import './App.scss'
import Rules from './components/Rules/Rules'
import Balance from './components/Balance/Balance'
import Progress from './components/Progress/Progress'
import Withdraw from './components/Withdraw/Withdraw'

function App() {
  return (
    <GlobalProvider>
      <div className="app-container">
        <h1>Croco Promotion 2</h1>
        <div className="content">
          <Progress />
          <Game />
          <Balance />
          <Withdraw />
          <Rules />
        </div>
      </div>
    </GlobalProvider>
  )
}

export default App
