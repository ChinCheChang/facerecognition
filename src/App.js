import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import 'tachyons';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const app = new Clarifai.App({
 apiKey: '46dc3702be414e7d80932121627f1e21'
});

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const initailState = {
  input: '',
  imageUrl: '',
  boxs: [],
  route: 'signin',
  isSignIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
      super();
      this.state = initailState;
  }

  updateUser = (user) => {
      this.setState({user: user});
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.
      predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(res => res.json())
          .then(count => this.setState(Object.assign(this.state.user, {entries: count})))
        }
        this.displayFaceBox(this.calculateFacaLocation(response));
      })
      .catch(err => console.log(err));
  }

  calculateFacaLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return clarifaiFace.map(value => this.boxsArray(value, width, height));
  }

  boxsArray = (value, width, height) => {
    const boxData = value.region_info.bounding_box;
    return {
      leftCol: boxData.left_col * width,
      topRow: boxData.top_row * height,
      rightCol: width - (boxData.right_col * width),
      bottomRow: height - (boxData.bottom_row * height)
    }
  }

  displayFaceBox = (boxs) => {
    this.setState({boxs: boxs});
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initailState);
      this.setState({route: 'signin'});
    } else if (route === 'home'){
      this.setState({isSignIn: true});
      this.setState({route: route});
    } else {
      this.setState({route: route});
    }
  }

  render() {
    const { isSignIn, route, imageUrl, boxs, user } = this.state;
    return (
      <div className="App">
        <Particles  className='particles' params={particlesOptions} />
        <Navigation isSignIn={isSignIn} onRouteChange={this.onRouteChange} />
        {
          route === 'home'
            ? <div>
                <Logo />
                <Rank user={user} />
                <ImageLinkForm
                  onInputChange={this.onInputChange}
                  onSubmit={this.onSubmit}
                />
                <FaceRecognition boxs={boxs} imageUrl={imageUrl}/>
              </div>
            : (
                route === 'signin'
                ? <Signin updateUser={this.updateUser} onRouteChange={this.onRouteChange}/>
                : <Register updateUser={this.updateUser} onRouteChange={this.onRouteChange}/>
              )
        }
      </div>
    );
  }
}

export default App;
