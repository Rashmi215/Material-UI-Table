import React, { Component } from 'react';
import Table from './components/Table';
import axios from 'axios';

class App extends Component {

	state = {
		rows: []
	}

	async componentDidMount() {
		await axios.get('https://reqres.in/api/users?page=1')
		  .then(response => {
				this.setState({ rows: response.data.data});
      })
    await axios.get('https://reqres.in/api/users?page=2')
		  .then(response => {
				this.setState({ rows: [...this.state.rows, ...response.data.data]});
      })
    await axios.get('https://reqres.in/api/users?page=3')
		  .then(response => {
				this.setState({ rows: [...this.state.rows, ...response.data.data]});
      })
      axios.get('https://reqres.in/api/users?page=4')
		  .then(response => {
				this.setState({ rows: [...this.state.rows, ...response.data.data]});
      })
	}

  render () {
    return (
      <div className="App">
        {this.state.rows.length > 11 ? <Table rows={this.state.rows}/> : null }
      </div>
    );
  }
}

export default App;
