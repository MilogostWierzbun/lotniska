import './App.css';
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      possibilities: "'ATH' 'BSL' 'BFS' 'BLQ' 'BTS' 'BRS' 'CRL' 'BUD' 'DUB' 'EDI' 'EIN' 'GLA' 'HAM' 'CTA' 'KEF' 'CGN' 'SUF' 'LCA' 'LPL' 'LIS' 'LTN' 'STN' 'MAD'",
      airport_paths: "['ATH','EDI'] ['ATH','GLA'] ['ATH','CTA'] ['BFS','CGN'] ['BFS','LTN'] ['BFS','CTA'] ['BTS','STN'] ['BTS','BLQ'] ['CRL','BLQ'] ['CRL','BSL'] ['CRL','LTN'] ['DUB','LCA'] ['LTN','DUB'] ['LTN','MAD'] ['LCA','HAM'] ['EIN','BUD'] ['EIN','MAD'] ['HAM','BRS'] ['KEF','LPL'] ['KEF','CGN'] ['SUF','LIS'] ['SUF','BUD'] ['SUF','STN'] ['STN','EIN'] ['STN','HAM'] ['STN','DUB'] ['STN','KEF']",
      from: "",
      to: "",
      shortestPath: "",
    };

    this.handleFromSelectChange = this.handleFromSelectChange.bind(this);
    this.handleToSelectChange = this.handleToSelectChange.bind(this);
    this.afterSubmission = this.afterSubmission.bind(this);
  }

  remove_quote(s) {
    return s.slice(1, -1);
  }

  convert_str(tmp_str, logic) {
    let str_splitted = tmp_str.split(' ');
    let str_arr = [];
    let i = 0;
    while (i < str_splitted.length) {
      if (logic) {
        str_arr.push(str_splitted[i].slice(1, -1).split(",").map(this.remove_quote));
      } else {
        str_arr.push(this.remove_quote(str_splitted[i]));
      }
      i += 1;
    }
    return str_arr;
  }

  convert_possibilities_str(tmp_str) {
    return this.convert_str(tmp_str, false);
  }

  convert_airports_str(tmp_str) {
    return this.convert_str(tmp_str, true);
  }

  airports_paths(paths) {
    let i = 0;
    let paths_arr = [];
    while (i < paths.length) {
      let tabu_arr = [paths[i]];
      paths_arr.push([JSON.parse(JSON.stringify(paths[i]))]);
      let j = 0;
      while (j < paths.length) {
        if (tabu_arr.indexOf(paths[j]) === -1) {
          if (paths_arr[paths_arr.length - 1][paths_arr[paths_arr.length - 1].length - 1][1] === paths[j][0]) {
            paths_arr[paths_arr.length - 1].push(paths[j]);
            tabu_arr.push(paths[j]);
          }
        }
        j += 1;
      }
      paths_arr.push([JSON.parse(JSON.stringify(paths[i])).reverse()]);
      i += 1;
    }
    return paths_arr;
  }

  getShortestPath() {
    const airports_pairs = this.convert_airports_str(this.state.airport_paths);

    const all_pathes = this.airports_paths(airports_pairs);
    console.log(all_pathes);

    let ready_pathes = [];
    let i = 0;
    while (i < all_pathes.length) {
      if (all_pathes[i][0][0] === this.state.from && all_pathes[i][all_pathes[i].length - 1][1] === this.state.to) {
        ready_pathes.push(all_pathes[i]);
      }
      i += 1;
    }

    if (ready_pathes.length > 0) {
      let lenghts_arr = [];
      i = 0;
      while (i < ready_pathes.length) {
        lenghts_arr.push(ready_pathes[i].length);
        i += 1;
      }

      let minimum_value = Math.min(lenghts_arr);

      let minimum_path = [];
      i = 0;
      while (i < ready_pathes.length) {
        if (ready_pathes[i].length === minimum_value) {
          minimum_path = ready_pathes[i];
          break;
        }
        i += 1;
      }

      if (minimum_path.length === 1) {
        this.setState({
          shortestPath: minimum_path[0][0] + " => " + minimum_path[0][1],
        })
      } else {
        let path_str = minimum_path[0][0] + " =>";
        i = 0;
        while (i < minimum_path.length) {
          path_str += minimum_path[i][1];
          if (i !== minimum_path.length - 1) {
            path_str += " => ";
          }
          i += 1;
        }
        this.setState({
          shortestPath: path_str,
        })
      }
    }
  }

  handleFromSelectChange(event) {
    this.setState({
      from: event.target.value    
    });
  }

  handleToSelectChange(event) {
    this.setState({
      to: event.target.value    
    });
  }

  afterSubmission(event) {
    event.preventDefault();
    this.getShortestPath();
  }

  render() {
    const possibilities = this.convert_possibilities_str(this.state.possibilities);

    return (
      <div className="App">
        <header className="App-header">
          <Form onSubmit = { this.afterSubmission }>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Z lotniska</Form.Label>
              <Form.Select aria-label="Z" onChange={this.handleFromSelectChange}>
                <option defaultValue={true}>Wybierz z listy</option>
                {
                  possibilities.map(
                    (possibility, index) => <option value={possibility} label={possibility} key={index}></option>
                  )
                }
              </Form.Select>
              <Form.Label>Na lotnisko</Form.Label>
              <Form.Select aria-label="Na" onChange={this.handleToSelectChange}>
                <option defaultValue={true}>Wybierz z listy</option>
                {
                  possibilities.map(
                    (possibility, index) => <option value={possibility} label={possibility} key={index}></option>
                  )
                }
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          <Modal.Dialog>
            <Modal.Header closeButton>
              <Modal.Title>Połączenie</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p bg="success">{ this.state.shortestPath }</p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary">Close</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </header>
      </div>
    );
  }
}

export default App;
