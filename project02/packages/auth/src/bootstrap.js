import React from 'react';
import ReactDOM from 'react-dom';

import {createBrowserHistory, createMemoryHistory} from 'history';

import App from './App'

const mount = (el, {onNavigate, defaultHistory}) => {
    const history = defaultHistory || createMemoryHistory();

    if (onNavigate) {
        history.listen(onNavigate);
    }

    ReactDOM.render(<App history={history}/>, el);

    return {
        onParentNavigate({pathname: nextPathName}) {
            console.log('Container just navigated to', nextPathName);

            if (history.location.pathname !== nextPathName) {
                history.push(nextPathName);
            }
        }
    };
};

if (process.env.NODE_ENV === 'development') {
    const el = document.querySelector('#_auth-dev-root');

    if (el) {
        console.log('Running in isolation')
        mount(el, {defaultHistory: createBrowserHistory()});
    }
}

export {mount};

