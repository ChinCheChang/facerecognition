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

const app = new Clarifai.App({
 apiKey: '7e300315a6a048d886a594556189bd96'
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


class App extends Component {
  constructor() {
      super();
      this.state = {
        input: '',
        imageUrl: '',
        boxs: [],
        route: 'signin'
      }

  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFacaLocation(response)))
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
    this.setState({route: route})
  }

  render() {
    return (
      <div className="App">
        <Particles  className='particles' params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange} />
        {
          this.state.route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange}/>
            : <div>
                <Logo />
                <Rank />
                <ImageLinkForm
                  onInputChange={this.onInputChange}
                  onSubmit={this.onSubmit}
                />
                <FaceRecognition boxs={this.state.boxs} imageUrl={this.state.imageUrl}/>
              </div>
        }
      </div>
    );
  }
}

export default App;
