import React, { Component } from 'react';
import './App.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {TextField, Paper, ButtonGroup, Button, Select, MenuItem, Input, TableFooter } from '@material-ui/core';

// All the material-ui styling
const useStyles = makeStyles({
  root: {
    width: '85%',   
    margin: 'auto', 
    marginTop: '5%',
    height: '75%',
    overflow: 'auto',
  },
  button: {
    width: 50,
    height: 35,
    margin: '2%',
    marginTop: 10
  },
  textField: {
    fontSize: 12,
  },
});

const PageTable = ({input, onChangeInput, method, methodDrop, keyInput, onEncode, onDecode, output}) => {
  const classes = useStyles()
  
  return(
    <Paper className={classes.root}>
      <Table size='small'>
        <TableHead>
        </TableHead>
        <TableBody>
          <TableRow>
            {/* The encoding input box */}
            <TableCell align="left">
              <TextField
                label="Code"
                name="input"
                onChange={onChangeInput}
                style={{width: 200}}
                value={input}
                autoComplete="off"
                onKeyPress={(e)=>{e.which === 13 && e.preventDefault();}}
              />
            </TableCell>
            <TableCell align="left">
              <Select
                align="left"
                label="Method"
                name="method"
                value={method}
                onChange={onChangeInput}
              >
                {methodDrop.map(x => (
                  <MenuItem value={x}>{x}</MenuItem>
                ))}
              </Select>
            </TableCell>
            <TableCell>
              <TextField
                label={method != "\u2008" || "" ? method == "Caesar" ? "Key (A \u21cc B, ex: K Q)" : "Key (ABC \u21cc DEF, ex: DOG CAT)" : "Key"}
                name="key"
                InputLabelProps = {{classes: {
                  root: classes.textField
                }}}
                onChange={onChangeInput}
                style={{width: 200}}
                value={keyInput}
                autoComplete="off"
                onKeyPress={(e)=>{e.which === 13 && e.preventDefault();}}
              />
            </TableCell>
            <TableCell>
              <ButtonGroup size="small" aria-label="small outlined button group">
                <Button onClick={onEncode}>
                  Encode
                </Button>
                <Button onClick={onDecode}>
                  Decode
                </Button>
              </ButtonGroup>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            {/* The output box */}
            <TableCell align="center">
              The result is: {output}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>
  )
}
PageTable.propTypes = {
  input: propTypes.string.isRequired,
  onChangeInput: propTypes.func.isRequired,
  method:propTypes.string.isRequired,
  methodDrop:propTypes.array.isRequired,
  keyInput:propTypes.string.isRequired,
  onEncode: propTypes.func.isRequired,
  onDecode: propTypes.func.isRequired,
  output: propTypes.string.isRequired
}


// MAIN

class App extends Component {
  state = {
    input:"",
    method:"\u2008",
    methodDrop: ["\u2008","Caesar","Vigenere"],
    key:"",
    output:"",
  };

  handleInputChange = (e) => {
    e.preventDefault()
    e.persist()
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleMethodChange = (e) => {
    e.preventDefault()
    e.persist()
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  // grabs the array of key inputs and checks for validity

  generateKeyPair = () => {
    switch(this.state.method){
      case "\u2008":
        alert("Please select an encoding method")
        return -1
        break;
      case "Caesar":
        if(/^[a-z]\s[a-z]$/.test(this.state.key.toLowerCase())) {
          return this.state.key.toLowerCase().split(" ") 
        } else {
          alert(`Key must be in the style "InputChar OutputChar"`)
          return -1
        }
        break;
      case "Vigenere":
        if(/[a-z]\s[a-z]/.test(this.state.key.toLowerCase()) && this.state.key.split(" ").length === 2 && this.state.key.split(" ")[0].length === this.state.key.split(" ")[1].length) {
          return this.state.key.toLowerCase().split(" ")
        } else {
          alert(`Key must be in the style "InputWord OutputWord" with equal word length`)
          return -1
        }
        break;
      default:
        alert("Something went very wrong, how did you even get this?")
        return -1
      }
  }
  
  // generate the difference between the letters and spaces

  generateDisplacement = (value) => {
    const keyNumbers = value.map(elem => (
      elem.split("").map(subElem => (
        subElem.charCodeAt()
      ))
    ))
    
    let keyApply = []
    for (let i=0; i < keyNumbers[0].length; i++) {
      keyApply.push(keyNumbers[1][i]-keyNumbers[0][i])
    }
    
    
    // convert input to positions between a - z and spaces
    const inputNumbers = this.state.input.toLowerCase().split("").map(elem => {
      if (elem === " ") {
        return " "
      } else {
        // 97 is a, 122 is z
        return elem.charCodeAt() - 97
      }
    })

    // Applying the shift to the input
    return inputNumbers.map((elem, j) => {
      if (elem === " ") {
        return " "
      } else if ((elem + keyApply[j%keyApply.length])%26<0) {
        return (elem + keyApply[j%keyApply.length])%26 + 26
      } else {
        return (elem + keyApply[j%keyApply.length])%26
      }
    })
  }
  
  handleEncode = (e) => {
    e.preventDefault()
    e.persist()
    
    // Getting the shifts to apply to the Input
    const keyPair = this.generateKeyPair()
    
    // kicks out for invalid return values 
    if (keyPair === -1) {
      return false
    }

    const outputApply = this.generateDisplacement(keyPair)
    
    // Boosting the shifted input to the right ascii numbers and convert to letters

    const outputEncoded = outputApply.map(elem => {
      if(elem === " ") {
        return " "
      } else {
        return String.fromCharCode(elem + 97)
      }
    }).join("")

    this.setState({
      output:outputEncoded
    })
    
  }

  handleDecode = (e) => {
    e.preventDefault()
    e.persist()

    // Getting the shifts to apply to the Input, and flipping to decode
    const keyPair = this.generateKeyPair().reverse()
    
    // kicks out for invalid return values 
    if (keyPair === -1) {
      return false
    }

    const outputApply = this.generateDisplacement(keyPair)
    
    // Boosting the shifted input to the right ascii numbers and convert to letters

    const outputEncoded = outputApply.map(elem => {
      if(elem === " ") {
        return " "
      } else {
        return String.fromCharCode(elem + 97)
      }
    }).join("")

    this.setState({
      output:outputEncoded
    })
  }

  render() {
    return(
      <div>
        <form>
          <PageTable
            input = {this.state.input}
            onChangeInput = {this.handleInputChange}
            method = {this.state.method}
            methodDrop = {this.state.methodDrop}
            keyInput = {this.state.key}
            onEncode = {this.handleEncode}
            onDecode = {this.handleDecode}
            output = {this.state.output}
          />
        </form>
      </div>
    );
  }
}

export default App;
