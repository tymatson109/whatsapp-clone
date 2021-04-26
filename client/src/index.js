import ReactDOM from 'react-dom';
import App from './components/App';
import reducer, {initialState} from './components/Reducer';
import { StateProvider } from './components/StateProvider';
import './index.css';

ReactDOM.render(
<StateProvider initialState={initialState} reducer={reducer}>
    <App />
</StateProvider>
, document.querySelector("#root"))