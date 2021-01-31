import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { ListServicesPage } from './pages/ListServicesPage';
import { NewServicePage } from './pages/NewServicePage';
import ServiceDetailPage from './pages/ServiceDetailPage';

const routes = {
    root: "/",
    new: "/service/new",
    serviceDetail: "/service/:service",
};

const App = () => {
    return (
        <Container className="app body">
            <Row><h1>Password Manager</h1></Row>
            <Row>
                <HashRouter >
                    <Switch>
                        <Route exact path={routes.root} component={ListServicesPage} />
                        <Route exact path={routes.new} component={NewServicePage} />
                        <Route exact path={routes.serviceDetail} component={ServiceDetailPage} />
                        <Route render={() => <Redirect to='/' />} />
                    </Switch>
                </HashRouter>
            </Row>
        </Container>
    );
}

export default App;

