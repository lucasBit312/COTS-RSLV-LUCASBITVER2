import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import listPage from './pages/listPage';
import detailPage from './pages/detailPage';
import { Box } from '@mui/material';

function Foods() { 
    const { path } = useRouteMatch();
    return (
        <Box>
            <Switch>
                <Route path={path} exact component={listPage} />
                <Route path={`${path}/:foodSlug`} component={detailPage} />
            </Switch>
        </Box>
    );
}

export default Foods;
