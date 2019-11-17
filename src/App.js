import React, { Component } from 'react';
import './App.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Input, TextField, Paper, ButtonGroup, Button, Select, MenuItem } from '@material-ui/core';

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
    
  },
});

const PageTable = ({input, onChangeInput, method, methodDrop, key, onEncode, onDecode, output}) => {
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
                label={method != "\u2008" || "" ? method == "Caeser" ? "Key (Single Character)" : "Key (Single Word)" : "Key"}
                name="keyInput"
                onChange={onChangeInput}
                style={{width: 200}}
                value={key}
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
          <TableRow>
            {/* The output box */}
            <TableCell>
              
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}
PageTable.propTypes = {
  input: propTypes.string.isRequired,
  onChangeInput: propTypes.func.isRequired,
  method:propTypes.number.isRequired,
  methodDrop:propTypes.array.isRequired,
  key:propTypes.string.isRequired,
  onEncode: propTypes.func.isRequired,
  onDecode: propTypes.func.isRequired,
  output: propTypes.string.isRequired
}


// MAIN

class App extends Component {
  state = {
    input:"",
    method:0,
    methodDrop: ["\u2008","Caeser","Vigenere"],
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

  handleEncode = (e) => {
    e.preventDefault()
    e.persist()
    // funky math
  }

  handleDecode = (e) => {
    e.preventDefault()
    e.persist()
    // funky math backwards
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
            key = {this.state.key}
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
