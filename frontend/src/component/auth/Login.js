import React, { useEffect, useState } from "react";
import { Button, Select, Form, Input, Icon } from "antd";
import { connect } from 'react-redux';
import { config } from '../conf';
import { login } from './redux/actions'
import QuestionPopover from '../questionPopover';
import Register from '../showModal';
import './Login.css';


const content = (
    <div>api-key можно посмотреть https://wakatime.com/dashboard в настройках</div>
)

const Login = ({ form, login, loading, ...rest }) => {


    const submitLogin = e => {
        e.persist();
        form.validateFields((err, values) => {
            if (!err) {
                login(values)
            }
        });
    };


    useEffect(() => {
        console.log(rest)
    }, [])

    return (
        <div id="login">

            <Form className="login-form" autoComplete="off" onSubmit={submitLogin}>
                <h1>Вход<Icon type="user" /></h1>
                <div>
                    <Form.Item>
                        {form.getFieldDecorator(
                            "api_key",
                            config("", true)
                        )(<Input placeholder="Укажите api-key" />)}
                    </Form.Item>
                    <QuestionPopover

                        width="24"
                        height="24"
                        trigger="click"
                        fill="#00a8ff"
                        position="top"
                    >{content}</QuestionPopover>

                </div>

                <div className='login-area'>
                    <Form.Item>
                        {form.getFieldDecorator(
                            "last_name",
                            config("", true)
                        )(<Input placeholder="Укажите фамилию" />)}
                    </Form.Item>
                    <Button
                        onClick={submitLogin}
                        className="login-btn"
                        type="primary"
                        loading={loading}
                    >

                        Вход
                    </Button>
                </div>

                <Register content={content} title="Создание нового пользователя" />

            </Form>
        </div >
    )
}

export default connect(
    state => ({
        loading: state.authentication.loading

    }),
    {
        login
    }

)(Form.create()(Login));