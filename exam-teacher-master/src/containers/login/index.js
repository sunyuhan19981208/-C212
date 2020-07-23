import React from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

//actions
import * as userinfoActions from '../../actions/userinfo'

import { axiosLogin } from './axios'

class Login extends React.Component {

	constructor() {
		super()
		this.state = {
			loginTip: ''
		}
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				axiosLogin({
					//  className : 'LoginServiceImpl',
					//  loginType : 1,
					username: values.username,
					password: values.password
				}, (res) => {
					if (res === "老师") {//登录成功
						//发送Action  向Store 写入用户名和密码
						this.props.userinfoActions.login({
							username: values.username
						})

						//本地存储用户名
						localStorage.setItem("username", values.username);
						// localStorage.setItem("roleSet",res.roleSet[0])

						//跳转主页
						this.props.history.push('/main/homepage');//react-router 4.0 写法
					}
					else if (res === "学生") {//登录成功
						//发送Action  向Store 写入用户名和密码
						this.props.userinfoActions.login({
							username: values.username
						})

						//本地存储用户名
						localStorage.setItem("username", values.username);

						//跳转主页
						this.props.history.push('/student_master/homepage');//react-router 4.0 写法
					}
					else if (res.respCode === "0") {//登录失败
						this.setState({ loginTip: "登录名或密码错误" })
					}
					else if (res.respCode === "-1") { //系统错误
						this.setState({ loginTip: "系统出错了，请稍等~" })
					}
				}, (err) => {
					console.log(err);
				});


			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="login">
				<div className="login-content-wrap">
					<div className="login-content">
						{/* <img className="logo" src="/sxt_exam/lqw/images/logo.jpg"/> */}
						<img className="logo" src={require("@assets/images/logo.jpg")} />
						<div className="login-from">
							<div className="login-tip">{this.state.loginTip}</div>
							<Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
								<FormItem >
									{getFieldDecorator('username', {
										rules: [{ required: true, message: '请输入用户名！' }],
									})(
										<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.55)' }} />} placeholder="用户名" />
									)}
								</FormItem>
								<FormItem >
									{getFieldDecorator('password', {
										rules: [{ required: true, message: '请输入密码！' }],
									})(
										<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.55)' }} />} type="password" placeholder="密码" />
									)}
								</FormItem>
								<FormItem >
									<Form.Item name="remember" valuePropName="checked" noStyle>
										<Checkbox>Remember me</Checkbox>
										<a className="login-form-forgot" href="">
											Forgot password
									</a>
									</Form.Item>
								</FormItem>
								<FormItem>
									<Button type="primary" htmlType="submit" className="login-form-button">
										登录
									</Button>
								</FormItem>
							</Form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

//传递state给子组件
function mapStateToProps(state) {
	return {
		userinfo: state.userinfo
	}
}

//组合userinfoActions和dispatch的对象传递给子组件
//在子组件中，调用userinfoActions.action1,相当于实现了store.dispatch(action1)
//于是我们就实现了在没有store和dispatch组件中，如何调用dispatch(action)
function mapDispatchToProps(dispatch) {
	return {
		userinfoActions: bindActionCreators(userinfoActions, dispatch)
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(Login))
