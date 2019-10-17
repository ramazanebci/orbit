import React, { Component } from 'react';
import './style.css'
import { Row, Col, Input, Button, Form } from 'antd';
import ReceivedMessages from '../receivedMessages'
import Addressables from '../addressables'

import Messages from '../../orbit/messages'

class Client extends Component {
  sender;
  host;
  port;
  address;
  message;
  sender;

  sendMessage(e) {
    e.preventDefault()
    const { form } = this.props

    this.sender.sendMessage(form.getFieldValue("address"), form.getFieldValue("message"))
  }

  constructor(props) {
    super(props)

    this.state = {
      addressables: [],
      messages: []
    }

    this.sender = new Messages(props.url)

    this.refreshLoop()
  }

  refreshLoop() {
    this.refresh()
    setTimeout(() => {
      this.refreshLoop()
    }, 5000)
  }

  refresh() {
    this.sender.getMessages(this.state.currentAddressable).then(messages => {
      this.setState({ messages })
    })
    this.sender.getAddressables().then(addressables => {
      this.setState({ addressables })
    })
  }

  changeCurrentAddressable(address) {
    this.setState({ currentAddressable: address })
    this.refresh()
  }

  componentDidUpdate() {
    if (this.sender.url !== this.props.url) {
      this.sender.url = this.props.url
      this.refresh()
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      }
    }
    return (
      <div className="client">
        <Row>
          <Col span={12}>
            <section className="messageEntry">
              <Form {...formItemLayout} onSubmit={e => this.sendMessage(e)}>
                <Form.Item label="Address">
                  {getFieldDecorator('address')(
                    <Input placeholder="Address" ref={address => this.address = address} />)}
                </Form.Item>
                <Form.Item label="Message">
                  {getFieldDecorator('message')(
                    <Input.TextArea placeholder="Message" ref={msg => this.message = msg} />)}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Send</Button>
                </Form.Item>
              </Form>
            </section>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col span={12}>
            <Addressables addressables={this.state.addressables} select={address => this.changeCurrentAddressable(address)} />
          </Col>
          <Col span={12}>
            <ReceivedMessages messages={this.state.messages} />
          </Col>
        </Row>
      </div >
    )
  }
}

export default Form.create()(Client)