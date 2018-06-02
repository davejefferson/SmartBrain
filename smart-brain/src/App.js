import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from "clarifai";
import Navigation from "./Components/Navigation/Navigation";
import SignIn from "./Components/SignIn/SignIn";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import './App.css';


const app = new Clarifai.App({
  apiKey: 'eeb49ba2de0c4ff7807a01714bdd341f'
});

const particlesOptions = {
   particles: {
      number: {
        value: 10,
        density: {
          enable: true,
          value_area: 100
        }
      }
    }
  
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin"
    }
  }


  calculateFaceLocation = (data) => {
    const clarifiaFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifiaFace.left_col * width,
      topRow: clarifiaFace.top_row * height,
      rightCol: width - (clarifiaFace.right_col * width),
      bottomRow: height - (clarifiaFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box)
    this.setState({box: box})
  }
  
  onInputChange =(event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
      
    };

    onRouteChange=  (route) => {
      this.setState({route: route});
    }

  render() {
    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} />
        { this.state.route === "signin" 
        ? <SignIn onRouteChange={this.onRouteChange} />
        : <div>
          <Logo />
          
        <Rank />
        <ImageLinkForm 
        onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />

        <FaceRecognition box={this.state.box}  imageUrl={this.state.imageUrl}/>
          </div>
        }
      </div>
    );
  }
}

export default App;
