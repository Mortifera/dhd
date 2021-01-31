import { getPassData, putPassDataWithOverwrite } from 'dhd-lib';
import * as React from 'react';
import { Component } from 'react';
import { Col, Container, FormControl, InputGroup, Row, Spinner } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { RouteComponentProps, withRouter } from 'react-router';

interface ServiceDetailPageProps {
    service: string;
}

interface ServiceDetailPageState {
    hasData: boolean;
    username?: string;
    password?: string;

    showPassword: boolean;
    edit: boolean;
}

export class ServiceDetailPage extends Component<RouteComponentProps<ServiceDetailPageProps>, ServiceDetailPageState> {
    readonly serviceName: string;

    constructor(props: RouteComponentProps<ServiceDetailPageProps>) {
        super(props);

        this.state = {
            hasData: false,
            showPassword: false,
            edit: false
        };

        this.serviceName = props.match.params.service;
    }

    componentDidMount() {
        getPassData({
            service: this.serviceName
        }).then((passData) => {
            this.setState({
                hasData: true,
                username: passData.user,
                password: passData.password
            })
        });
    }

    render() {
        return (
            <Container>
                <Col>
                    <Button onClick={(() => this.props.history.goBack()).bind(this)}>Back</Button>

                    <Button onClick={(() => this.setState({edit: true} )).bind(this)}>Edit</Button>
                    <Row>
                    {
                        !this.state.hasData ? <Spinner animation='border' /> : (
                            <>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        placeholder="Username"
                                        aria-label="Username"
                                        aria-describedby="basic-addon2"
                                        defaultValue={this.state.username}
                                        disabled={!this.state.edit}
                                        onChange={this.onUserNameChange.bind(this)}
                                    />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        placeholder="Password"
                                        aria-label="Password"
                                        aria-describedby="basic-addon2"
                                        defaultValue={this.state.password}
                                        type={this.state.showPassword ? 'text' : 'password'}
                                        disabled={!this.state.edit}
                                        onChange={this.onPasswordChange.bind(this)}
                                    />
                                    <InputGroup.Append>
                                        <Button variant="outline-secondary" onClick={() => this.setState({ showPassword: !this.state.showPassword })}>Show/Hide</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <Button 
                                            variant="outline-primary"
                                            disabled={!this.state.edit}
                                            onClick={this.editUserPass.bind(this)}
                                        >
                                            Save
                                        </Button>
                                </InputGroup>
                            </>
                        )
                    }
                    </Row>
                </Col>
            </Container>
        );
    }

    private editUserPass() {
        if (!this.state.username || !this.state.password) {
            console.log("No username or password");
            return;
        }

        putPassDataWithOverwrite({
            service: this.serviceName,
            user: this.state.username!,
            password: this.state.password!
        }, true).then(() => {
            this.setState({hasData: false});
        }).then(() => getPassData({
            service: this.serviceName
        })).then((passData) => {
            this.setState({
                hasData: true,
                username: passData.user,
                password: passData.password
            })
        });
    }

    private onUserNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({username: e.target.value});
    }
    private onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({password: e.target.value});
    }
}

export default withRouter(ServiceDetailPage);