//！！！！！试题录入改————考试页面
import React from 'react';
import { Tabs,Form,Input,Select,Radio,Row,Col,Button,message,Card,Checkbox } from 'antd';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;


import { connect } from 'react-redux'

import QSingle from './subpage/q_single'
import QMultiple from './subpage/q_multiple'

import QFillIn from './subpage/q_fill_in'
import QShortAnswer from './subpage/q_short_answer'


import httpServer from '@components/httpServer.js'
import * as URL from '@components/interfaceURL.js'

class QCheckin extends React.Component {
  constructor(){
    super();
    this.state = {     
      q_checkin_type : 'single',//选项卡用户选择的题目类型
      data:{
        stem:"",
        A:'',
        B:'',
        C:'',
        D:'',
        E:'',
        total:'',    
      },
      type:'5',
      choiceType:'0',
      key:'choice',  //默认是选择题
      opt:'',
    }
  }

  

  componentWillMount(){

    if(sessionStorage.getItem("q_checkin_type")) {
      //设置选项卡的题目的类型
      console.log(sessionStorage.getItem("q_checkin_type"));
      this.setState({q_checkin_type : sessionStorage.getItem("q_checkin_type")});
    }
    this.getPaperList();
    // this.getQuestionList();
    // this.getQuestionInfoList();

  }

  //根据className获取paperId（查询考试）
  getPaperList() {
    var paperInfo2 = [];
    httpServer({
      url: URL.get_paper
    }, {
      className: localStorage.getItem("classOfCurStudent")
    })
      .then((res) => {
        for (var i = 0; i < res.data.data.length; i++) {
          paperInfo2.push(res.data.data[i].paperId);
          // alert(this.state.questionInfo[i]);
        }
        localStorage.setItem("paperList", JSON.stringify(paperInfo2));
        let list = JSON.parse(localStorage.getItem("paperList"));
        // alert("paperList:" + list);
      })
    this.getQuestionList();
  }


  根据paperId获取questionId
  getQuestionList() {
    var questionInfo2 = [];
    let list = JSON.parse(localStorage.getItem("paperList"))
    for (var j = 0; j < list.length; j++) {
      httpServer({
        url: URL.get_questionlist_by_paperId
      }, {
        paperId: list[j]
      })
        .then((res) => {
          for (var i = 0; i < res.data.data.length; i++) {
            questionInfo2.push(res.data.data[i].questionId);
            // alert(this.state.questionInfo[i]);
          }
          localStorage.setItem("questionList", JSON.stringify(questionInfo2));
          let list = JSON.parse(localStorage.getItem("questionList"));
          // alert("questionList:" + list);
        })
      this.getQuestionInfoList();
    }
  }



  // 根据questionId获取题目
  getQuestionInfoList() {
    var questionInfoList = [];
    let list = JSON.parse(localStorage.getItem("questionList"));
    for (var j = 0; j < list.length; j++) {
      httpServer({
        url: URL.get_question_by_questionById
      }, {
        questionId: list[j]
      })
        .then((res) => {
          questionInfoList.push(res.data);
          // alert(this.state.stem[i]);
          // console.log(questionInfoList);
          localStorage.setItem("questionInfoList2", JSON.stringify(questionInfoList));
          let list2 = JSON.parse(localStorage.getItem("questionInfoList2"));
          // console.log(list2);
        })
    }
  }


  componentWillUpdate(nextProps){
    //在这里使用this.setState会导致无限触发
  }

  // componentWillReceiveProps(nextProps){
  //     if (nextProps.location.pathname != this.props.location.pathname) {
  //       this.setState({// 重置q_checkin_type
  //         q_checkin_type : '3'
  //       });
  //       sessionStorage.setItem("q_checkin_type", '3');
  //     }
  // }

  callback(key) {
    this.setState({
      q_checkin_type : key
    });
    sessionStorage.setItem("q_checkin_type", key);//存储用户点击选项卡的题目类型
  }

  handleSubmit(){
    alert("123")
  }
  
  clickOption(option){          //处理单选选中的问题
    this.setState({opt:option})   
    // console.log(this.state.opt)  //先执行，很奇怪。
  }
  
  render(){

    const item=[{       //选项，用于保存选项数目
      option : 'A',
      key : 0
    },{
      option : 'B',
      key : 1
    },{
      option : 'C',
      key : 2
    },{
      option : 'D',
      key : 3
    }] 
    
    const singal_answerList = item.map((item, i) => {      //!！单选，此处是选项，包括abcd和选项内容，待修改
      return (
        <Row key = {item.key}>
          <Col span={21}>
            <FormItem>
              <Radio value={item.option} onClick={this.clickOption.bind(this,item.option)}>{item.option}：选型内容</Radio>
            </FormItem>
          </Col>
        </Row>
      )
    })

    const multi_answerList = item.map((item, i) => {     // !！多选   此处是选项，包括选项和选项内容，待修改
      return (
        <Row key = {item.key}>
          <Col span={21}>
            <FormItem >  
              <Checkbox >{item.option}：选项内容</Checkbox>
            </FormItem>
          </Col>
      </Row>
      )
    })

    const proList = (thistype,ctype) => {         //题目页面
        console.log(this);
        if (thistype==="2"&&ctype==="0"){     //单选
          return(
            <div>
              <Radio.Group name="radiogroup" value={this.state.opt}>
                {singal_answerList}
              </Radio.Group> 
            </div>
          );
    
        }else if(thistype==="2"&&ctype==="1"){       //多选
          return(
          <div>
            {multi_answerList}
          </div>
          );
        }else if(thistype==="1"){      //填空
          return(
            <div> 
              <FormItem>          
                <Row>
                  <Col sm={3} xs={0}></Col>
                  <Col>
                    <TextArea rows={3} placeholder="请输入你的答案，多个答案用空格或逗号隔开" />
                  </Col>
                </Row>
              </FormItem> 
            </div>
            ) 
        }else if(thistype==="5"){        //简答
          return(
            <div>
              <FormItem>
                <Row gutter={[0,10]}>
                  <Col sm={3} xs={0}></Col>
                  <Col>
                    <TextArea rows={3} placeholder="请输入你的答案，多个答案用空格或逗号隔开" />
                  </Col>
                </Row>
              </FormItem>
            </div>
          );
          }else{
            alert("数据出错");
          }       
      }
      

    return(   
      <div className="q-checkin">
        <div className="q-checkin-content">
          <div className="card-container">
            <Form onSubmit={this.handleSubmit.bind(this)} >
              <FormItem>          
                <Row>
                  <Col span={24}>
                    <Card>题目：</Card>       {/* //题干this.state.stem */}
                  </Col>
                </Row>
              </FormItem>

              {proList(this.state.type,this.state.choiceType)}

             <FormItem>              
                <Row>
                  <Col span={3} offset={11}>
                    <Button type="primary" htmlType="submit" className="nextpro">下一题</Button>
                  </Col>
                  {/* ！！！点击下一题提交答案，同时跳转到下一题 */}
                </Row>
             </FormItem>
         
          </Form>

          </div>
        </div>
      </div>
    )

}
}

function mapStateToProps(state) {
    return {
        subjectinfo: state.subjectinfo
    }
}

export default connect(
    mapStateToProps
)(QCheckin)
