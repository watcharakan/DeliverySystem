import React from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import { Button ,Form,InputGroup,FormControl,Container } from 'react-bootstrap';
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || "AIzaSyAlULpCzs57poHJ0CQWp9cZs0n2Tak2Qyw"

Geocode.setApiKey(API_KEY);
Geocode.enableDebug();
Geocode.setLanguage("th");
Geocode.setRegion("th");

class Map1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: null,
            pay:null,
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
            form: {
                senderDesOption: "",
                senderName: null,
                senderPhoneNumber: null
            }
        }
    }
    /**
     * Get the current address from the default map position and set those values in the state
     */

    async componentWillMount() {
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
            this.state.markerPosition !== nextState.markerPosition ||
            this.state.address !== nextState.address ||
            this.state.city !== nextState.city ||
            this.state.area !== nextState.area ||
            this.state.state !== nextState.state ||
            this.state.distance !== nextState.distance
        ) {
            return true
        }
        return false
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

                <> <Form>
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
                                <div style={{ height: `100%` }} />
                            }
                        />
                    </div>
                    <Container fluid="md">
                    <div style={{ fontSize: 25, color: "red" }}>
                        โปรดเลือกหมุดโดยการเลื่อน Pin สีแดง หรือพิมพ์ในช่องค้นหาด้านบนก่อนคลิก Next เพื่อไปหน้าถัดไป
                    </div>
                    <br />

                    <label style={{ fontSize: 20 }}>
                        ที่อยู่ของผู้ส่งของ (Sender Address) :
                    </label>
                    <div 
                    style={{fontSize:15, color:"#ffcc00"}}>
                        โปรดตรวจสอบหากผิดพลาดสามารถแก้ไขได้ (if incorrect please change to correct adrress)
                    </div>
                    <InputGroup className="mb-3">

                        <FormControl as="textarea"
                        required
                        readOnly
                                     style={{ width: "100%" }}
                        value={address} 
                        onChange={(e) => {
                            this.setState({ ...this.state.address, address: e.target.value })
                        }} />

                    </InputGroup>
                    <br />

                    <form>
                        <label style={{ fontSize: 20 }}>รายละเอียดสถานที่ตั้งเพิ่มเติม</label>
                        <div
                            style={{ fontSize: 15 }}>
                            เช่น ประตูทางเข้าบิ๊กซี (More description each between central festival)
                            </div>
                        <div>
                            <Form.Control as="textarea"
                                style={{ width: "100%", marginBottom: 25,  }}
                                placeholder="รายละเอียดสถานที่ตั้งเพิ่มเติม (More description)"
                                onChange={(e) => this.setState({
                                    form: { ...this.state.form, senderDesOption: e.target.value }
                                })} />
                        </div>

                        <label style={{ fontSize: 20 }}>ชื่อผู้ส่งของ (Sender name)</label>
                        <div>
                            <Form.Control
                                required
                                style={{ width: "100%", marginBottom: 25,  }}
                                placeholder="ชื่อผู้ส่งของ (Sender name)"
                                onChange={(e) => this.setState({
                                    form: { ...this.state.form, senderName: e.target.value }
                                })}
                            />
                        </div>

                        <label style={{ fontSize: 20 }}>เบอร์โทรผู้ส่งของ (Sender phone Number)</label>
                        <div>
                            <Form.Control
                                required
                                style={{ width: "100%", marginBottom: 25, }}
                                placeholder="เบอร์โทรผู้ส่งของ (Sender phone Number)"
                                onChange={(e) => this.setState({
                                    form: { ...this.state.form, senderPhoneNumber: e.target.value }
                                })} />
                        </div>

                        <br />



                        <div style={{ display: "inline" }}>
                            <Button
                                style={{ width: "80%", backgroundColor: "#46a547", height: 50,}}
                                onClick={() => {
                                    if (this.state.form.senderName != null && this.state.form.senderPhoneNumber !== null)
                                        this.props.history.push({ pathname: "/map2", state1: this.state })
                                    else
                                        alert("โปรดกรอกชื่อและเบอร์โทร(Please fill name and phone no.)")
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

export default Map1;