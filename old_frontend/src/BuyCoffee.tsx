import React from "react";

export class BuyCoffee extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { num: 1, name: "" };
  }

  onInputChange = (event: any) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  buy = () => {
    if (!this.props.user.ok()) {
      alert("Please Connect App First");
      return;
    }
    this.props.buy(this.state.name, this.state.num);
  };

  render() {
    return (
      <div>
        <div>buy a coffee</div>
        {/* <div>
			<label>
			  Name :
			  <input
				name="name"
				type="text"
				value={this.state.name}
				onChange={this.onInputChange}
			  />
			</label>
		  </div> */}
        <div>
          <label>
            Cups :
            <input
              name="num"
              type="number"
              value={this.state.num}
              onChange={this.onInputChange}
            />
          </label>
        </div>
        <div>
          <button type="button" onClick={this.buy}>
            Support {this.state.num} VITE
          </button>
        </div>
      </div>
    );
  }
}
