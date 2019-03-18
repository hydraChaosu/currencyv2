import React, { Component } from "react";
import Select from "react-select";
import "./styles.scss";
import styled, { css } from "styled-components";

// const Select = styled.select`
//   background: transparent;
//   border-radius: 3px;
//   border: 2px solid palevioletred;
//   color: palevioletred;
//   margin: 0 1em;
//   padding: 0.25em 1em;
// `;

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
    selectedOptionTo: null,
    error: {
      valueFrom: false,
      valueTo: false,
      valueInput: false,
      valueGreaterThen0: false
    }
  };

  errors = {
    valueFromIncorrect: "Wybierz walutę z której chcesz sprawdzić wartość.",
    valueToIncorrect: "Wybierz walutę do której chcesz sprawdzić wartość.",
    valueIncorrect: "Wybierz ilość waluty. ",
    valueGreater: "Wartość musi być większa niż 0."
  };

  validation = () => {
    let valueFrom = false;
    let valueTo = false;
    let valueInput = false;
    let valueGreater = false;
    let correct = false;

    if (this.state.selectedOptionFrom) {
      valueFrom = true;
    }

    if (this.state.selectedOptionTo) {
      valueTo = true;
    }

    if (this.state.value) {
      valueInput = true;
    }
    if (this.state.value > 0) {
      valueGreater = true;
    }
    if (valueFrom && valueInput && valueTo && valueGreater) {
      correct = true;
    }
    return {
      valueFrom,
      valueTo,
      valueInput,
      valueGreater,
      correct
    };
  };
  inputChanged = e => {
    const value = e.target.value;
    const name = e.target.name;
    console.log(name || 0);
    if (value >= 0) {
      this.setState(state => ({
        [name]: value
        // result: ""
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
    const validation = this.validation();
    console.log(validation);

    if (validation.correct) {
      this.setState({
        send: true,
        error: {
          valueFrom: false,
          valueTo: false,
          valueInput: false,
          valueGreaterThen0: false
        }
      });
    } else {
      this.setState({
        error: {
          valueFrom: !validation.valueFrom,
          valueTo: !validation.valueTo,
          valueInput: !validation.valueInput,
          valueGreaterThen0: !validation.valueGreater
        }
      });
    }
    // old
    // if (
    //   this.state.selectedOptionFrom &&
    //   this.state.selectedOptionTo &&
    //   this.state.value !== 0
    // ) {
    //   this.setState({
    //     send: true
    //   });
    // }
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.selectedOptionTo === prevState.selectedOptionTo &&
      this.state.selectedOptionFrom === prevState.selectedOptionFrom &&
      this.state.value !== prevState.value &&
      this.state.result >= 0 &&
      this.state.result !== ""
    ) {
      console.log("samo");
      let result;
      result = (
        (this.state.value * this.state.currencyFromValueToBase) /
        this.state.currencyToValueToBase
      ).toPrecision(4);
      this.setState({
        result
      });
    }

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
          <span>
            {this.state.error.valueFrom && this.errors.valueFromIncorrect}
          </span>

          <Select
            className="select"
            value={this.state.selectedOptionFrom}
            onChange={this.handleChangeFrom}
            options={optionFrom}
            name="currencyFrom"
            id="currencyFrom"
            placeholder="choose currency from you convert"
          />
          <span>
            {this.state.error.valueTo && this.errors.valueToIncorrect}
          </span>
          <Select
            className="select"
            value={this.state.selectedOptionTo}
            onChange={this.handleChangeTo}
            options={optionTo}
            name="currencyFrom"
            id="currencyFrom"
            placeholder="to currency you wan't to know"
          />
          <span>
            {this.state.error.valueInput && this.errors.valueIncorrect}
            {this.state.error.valueGreaterThen0 && this.errors.valueGreater}
          </span>

          <input
            className="input"
            type="number"
            id="amount"
            name="value"
            value={this.state.value}
            onChange={this.inputChanged}
          />
          <button>submit</button>
        </form>
        <div className="result">
          <p>
            {this.state.value > 0 && this.state.result > 0
              ? `${this.state.value} ${this.state.currencyFrom} is worth
          ${this.state.result} ${this.state.currencyTo}`
              : ""}
          </p>
        </div>
      </div>
    );
  }
}

export default App;
