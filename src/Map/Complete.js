import React, { Component } from 'react';
import { ListGroup ,Card,Button } from 'react-bootstrap';

class Complete extends Component {
    constructor(props) {
        super(props);
        this.state = { feedback: 'xxxxxxxx', name: 'Name', email: 'email@example.com' };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        const temp = this.props.location.combineState
        const {address, form, distance, state1, markerPosition} = temp
        this.setState({feedback: `จุดรับของ : ${state1.address}\nรายละเอียดเพิ่มเติม: ${state1.form.senderDesOption}\nชื่อผู้ส่งของ : ${state1.form.senderName}\nโทร. ผู้ส่งของ : ${state1.form.senderPhoneNumber}\n
        จุดส่งของ : ${address} \\nรายละเอียดเพิ่มเติม : ${form.recieverDesOption}\\nชื่อผู้รับของ : ${form.recieverName} \\nโทร. ผู้รับของ : ${form.recieverPhoneNumber}\n
        แผนที่ https://www.google.com/maps/dir/'${state1.markerPosition.lat},${state1.markerPosition.lng}'/'${markerPosition.lat},${markerPosition.lng}'/`})
    }

    handleSubmit () {
        const templateId = 'template_D0IjdUjO';

        this.sendFeedback(templateId, {message_html: this.state.feedback, from_name: this.state.name, reply_to: this.state.email})
        window.location.replace('https://www.sproutstory.co/en/')
    }

    sendFeedback (templateId, variables) {
        window.emailjs.send(
            'gmail', templateId,
            variables
        ).then(res => {
            console.log('Email successfully sent!')
        })
            // Handle errors here however you like, or use a React error boundary
            .catch(err => console.error('Oh well, you failed. Here some thoughts on the error that occured:', err))
    }
    render() {
        const temp = this.props.location.combineState
        const {address, form, distance, state1, markerPosition} = temp

        return(
            <Card className="text-center">
                <Card.Header>Sprout  Delivery </Card.Header>
                <Card.Body>
                    <Card.Title>จุดรับของ</Card.Title>
                    <Card.Text>
                          {state1.address}<br/>
                          รายละเอียดเพิ่มเติม: {state1.form.senderDesOption}<br/>
                          ชื่อผู้ส่งของ : {state1.form.senderName}<br/>
                          โทร. ผู้ส่งของ : {state1.form.senderPhoneNumber}
                    </Card.Text>
                    <Card.Title>จุดส่งของ</Card.Title>
                    <Card.Text>
                        {address}<br/>
                        รายละเอียดเพิ่มเติม : {form.recieverDesOption}<br/>
                        ชื่อผู้รับของ : {form.recieverName}<br/>
                        โทร. ผู้รับของ : {form.recieverPhoneNumber}
                    </Card.Text>
                    <Button  variant="primary"
                        onClick={() => this.props.history.goBack()}
                    >
                        Back
                    </Button>{' '}
                    <Button variant="primary"  onClick={() => this.handleSubmit()}>Complete</Button>

                </Card.Body>
                <Card.Footer className="text-muted">Thank you</Card.Footer>
            </Card>
        )
    }
}

export default Complete;