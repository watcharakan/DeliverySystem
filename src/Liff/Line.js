import React from 'react'

const liff = window.liff;

export default class Line extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pay: null,


        }
    }

    componentDidMount() {
        const temp = this.props.location.combineState
        const { address, form, distance, state1, markerPosition } = temp

            if(JSON.stringify(parseFloat(distance.rows[0].elements[0].distance.text))<2){
                this.setState({pay:30})

            }

            else {
                this.setState({pay:((JSON.stringify(parseFloat(distance.rows[0].elements[0].distance.text)-2)*10)+30)})
            }




        // console.log(`จุดส่งของ : ${state1.address}
        // รายละเอียดเพิ่มเติม: ${state1.form.senderDesOption}
        // ชื่อผู้ส่งของ : ${state1.form.senderName}
        // โทร. ผู้ส่งของ : ${state1.form.senderPhoneNumber}`)
        // console.log(`จุดรับของ : ${address} 
        // รายละเอียดเพิ่มเติม : ${form.recieverDesOption}
        // ชื่อผู้รับของ : ${form.recieverName} 
        // โทร. ผู้รับของ : ${form.recieverPhoneNumber}
        // ระยะทาง : ${JSON.stringify(distance.rows[0].elements[0].distance.text)}`)


        liff.init(function (data) { });
        liff.getProfile().then(function (profile) {
            liff.sendMessages([
                {
                    type: 'text',
                    text: `จุดรับของ : ${state1.address}\nรายละเอียดเพิ่มเติม: ${state1.form.senderDesOption}\nชื่อผู้ส่งของ : ${state1.form.senderName}\nโทร. ผู้ส่งของ : ${state1.form.senderPhoneNumber}`
                },
                {
                    type: "location",
                    title: "จุดรับของ",
                    latitude: +state1.markerPosition.lat,
                    longitude: +state1.markerPosition.lng
                },
                // {
                //     type: 'text',
                //     text: `จุดรับของ : ${address} \nรายละเอียดเพิ่มเติม : ${form.recieverDesOption}\nชื่อผู้รับของ : ${form.recieverName} \nโทร. ผู้รับของ : ${form.recieverPhoneNumber}\nระยะทาง : ${this.state.pay.toString()}`
                // },
                {
                    type: 'text',
                    text: `จุดส่งของ : ${address} \nรายละเอียดเพิ่มเติม : ${form.recieverDesOption}\nชื่อผู้รับของ : ${form.recieverName} \nโทร. ผู้รับของ : ${form.recieverPhoneNumber}\n`
                },
                {
                    type: "location",
                    title: "จุดส่งของ",
                    latitude: +markerPosition.lat,
                    longitude: +markerPosition.lng
                },
                {
                    type: 'text',
                    text: `https://www.google.com/maps/dir/'${state1.markerPosition.lat},${state1.markerPosition.lng}'/'${markerPosition.lat},${markerPosition.lng}'/`
                },

            ]).then(function () {
                liff.closeWindow();
            }).catch(function (error) {
                window.alert('Error sending message: ' + error.message);
            });
        }).catch(function (error) {
            window.alert("Error getting profile: " + error.message);
        });
    }
    render() {
        return (<>เสร็จสิ้นการดำเนินการ</>)
    }
}