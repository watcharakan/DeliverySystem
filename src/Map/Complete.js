import React, { Component } from 'react';
import { ListGroup ,Card,Button } from 'react-bootstrap';

class Complete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pay: null,


        }
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
                    <Button variant="primary">Complete</Button>
                </Card.Body>
                <Card.Footer className="text-muted">Thank you</Card.Footer>
            </Card>
        )
    }
}

export default Complete;