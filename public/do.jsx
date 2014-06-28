/** @jsx React.DOM */ 

var HabitList = React.createClass({
	getInitialState: function() {
		return {items: []};
	},
	componentWillMount: function() {
		reqwest(this.props.endpoint).then(function(d){
			this.setState({items:d})
		}.bind(this));
	},
	render: function() {

	var HabitNodes = this.state.items.map(function (data) {
		return <Habit id={data._id} name={data.name}></Habit>;
	});

	return (
		<div>
			{HabitNodes}
		</div>
	);
  }
})


var Habit = React.createClass({
	render: function(){
		return (
			<form method="post" className="habit-form">
				<h2>{this.props.name}</h2>
				<input type="hidden" name="id" value={this.props.id} />
				<input type="submit" value="done" className="habit-action" />
				<span className="habit-count">
					{this.props.id}
				</span>
			</form>

		);
	}
})

React.renderComponent(
	<HabitList endpoint="/habits" />,
	document.getElementById('habits')
);
