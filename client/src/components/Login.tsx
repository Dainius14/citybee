import React, { FormEvent } from 'react';
import { observer, inject } from 'mobx-react';

import { UiState } from '../stores/uiState';
import { Button, Checkbox, Collapse, Form, Icon, Input, Tree } from 'antd';

const { Panel } = Collapse;


interface IState {
    email: string;
    password: string;
}
interface IProps {
    uiState?: UiState
}

@inject('uiState')
@observer
export default class Login extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }
    handleLogin = (event: FormEvent) => {
        event.preventDefault();
        console.log(this.state.email);
        console.log(this.state.password);
    };

    render() {
        return (
            <div>
                <Collapse bordered={false}>

                    <Panel header="Login" key="1">

                        <Form onSubmit={this.handleLogin} className="login-form">
                            <Input
                                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={this.state.email}
                                onChange={e => this.setState({ email: e.target.value })}
                            />
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={this.state.password}
                                onChange={e => this.setState({ password: e.target.value })}
                            />
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form>
                    </Panel>
                </Collapse>
            </div>
        );
    }
}
