import React, { Component } from "react";

const currencies = ["USD", "CHF", "GBP", "EUR"];
class App extends Component {
  state = {
    value: 0,
    send: false,
    currencyFrom: "CHF",
    currencyTo: "USD",
    currencyFromValueToBase: 0,
    currencyToValueToBase: 0,
    result: ""
  };
  inputChanged = e => {
    const value = e.target.value;
    const name = e.target.name;
    console.log(name || 0);
    this.setState({
      [name]: value
      // send: true
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      send: true
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.send) {
      console.log("faetch");
      const data1 = fetch(
        `http://api.nbp.pl/api/exchangerates/rates/a/${
          this.state.currencyTo
        }/today`
      )
        .then(result => result.json())
        .then(result => {
          this.setState(state => ({
            currencyToValueToBase: result.rates[0].mid
          }));
        });

      const data2 = fetch(
        `http://api.nbp.pl/api/exchangerates/rates/a/${
          this.state.currencyFrom
        }/today`
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
  }
  render() {
    console.log("render");
    const currencyFrom = currencies.map(currency => {
      if (currency === this.state.currencyFrom) {
        return (
          <option key={currency} value={currency} selected>
            {currency}
          </option>
        );
      } else {
        return (
          <option key={currency} value={currency}>
            {currency}
          </option>
        );
      }
    });

    const currencyTo = currencyFrom.map(currency => {
      if (currency.props.selected === true) {
        return;
      } else {
        return (
          <option key={currency.props.key} value={currency.props.value}>
            {currency.props.value}
          </option>
        );
      }
    });
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="currencyFrom">Choose currency from you convert</label>
          <select
            name="currencyFrom"
            id="currencyFrom"
            onChange={this.inputChanged}
          >
            {currencyFrom}
          </select>
          <label htmlFor="currencyTo">to this</label>
          <select
            name="currencyTo"
            id="currencyTo"
            onChange={this.inputChanged}
          >
            {currencyTo}
          </select>

          <label htmlFor="amount">Set amount</label>
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
          {this.state.value !== 0
            ? `${this.state.value} ${this.state.currencyFrom} is worth
          ${this.state.result} ${this.state.currencyTo}`
            : ""}
        </h1>
      </div>
    );
  }
}

export default App;
