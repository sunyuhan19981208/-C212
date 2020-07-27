import React from 'react'

import { Form, Input, Select, Row, Col, Button, Modal } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

import BreadcrumbCustom from '@components/BreadcrumbCustom'
import httpServer from '@components/httpServer.js'
import * as URL from '@components/interfaceURL.js'

class ChangePassword extends React.Component {
  constructor() {
    super()
    this.state = {
      questionInfo:[],
      pathList: ['个人中心', '修改密码'],//面包屑路径
    }
  }

  //test
  //
  // componentWillMount() {

  //   this.getQuestionList();
  
  // }

  // getQuestionList(){
  //   httpServer({
  //     url:URL.get_questionlist_by_paperId
  //   },{
  //     paperId : 2
  //   })
  //   .then((res)=>{
  //     for(var i=0;i<res.data.data.length;i++){
  //       this.state.questionInfo[i] = res.data.data[i].questionId;
  //       alert(this.state.questionInfo[i]);
  //     }
  //     localStorage.setItem("questionList", JSON.stringify(this.state.questionInfo));
  //     let list = JSON.parse(localStorage.getItem("questionList"))
  //     alert(list);

  //   })
  // }

  //选择班级
  handleChange(value) {
    console.log(`selected ${value}`);
  }

  submitChange(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.password1 !== values.password2) {
          Modal.warning({
            title: '两次输入的密码不一致',
            okText: '确定'
          })
          return;
        }
        else if (values.oldPassword === values.password1) {
          Modal.warning({
            title: '旧密码和新密码相同，请重新输入！',
            okText: '确定'
          })
        }
        else {
          httpServer({
            url: URL.change_password
          }, {
            userId: localStorage.getItem("userId"),
            newPassword: values.password1,
            oldPassword: values.oldPassword
          })
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    //表单布局
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4, offset: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };

    return (
      <div>
        <BreadcrumbCustom pathList={this.state.pathList}></BreadcrumbCustom>
        <div className="change-password-content">
          <Form onSubmit={this.submitChange.bind(this)}>
            <FormItem
              {...formItemLayout}
              label="原密码"
            >
              {getFieldDecorator('oldPassword', {
                rules: [{ required: true, message: '请输入原密码！' }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="新密码"
            >
              {getFieldDecorator('password1', {
                rules: [{ required: true, message: '请输入新密码！' }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="确认密码"
            >
              {getFieldDecorator('password2', {
                rules: [{ required: true, message: '请输入确认密码！' }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <Row>
              <Col span={12} offset={4}>
                <Button type="primary" htmlType="submit" className="f-r">确定</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(ChangePassword)
