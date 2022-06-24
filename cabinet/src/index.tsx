import {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

ReactDOM.render(
  <StrictMode>
    <App/>
  </StrictMode>,
  document.getElementById('root'),
);
