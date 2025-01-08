import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { WalletContextProvider } from './context/WalletContext';
import WalletConnect from './components/WalletConnect';
import Dashboard from './components/Dashboard';
import NFTAnalytics from './components/NFTAnalytics';

function App() {
  return (
    <WalletContextProvider>
      <Router>
        <div className="App">
          <WalletConnect />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/nft" component={NFTAnalytics} />
          </Switch>
        </div>
      </Router>
    </WalletContextProvider>
  );
}

export default App; 