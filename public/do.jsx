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

	getInitialState: function() {
		return {count: 0};
	},
	componentWillMount: function() {
		reqwest('habits/' + this.props.id)
		.then(this.setState.bind(this));
	},
	render: function(){
		return (
			<form method="post" className="habit-form">
				<h2>{this.props.name}</h2>
				<input type="hidden" name="id" value={this.props.id} />
				<input type="submit" value="done" className="habit-action" />
                <span className={'habit-block habit-count'}>
					{this.state.count}
				</span>
                <span className={'habit-block habit-remove'}>
                    &times;
                </span>
			</form>
		);
	}
})

React.renderComponent(
	<HabitList endpoint="/habits" />,
	document.getElementById('habits')
);
