import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import axios from 'axios';
import { Button ,Form,InputGroup,FormControl,Container } from 'react-bootstrap';
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || "AIzaSyAlULpCzs57poHJ0CQWp9cZs0n2Tak2Qyw"

Geocode.setApiKey(API_KEY);
Geocode.enableDebug();
Geocode.setLanguage("th");
Geocode.setRegion("th");

class Map2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            address: null,
            city: null,
            area: null,
            state: null,
            mapPosition: {
                lat: 7.890030,
                lng: 98.398178
            },
            markerPosition: {
                lat: 7.890030,
                lng: 98.398178
            },
            distance: { rows: [{ elements: [{ distance: { text: "Calculating..." } }] }] },

            form: {
                recieverDesOption: "",
                recieverName: null,
                recieverPhoneNumber: null
            },

            state1: {
                address: null,
                pay: null,
                city: null,
                area: null,
                state: null,
                mapPosition: {
                    lat: null,
                    lng: null
                },
                markerPosition: {
                    lat: null,
                    lng: null
                },
            }
        }

    }
    calculate = () => {
         var pay =  '';
        if(JSON.stringify(parseFloat(this.state.distance.rows[0].elements[0].distance.text))<2){
            pay = 30

        }

        else {
            pay = ((JSON.stringify(parseFloat(this.state.distance.rows[0].elements[0].distance.text)-2)*10)+30)
        }

        return pay
    };
    /**
     * Get the current address from the default map position and set those values in the state
     */
    async componentWillMount() {
        if (this.props.location.state1) {
            this.setState({ state1: { ...this.props.location.state1 } })
            console.log(this.props)
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(res => {
                this.setState({
                    mapPosition: {
                        lat: +res.coords.latitude,
                        lng: +res.coords.longitude
                    },
                    markerPosition: {
                        lat: +res.coords.latitude,
                        lng: +res.coords.longitude
                    }
                })
                this.getAddressOnLoad(+res.coords.latitude, +res.coords.longitude);
                this.getDistance(+res.coords.latitude, +res.coords.longitude)
            })
        }
        if (!navigator.geolocation) {
            alert('ท่านไม่ได้เปิดใช้งานการระบุตำแหน่ง โปรดพิมพ์ในช่องค้นหาด้วยตัวเอง (Location is disable by user. Please search by type at Location form)')
            this.setState({
                address: "ไม่สามารถระบุตำแหน่งได้โปรดใช้การค้นหาด้วยตนเอง (Please find location with your selft)",
                mapPosition: {
                    lat: 7.890030,
                    lng: 98.398178
                },
                markerPosition: {
                    lat: 7.890030,
                    lng: 98.398178
                }
            })
        }
    }

    componentDidMount() {
        Geocode.fromLatLng(this.state.mapPosition.lat, this.state.mapPosition.lng).then(
            response => {
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    state = this.getState(addressArray);

                this.setState({
                    address: (address) ? address : '',
                    area: (area) ? area : '',
                    city: (city) ? city : '',
                    state: (state) ? state : '',
                })
            },
            error => {
                console.error(error);
            }
        );
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (
            // this.state.markerPosition.lat !== this.props.center.lat ||
            this.state.address !== nextState.address ||
            this.state.city !== nextState.city ||
            this.state.area !== nextState.area ||
            this.state.state !== nextState.state ||
            this.state.distance !== nextState.distance
        ) {
            return true
        }
        // else if (this.props.center.lat === nextProps.center.lat) {
        return false
        // }
    }

    getAddressOnLoad = (lat, lng) => {
        Geocode.fromLatLng(lat, lng).then(
            response => {
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    state = this.getState(addressArray);
                this.setState({
                    address: (address) ? address : '',
                    area: (area) ? area : '',
                    city: (city) ? city : '',
                    state: (state) ? state : '',
                    markerPosition: {
                        lat: this.state.markerPosition.lat,
                        lng: this.state.markerPosition.lng
                    },
                    mapPosition: {
                        lat: this.state.markerPosition.lat,
                        lng: this.state.markerPosition.lng
                    },
                })
            },
            error => {
                console.error(error);
            }
        );
    }

    getDistance = (desLatitude, desLongitude) => {
        const bypassCORSUrl = 'https://cors-anywhere.herokuapp.com/'
        const distanceAPI = 'https://maps.googleapis.com/maps/api/distancematrix/json?units='
        axios.get(bypassCORSUrl + distanceAPI + "matrix"
            + "&origins=" + +this.state.state1.markerPosition.lat + "," + +this.state.state1.markerPosition.lng
            + "&destinations=" + desLatitude + "," + desLongitude
            + "&key=" + API_KEY, { timeout: 5000 }
            + "&avoid=highways|tolls"
        ).then(res => this.setState({
            distance:
            {
                rows:
                    [{
                        elements:
                            [{
                                distance:
                                {
                                    text: res.data.rows[0].elements[0].distance.text
                                }
                            }]
                    }]
            }
        })).catch(e => {
            this.setState({
                distance:
                {
                    rows:
                        [{
                            elements:
                                [{
                                    distance:
                                    {
                                        text: "ไม่สามารถใช้งานได้ในขณะนี้ (Cannot Calculate) : " + JSON.stringify(e)
                                    }
                                }]
                        }]
                }
            })
        })
    }

    /**
     * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
     *
     * @param nextProps
     * @param nextState
     * @return {boolean}
     */

    /**
     * Get the city and set the city input value to the one selected
     *
     * @param addressArray
     * @return {string}
     */

    getCity = (addressArray) => {
        let city = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
                city = addressArray[i].long_name;
                return city;
            }
        }
    };

    /**
     * Get the area and set the area input value to the one selected
     *
     * @param addressArray
     * @return {string}
     */
    getArea = (addressArray) => {
        let area = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0]) {
                for (let j = 0; j < addressArray[i].types.length; j++) {
                    if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
                        area = addressArray[i].long_name;
                        return area;
                    }
                }
            }
        }
    };
    /**
     * Get the address and set the address input value to the one selected
     *
     * @param addressArray
     * @return {string}
     */
    getState = (addressArray) => {
        let state = '';
        for (let i = 0; i < addressArray.length; i++) {
            for (let i = 0; i < addressArray.length; i++) {
                if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
                    state = addressArray[i].long_name;
                    return state;
                }
            }
        }
    };
    /**
     * And function for city,state and address input
     * @param event
     */
    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    /**
     * This Event triggers when the marker window is closed
     *
     * @param event
     */
    onInfoWindowClose = (event) => {

    };

    /**
     * When the marker is dragged you get the lat and long using the functions available from event object.
     * Use geocode to get the address, city, area and state from the lat and lng positions.
     * And then set those values in the state.
     *
     * @param event
     */
    onMarkerDragEnd = (event) => {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();

        Geocode.fromLatLng(newLat, newLng).then(
            response => {
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    state = this.getState(addressArray);
                this.setState({
                    address: (address) ? address : '',
                    area: (area) ? area : '',
                    city: (city) ? city : '',
                    state: (state) ? state : '',
                    markerPosition: {
                        lat: newLat,
                        lng: newLng
                    },
                    mapPosition: {
                        lat: newLat,
                        lng: newLng
                    },
                })
                this.getDistance(newLat, newLng)
            },
            error => {
                console.error(error);
            }
        );
    };

    /**
     * When the user types an address in the search box
     * @param place
     */
    onPlaceSelected = (place) => {
        const address = place.formatted_address,
            addressArray = place.address_components,
            city = this.getCity(addressArray),
            area = this.getArea(addressArray),
            state = this.getState(addressArray),
            latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();
        // Set these values in the state.
        this.setState({
            address: (address) ? address : '',
            area: (area) ? area : '',
            city: (city) ? city : '',
            state: (state) ? state : '',
            markerPosition: {
                lat: latValue,
                lng: lngValue
            },
            mapPosition: {
                lat: latValue,
                lng: lngValue
            },
        })
        this.getDistance(this.state.markerPosition.lat, this.state.markerPosition.lng)
    };

    render() {
        const { address } = this.state
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props => (
                    <GoogleMap
                        google={window.google}
                        defaultZoom={15}
                        defaultCenter={{ lat: 7.890030, lng: 98.398178 }}
                        center={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
                    >
                        <Marker google={window.google}
                            name={'Dolores park'}
                            draggable={true}
                            onDragEnd={this.onMarkerDragEnd}
                            position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
                        />
                        <Marker />

                        <Autocomplete
                            style={{
                                width: '100%',
                                height: '40px',
                                paddingLeft: '16px',
                                marginTop: '2px',
                                marginBottom: '500px'
                            }}
                            componentRestrictions={{ country: "th" }}
                            onPlaceSelected={this.onPlaceSelected}
                            types={[]}
                        />
                    </GoogleMap>
                )
            )
        );
        if (window.google !== undefined) {
            let googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`
            return (
                <><Form>
                    <div style={{ height: "700px", backgroundColor: "#FFFF" }}>
                        <AsyncMap
                            googleMapURL={googleMapURL}
                            loadingElement={
                                <div style={{ height: `85%` }} />
                            }
                            containerElement={
                                <div style={{ height: "600px" }} />
                            }
                            mapElement={
                                <div style={{ height: `85%` }} />
                            }
                        />
                    </div>
                    <Container fluid="md">
                    <div style={{ fontSize: 25, color: "red" }}>
                        โปรดตรวจสอบที่อยู่ให้ถูกต้องจาก Pin สีแดง หรือรายละเอียด ที่อยู่ด้านล่าง ก่อนคลิก Next เพื่อไปหน้าถัดไป
                    </div>
                    <br />

                    <label style={{ fontSize: 20 }}>ที่อยู่ผู้รับของ (Reciever Address) : </label>
                        <InputGroup className="mb-3">

                            <FormControl as="textarea" readOnly style={{ width: "100%" }} value={address} onChange={(e) => {
                            this.setState({ ...this.state.address, address: e.target.value })
                        }} />
                        </InputGroup>
                    <br />

                    <label style={{ fontSize: 20 }}>รายละเอียดสถานที่ตั้งเพิ่มเติม</label>
                    <div
                        style={{ fontSize: 15 }}>
                        เช่น ประตูทางเข้าบิ๊กซี (More description each between central festival)
                    </div>
                    <div
                        style={{ fontSize: 15, color: "#ffcc00" }}>
                        โปรดตรวจสอบหากผิดพลาดสามารถแก้ไขได้ (if incorrect please change to correct adrress)
                    </div>
                    <div>
                        <Form.Control
                            as="textarea"
                            required
                            placeholder="รายละเอียดสถานที่ตั้งเพิ่มเติม (More description)"
                            style={{ width: "100%"}}
                            onChange={(e) => this.setState({
                                form: { ...this.state.form, recieverDesOption: e.target.value }
                            })} />
                    </div>
                    <br />

                    <form onSubmit={(e) => e.preventDefault()}>
                        <label style={{ fontSize: 20 }}>ชื่อผู้รับของ (Reciever)</label>
                        <div>
                            <Form.Control
                                required
                                style={{ width: "100%"}}
                                placeholder="ชื่อผู้รับของ (Reciever)"
                                onChange={(e) => this.setState({
                                    form: { ...this.state.form, recieverName: e.target.value }
                                })} />
                        </div>
                        <br />

                        <label style={{ fontSize: 20 }}>เบอร์โทรผู้รับ (Reciever phone No.)</label>
                        <div>
                            <Form.Control
                                required
                                style={{ width: "100%" }}
                                placeholder="เบอร์โทรผู้รับ (Reciever phone No.)"
                                onChange={(e) => this.setState({
                                    form: { ...this.state.form, recieverPhoneNumber: e.target.value }
                                })} />
                        </div>
                        <br />

                        <div>ราคา (price) : {this.calculate()}</div>

                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <Button
                                style={{ width: "100%", backgroundColor: "#46a547", height: 50,margin: 10 }}
                                onClick={() => this.props.history.goBack()}
                            >
                                Back
                            </Button>
                            {' '}
                            <Button
                                style={{ width: "100%", backgroundColor: "#46a547", height: 50,margin: 10 }}
                                onClick={() => {
                                    if (this.state.form.recieverName !== null && this.state.form.recieverPhoneNumber !== null) {
                                        if (this.state.distance.rows[0].elements[0].distance.text !== "Calculating...") {
                                            this.props.history.push({ pathname: "/complete", combineState: this.state })
                                        } else alert("โปรดรอการคำนวนระยะทาง (Please wait for Calculating distance)")
                                    } else alert("โปรดกรอกชื่อและเบอร์โทร (Please fill name and phone no.)")
                                }}
                            >
                                Next
                        </Button>
                        </div>

                    </form>
                    </Container>
                </Form>
                </>
            )
        }
        else return (
            <div style={{ height: "300px" }} />
        )
    }
}

export default Map2;