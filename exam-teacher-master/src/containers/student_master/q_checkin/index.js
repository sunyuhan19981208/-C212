//考试页面
import React from 'react';
import ReactDom from 'react-dom';
import { Tabs, Form, Input, Select, Radio, Row, Col, Button, message, Card, Checkbox,Collapse,Tag,Pagination,Modal } from 'antd';

const Panel=Collapse.Panel;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;


import { connect } from 'react-redux'

import CountDown from './subpage/countdown'



import httpServer from '@components/httpServer.js'
import * as URL from '@components/interfaceURL.js'

class QCheckin extends React.Component {
  constructor() {
    super();
    this.state = {
      index: 0,
      stem: '',
      type: 0,
      choiceType: 0,
      questionId: 0,
      answerList: [],
      stemOfChoice: [],
      opt: "",
      opts: [],
      style:{
        color:"#1890ff",
        background:"#e6f7ff",
        borderColor:"#91d5ff"
      },
      tagtext:"正在考试中",
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  componentWillMount() {
    //JSON.parse(localStorage.getItem("questionList"));
    this.getQuestionInfo();
    
     
  }

  shouldComponentUpdate(nextState) {
    console.log("shouldComponentUpdate");
    if (nextState.index !== this.state.index) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
    //alert(this.state.index);

    // let list = JSON.parse(localStorage.getItem("questionContent"));
    // this.state.stem = list[this.state.index].data.stem;
    // //console.log(this.state.stem);
    // this.state.type = list[this.state.index].type;
    // this.state.choiceType = list[this.state.index].choiceType;
    // this.state.questionId = list[this.state.index].data.questionId;
    // this.state.stemOfChoice = list[this.state.index].data.choice.stem;

    //this.getQuestionInfo();


  }

  //根据className获取paperId（查询考试）
  // getPaperList() {
  //   console.log("getPaperList()");
  //   var paperInfo2 = [];
  //   httpServer({
  //     url: URL.get_paper
  //   }, {
  //     className: localStorage.getItem("classOfCurStudent")
  //   })
  //     .then((res) => {
  //       console.log("123");

  //       paperInfo2.push(res.data.data[0].paperId);
  //       // alert(this.state.questionInfo[i]);

  //       localStorage.setItem("paperList", JSON.stringify(paperInfo2));
  //       let examId = res.data.data[0].examId;
  //       localStorage.setItem("examId", examId);


  //       //let list = JSON.parse(localStorage.getItem("paperList"));
  //       // alert("paperList:" + list);
  //     })
  //   this.getQuestionList();
  // }


  // //根据paperId获取questionId
  // getQuestionList() {
  //   console.log("getQuestionList()");
  //   var questionInfo2 = [];
  //   let list = JSON.parse(localStorage.getItem("paperList"))

  //   httpServer({
  //     url: URL.get_questionlist_by_paperId
  //   }, {
  //     paperId: list[0]
  //   })
  //     .then((res) => {
  //       for (var i = 0; i < res.data.data.length; i++) {
  //         questionInfo2.push(res.data.data[i].questionId);
  //         // alert(this.state.questionInfo[i]);
  //       }
  //       localStorage.setItem("questionList", JSON.stringify(questionInfo2));

  //       //let list2 = JSON.parse(localStorage.getItem("questionList"));
  //     })
  //   this.getQuestionInfo();
  // }


  // 根据questionId获取题目
  getQuestionInfo() {
    console.log("getQuestionInfo()");

    let list = JSON.parse(localStorage.getItem("questionList"));

    httpServer({
      url: URL.get_question_by_questionById
    }, {
      questionId: list[this.state.index]
    })
      .then((res) => {
        localStorage.removeItem("questionContent");
        localStorage.removeItem("questionId");
        localStorage.setItem("questionId", list[this.state.index]);
        localStorage.setItem("questionContent", JSON.stringify(res.data));

        // questionInfoList.push(res.data);
        // localStorage.setItem("questionContent", JSON.stringify(questionInfoList));
        // let questionContent = localStorage.getItem("questionContent");
        // console.log(questionContent);

        this.setState({
          index: this.state.index + 1,
        });
      })


  }


  handleSubmit(e) {
    e.preventDefault();
    console.log("handleSubmit")
    if (this.state.index === JSON.parse(localStorage.getItem("questionList")).length) {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          if (this.state.type === 2) {
            this.setState({ opt: " " });
            if (this.state.choiceType === 0) {
              var entry1 = {
                questionId: this.state.questionId,
                answer: this.state.opt,
              }
              this.state.answerList.push(entry1);
            }
            else {
              if (this.state.opts.length === 0) {
                Modal.warning({
                  content: '请至少选择两个选项',
                  okText: '确定'
                });
              }
              this.state.opt=this.state.opts[0];
              for (var i = 1; i < this.state.opts.length; i++) {
                this.state.opt += this.state.opts[i] + "";
              }
              var entry1 = {
                questionId: this.state.questionId,
                answer: this.state.opt,
              }
              this.state.answerList.push(entry1);
            }
          }
          else {
            var entry2 = {
              questionId: this.state.questionId,
              answer: values.answer,
            };
            this.state.answerList.push(entry2);
          }

          //提交题目信息
          httpServer({
            url: URL.submit,
            method: "post",
          }, {
            answerList: this.state.answerList,
            userId: parseInt(localStorage.getItem("userId"), 10),
            examId: parseInt(localStorage.getItem("examId"), 10),
          })
        }
      });
    }
    else {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          if (this.state.type === 2) {
            this.setState({ opt: " " });
            if (this.state.choiceType === 0) {
              var entry3 = {
                questionId: this.state.questionId,
                answer: this.state.opt,
              }
              this.state.answerList.push(entry3);
            }
            else {
              if (this.state.opts.length === 0) {
                Modal.warning({
                  content: '请至少选择两个选项',
                  okText: '确定'
                });
              }
              this.state.opt=this.state.opts[0];
              for (var i = 1; i < this.state.opts.length; i++) {
                this.state.opt += this.state.opts[i] + "";
              }
              var entry3 = {
                questionId: this.state.questionId,
                answer: this.state.opt,
              }
              this.state.answerList.push(entry3);
            }
          }
          else {
            var entry4 = {
              questionId: this.state.questionId,
              answer: values.answer,
            };
            this.state.answerList.push(entry4);
          }

          this.getQuestionInfo();
        }
      });
    }
  }

  clickOption(option) {          //处理单选选中的问题
    this.setState({ opt: option })
  }

  clickWhichAnswer(option) {      //多选
    if (this.state.opts.indexOf(option) === -1) {
      this.state.opts.push(option);
    }
    else {
      this.state.opts = this.state.opts.filter(item => item !== option);
    }

    this.state.opts = this.state.opts.sort();
    // let option2 = "";
    // option2 = this.state.opt + option;

    // this.setState({ opt: option2 });
  }
  
  
  onFinish(){

    const newstyle={
      color:"#f5222d",
      background:"#fff1f0",
      borderColor:"#ffa39e"
    }

    this.setState({style : newstyle});
    this.setState({tagtext : "考试已结束"})
    
    alert("时间已到,考试结束！")
  }

  onChange(page) {
    console.log(page);
    
    if (this.state.index === JSON.parse(localStorage.getItem("questionList")).length) {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          if (this.state.type === 2) {
            this.setState({ opt: " " });
            if (this.state.choiceType === 0) {
              var entry1 = {
                questionId: this.state.questionId,
                answer: this.state.opt,
              }
              this.state.answerList.push(entry1);
            }
            else {
              if (this.state.opts.length === 0) {
                Modal.warning({
                  content: '请至少选择两个选项',
                  okText: '确定'
                });
              }
              this.state.opt=this.state.opts[0];
              for (var i = 1; i < this.state.opts.length; i++) {
                this.state.opt += this.state.opts[i] + "";
              }
              var entry1 = {
                questionId: this.state.questionId,
                answer: this.state.opt,
              }
              this.state.answerList.push(entry1);
            }
          }
          else {
            var entry2 = {
              questionId: this.state.questionId,
              answer: values.answer,
            };
            this.state.answerList.push(entry2);
          }

          //提交题目信息
          httpServer({
            url: URL.submit,
            method: "post",
          }, {
            answerList: this.state.answerList,
            userId: parseInt(localStorage.getItem("userId"), 10),
            examId: parseInt(localStorage.getItem("examId"), 10),
          })
        }
      });
    }
    else {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          if (this.state.type === 2) {
            this.setState({ opt: " " });
            if (this.state.choiceType === 0) {
              var entry3 = {
                questionId: this.state.questionId,
                answer: this.state.opt,
              }
              this.state.answerList.push(entry3);
            }
            else {
              if (this.state.opts.length === 0) {
                Modal.warning({
                  content: '请至少选择两个选项',
                  okText: '确定'
                });
              }
              this.state.opt=this.state.opts[0];
              for (var i = 1; i < this.state.opts.length; i++) {
                this.state.opt += this.state.opts[i] + "";
              }
              var entry3 = {
                questionId: this.state.questionId,
                answer: this.state.opt,
              }
              this.state.answerList.push(entry3);
            }
          }
          else {
            var entry4 = {
              questionId: this.state.questionId,
              answer: values.answer,
            };
            this.state.answerList.push(entry4);
          }

          this.getQuestionInfo();
          this.setState({
            index: page,
          });

        }
      });
    }
    console.log(this)
  };

  // handleClick(){
  //   this.setState({
  //     current: 1,
  //   });
  // }

  render() {

    console.log("render()");
    // console.log(JSON.parse(localStorage.getItem("questionList")));

    let list = JSON.parse(localStorage.getItem("questionContent"));
    this.state.questionId = parseInt(localStorage.getItem("questionId"), 10);
    console.log("当前题目ID" + this.state.questionId);
    console.log("当前题号" + this.state.index);
    console.log(list);

    this.state.stem = list.data.stem;
    //console.log(this.state.stem);
    this.state.type = list.type;
    this.state.choiceType = list.choiceType;
    for (var i = 0; i < list.data.choice.length; i++) {
      this.state.stemOfChoice.push(list.data.choice[i].stem);

    }

    // localStorage.removeItem("questionContent");
    // localStorage.removeItem("questionId");

    const { getFieldDecorator } = this.props.form;

    //console.log(this.state.stemOfChoice);

    const item = [{       //选项，用于保存选项数目
      option: 'A',
      key: 0
    }, {
      option: 'B',
      key: 1
    }, {
      option: 'C',
      key: 2
    }, {
      option: 'D',
      key: 3
    }]


    const is_submit = (index) => {
      //console.log(JSON.parse(localStorage.getItem("questionList")).length);
      if (index === JSON.parse(localStorage.getItem("questionList")).length) {
        return (
          <Button type="primary" htmlType="submit" className="f-r">交卷</Button>
        )
      }
      else {
        return (
          <Button id="next_question" type="primary" htmlType="submit" className="f-r">下一题</Button>
        )
      }

    }

    const singal_answerList = item.map((item, i) => {       //!！单选，此处是选项，包括abcd和选项内容，待修改
      return (
        <Row key={item.key}>
          <Col span={21}>
            <FormItem>
              {getFieldDecorator('answer' + item.option)(
                <Radio onClick={this.clickOption.bind(this, item.option)} checked={this.state.opt == item.option} >{item.option}：{this.state.stemOfChoice[i]}</Radio>
              )}
            </FormItem>
          </Col>
        </Row>
      )
    })

    const multi_answerList = item.map((item, i) => {     // !！多选   此处是选项，包括选项和选项内容，待修改
      return (
        <Row key={item.key}>
          <Col span={21}>
            <FormItem >
              {getFieldDecorator('answer' + item.option)(
                <Checkbox id="checkbox1" onClick={this.clickWhichAnswer.bind(this, item.option)} >{item.option}：{this.state.stemOfChoice[i]}</Checkbox>
              )}
            </FormItem>
          </Col>
        </Row>
      )
    })

    const proList = (thistype, ctype) => {         //题目页面
      // console.log(this);
      if (thistype == "2" && ctype == "0") {     //单选
        return (
          <div>
            {singal_answerList}
          </div>
        );

      } else if (thistype == "2" && ctype == "1") {       //多选
        return (
          <div>
            {multi_answerList}
          </div>
        );
      } else if (thistype === 1) {      //填空
        return (
          <div>
            <FormItem>
              {getFieldDecorator('answer', {})(
                <Row>
                  <Col sm={3} xs={0}></Col>
                  <Col>
                    <TextArea rows={3} placeholder="请输入你的答案" />
                  </Col>
                </Row>
              )}
            </FormItem>
          </div>
        )
      } else if (thistype === 5) {        //简答
        return (
          <div>
            <FormItem>
              {getFieldDecorator('answer', {})(
                <Row gutter={[0, 10]}>
                  <Col sm={3} xs={0}></Col>
                  <Col>
                    <TextArea rows={3} placeholder="请输入你的答案" />
                  </Col>
                </Row>
              )}
            </FormItem>
          </div>
        );
      } else {
        // alert("数据出错");
        // console.log(this.state.type);
        // console.log(this.state.choiceType);
      }
    }

    const Content = ({ children, extra }) => {
      return (
        <div className="content">
          <div className="main">{children}</div>
          <div className="extra">{extra}</div>
        </div>
      );
    };
    

    //获取到的时间戳是UTC时间（你的电脑时间-8h），那么整体都以UTC时间为准
    const endTime = new Date(localStorage.getItem("endTime"))  //Date函数自动将utc，转为中文时间
    const endtime_s=endTime.getTime()    //转换为秒数
    const utc_endtime=new Date(endtime_s-1000*60*60*8)      //时间相减，以UTC时间为准
    const endtime=utc_endtime.toTimeString().slice(0,8)     //转字符串，切片获得 小时：分钟：秒

    const startTime = new Date(localStorage.getItem("startTime"))    //开始时间
    const lasttime = ((endTime.getTime()-startTime.getTime())/1000/60/60).toFixed(1)   //考试时长

    // const len = localStorage.getItem("questionList").length
    const len = JSON.parse(localStorage.getItem("questionList")).length    //题目数
        
    const pageHeader=<div class="ant-page-header-heading-left">
                          <span class="ant-page-header-heading-title" title="Title">期末英语大联考</span>
                          <span><Tag style={this.state.style} color="blue">{this.state.tagtext}</Tag></span>
                        
                        <div class="ant-page-header-heading-extra">
                          <div class="ant-space-item">
                              <Button type="primary" class="ant-btn">
                                  <span>交 卷</span>
                              </Button>
                          </div>
                              
                          <div class="ant-space-item" style={{marginRight: 24}}>
                            <div class="ant-statistic">
                                <div class="ant-statistic-title">剩余时间</div>
                                <div class="ant-statistic-content" style={{color:"red"}}>
                                    <span class="ant-statistic-content-value"><CountDown endtime={endtime_s} onFinish={this.onFinish.bind(this)}></CountDown></span>
                                </div>
                            </div>
                          </div>
                          <div class="ant-space-item" style={{marginRight: 24}}>
                            <div class="ant-statistic">
                                <div class="ant-statistic-title">截止时间</div>
                                <div class="ant-statistic-content">
                                    <span class="ant-statistic-content-value">{endtime}</span>
                                </div>
                            </div>   
                          </div>
                        </div>
                      </div>
    const contentMian=<div class="ant-descriptions-view">
                        <table>
                            <tbody>
                                <tr class="ant-descriptions-row">
                                    <th class="ant-descriptions-item-label" colspan="1">考试人</th>
                                    <td class="ant-descriptions-item-content" colspan="1">{localStorage.getItem("username")}</td>
                                    <th class="ant-descriptions-item-label" colspan="1">教师</th>
                                    <td class="ant-descriptions-item-content" colspan="1">sunyuhan</td>
                                    <th class="ant-descriptions-item-label" colspan="1">试卷时长</th>
                                    <td class="ant-descriptions-item-content" colspan="1">{lasttime}小时</td>
                                </tr>
                                <tr class="ant-descriptions-row">
                                   
                                    <th class="ant-descriptions-item-label" colspan="1">题目数</th>
                                    <td class="ant-descriptions-item-content" colspan="5">{len}</td>
                                </tr>
                                <tr class="ant-descriptions-row">
                                    <th class="ant-descriptions-item-label" colspan="1">考试须知</th>
                                    <td class="ant-descriptions-item-content" colspan="5" style={{width:500}}>
                                        <p>一、考试为在线考试，有时间限制</p>
                                        <p>二、考试期间不得离开考试页面，否则离开两次将自动交卷</p>
                                        <p>三、考试请独立思考，不得与他人交流</p>
                                        <p>四、若还没开考，请耐心等待</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>             

    return (
      <div className="exam-card">
        <div className="exam-header">
          <Collapse defaultActiveKey={['1']} >
            <Panel header={pageHeader} key="1" >   
              <Content extra={<div></div>}>    {/*此处放图片 */}
                {contentMian}
              </Content>
            </Panel>
          </Collapse>
        </div>
        <div className="exam-subject">
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <FormItem>
                <Row>
                  <Col span={24}>
                    <Card>第{this.state.index}题：{this.state.stem}</Card>       {/* //题干this.state.stem */}
                  </Col>
                </Row>
              </FormItem>

              {proList(this.state.type, this.state.choiceType)}

              <FormItem>
                <Row>
                  <Col span={3} offset={9}>
                    {is_submit(this.state.index)}
                  </Col>
                  {/* ！！！点击下一题提交答案，同时跳转到下一题 */}
                </Row>
              </FormItem>
            <Row>
              <Col span={12} offset={7}>
                <Pagination current={this.state.index} onChange={this.onChange.bind(this)} total={len*10} /> 
                
              </Col>
            </Row>     
          </Form>
        </div>
      </div>
    )

  }
}



// export default connect(
//   mapStateToProps
// )(Form.create(QCheckin))

export default Form.create()(QCheckin);