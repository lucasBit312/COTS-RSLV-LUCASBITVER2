import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import listPage from './pages/listPage';
import detailPage from './pages/detailPage';
import { Box } from '@mui/material';
import CategoryComponent from './components/CategoryComponent';

function CategoryFood() { 
    const { path } = useRouteMatch();
    return (
        <Box>
            <Switch>
                <Route path={path} exact component={CategoryComponent} />
                <Route path={`${path}/:foodSlug`} component={detailPage} />
            </Switch>
        </Box>
    );
}

export default CategoryFood;
