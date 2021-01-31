import * as React from 'react';
import { Container, Spinner, Table } from 'react-bootstrap';
import { listServices } from 'dhd-lib';
import { Button } from 'react-bootstrap';

import * as Router from 'react-router';
import { withRouter } from 'react-router';

interface ListServicesPageState {
    services?: string[];
}

export class ListServicesPage extends React.Component<Router.RouteComponentProps, ListServicesPageState> {  
    constructor(props: Router.RouteComponentProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        listServices().then((serviceList) => {
            this.setState({ services: serviceList});
        });
    }

    render() {
        return (
            <Container>
                <Button onClick={(() => this.props.history.push("/service/new")).bind(this)}>New</Button>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.services?.map((serviceName) => 
                        <tr>
                            <td>{serviceName}</td>
                            <td><Button onClick={(() => this.onButtonClick(serviceName)).bind(this)}>Details</Button></td>
                        </tr>
                        ) ?? <Spinner animation='border'/>}
                    </tbody>
                </Table>
            </Container>
        );
    }

    private onButtonClick(serviceName: string) {
        this.props.history.push("/service/" + serviceName);
    }

}

export default withRouter(ListServicesPage);