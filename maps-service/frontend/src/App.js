import './App.css';
import { SnackbarProvider } from 'notistack'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Mapping from './pages/Mappping'

function App() {

  return (
    <div className="App">
     <SnackbarProvider>
        <BrowserRouter>
          <Switch>
            <Route path={`/orders/:id/mapping`} component={Mapping} exact={true} />
          </Switch>
        </BrowserRouter>
     </SnackbarProvider>
    </div>
  );
}

export default App;
