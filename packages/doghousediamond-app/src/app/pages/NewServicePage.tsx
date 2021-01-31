import { putPassDataWithOverwrite } from "dhd-lib";
import React from "react";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";
import { RouteComponentProps, useHistory } from "react-router";

interface NewServicePageState {
    service: string;
    username: string;
    password: string;

    showPassword: boolean
}

export class NewServicePage extends React.Component<RouteComponentProps, NewServicePageState> {

    constructor(props: RouteComponentProps) {
        super(props);

        this.state = {
            service: "",
            username: "",
            password: "",
            showPassword: false
        };
    }

    render() {
        return (
            <Container>
                <Button onClick={() => this.props.history.goBack()}>Back</Button>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Service"
                        aria-label="Service"
                        aria-describedby="basic-addon1"
                        onChange={this.onServiceChange.bind(this)}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon2"
                        onChange={this.onUserNameChange.bind(this)}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Password"
                        aria-label="Password"
                        aria-describedby="basic-addon3"
                        type={this.state.showPassword ? 'text' : 'password'}
                        onChange={this.onPasswordChange.bind(this)}
                    />
                    <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={() => this.setState({ showPassword: !this.state.showPassword })}>Show/Hide</Button>
                    </InputGroup.Append>
                </InputGroup>
                <InputGroup className="mb-3">
                    <Button
                        variant="outline-primary"
                        onClick={this.editUserPass.bind(this)}
                    >
                        Save
                    </Button>
                </InputGroup>
            </Container>
        );
    }

    private editUserPass() {
        if (!this.state.username || !this.state.password) {
            console.log("No username or password");
            return;
        }

        putPassDataWithOverwrite({
            service: this.state.service,
            user: this.state.username!,
            password: this.state.password!
        }, true).then(() => {
            this.props.history.replace("/service/" + this.state.service);
        });
    }

    private onServiceChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({service: e.target.value});
    }

    private onUserNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({username: e.target.value});
    }
    private onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({password: e.target.value});
    }
}