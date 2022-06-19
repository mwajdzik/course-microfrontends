import React from 'react';
import {Route, Router, Switch} from 'react-router-dom';
import {createGenerateClassName, StylesProvider} from '@material-ui/core/styles';

const generateClassName = createGenerateClassName({
    productionPrefix: 'au'
});

export default ({history}) => {
    return <div>
        <StylesProvider generateClassName={generateClassName}>
            <Router history={history}>
                <Switch>
                </Switch>
            </Router>
        </StylesProvider>
    </div>
};
