import React, { Component } from "react";
import Select from "react-select";
import styled from "styled-components";

const options = [
  { value: "USD", label: "USD" },
  { value: "CHF", label: "CHF" },
  { value: "GBP", label: "GBP" },
  { value: "EUR", label: "EUR" }
];
class App extends Component {
  state = {
    value: 0,
    send: false,
    currencyFromValueToBase: 0,
    currencyToValueToBase: 0,
    result: "",
    selectedOptionFrom: null,
    selectedOptionTo: null
  };
  inputChanged = e => {
    const value = e.target.value;
    const name = e.target.name;
    console.log(name || 0);
    if (value > 0) {
      this.setState(state => ({
        [name]: value,
        result: ""
        // send: true
      }));
    }
  };

  handleChangeFrom = selectedOptionFrom => {
    this.setState({
      selectedOptionFrom,
      currencyFrom: selectedOptionFrom.value,
      result: ""
      // send: true
    });
  };

  handleChangeTo = selectedOptionTo => {
    this.setState({
      selectedOptionTo,
      currencyTo: selectedOptionTo.value,
      result: ""
      // send: true
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (
      this.state.selectedOptionFrom &&
      this.state.selectedOptionTo &&
      this.state.value !== 0
    ) {
      this.setState({
        send: true
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.send &&
      this.state.selectedOptionTo !== this.state.selectedOptionFrom
    ) {
      console.log("faetch");
      const data1 = fetch(
        `http://api.nbp.pl/api/exchangerates/rates/a/${
          this.state.selectedOptionTo.value
        }`
      )
        .then(result => result.json())
        .then(result => {
          this.setState(state => ({
            currencyToValueToBase: result.rates[0].mid
          }));
        });

      const data2 = fetch(
        `http://api.nbp.pl/api/exchangerates/rates/a/${
          this.state.selectedOptionFrom.value
        }`
      )
        .then(result => result.json())
        .then(result => {
          this.setState(state => ({
            currencyFromValueToBase: result.rates[0].mid
          }));
        });

      let result;
      Promise.all([data1, data2]).then(() => {
        result = (
          (this.state.value * this.state.currencyFromValueToBase) /
          this.state.currencyToValueToBase
        ).toPrecision(4);
        this.setState({
          result
        });
      });
      this.setState({
        send: false
      });
    }
    if (
      this.state.selectedOptionTo === this.state.selectedOptionFrom &&
      this.state.selectedOptionFrom !== null &&
      this.state.selectedOptionTo !== null
    ) {
      this.setState(state => ({
        currencyFromValueToBase: 0,
        currencyToValueToBase: 0,
        selectedOptionTo: null,
        currencyTo: "",
        result: "",
        value: 0
      }));
    }
  }
  render() {
    console.log("render");
    const optionFrom = [...options];
    let optionTo = [...options];
    if (this.state.selectedOptionFrom !== null) {
      optionTo = [...options].filter(
        item => item.value !== this.state.selectedOptionFrom.value
      );
    }
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <Select
            value={this.state.selectedOptionFrom}
            onChange={this.handleChangeFrom}
            options={optionFrom}
            name="currencyFrom"
            id="currencyFrom"
            placeholder="choose currency from you convert"
          />
          <Select
            value={this.state.selectedOptionTo}
            onChange={this.handleChangeTo}
            options={optionTo}
            name="currencyFrom"
            id="currencyFrom"
            placeholder="to currency you wan't to know"
          />
          <input
            type="number"
            id="amount"
            name="value"
            value={this.state.value}
            onChange={this.inputChanged}
          />
          <button>submit</button>
        </form>
        <h1>
          {this.state.value !== 0 && this.state.result !== ""
            ? `${this.state.value} ${this.state.currencyFrom} is worth
          ${this.state.result} ${this.state.currencyTo}`
            : ""}
        </h1>
      </div>
    );
  }
}

export default App;

//TODO

// no submit only changes 3
// TODO dont fetch data after only changin input //numeric  4
// to styled components  2
//negative input  1 DONE
// show warning if something is missing number or curency to compare
//show loading

//ISSUES

//crash after no selects selected and changing input // infinite renedering SOLVED

//long time fetchsomeitmes Dont know why
