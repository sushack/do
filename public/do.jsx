/** @jsx React.DOM */ 

var HabitList = React.createClass({
	getInitialState: function() {
		return {items: []};
	},
	componentWillMount: function() {
		reqwest('/habits').then(function(d){
			this.setState({items:d})
		}.bind(this));
	},
	render: function() {

	var HabitNodes = this.state.items.map(function (data) {
		return <Habit id={data.id} name={data.name}></Habit>;
	});

	return (
		<div className="commentBox">
			<h1>Habbits</h1>
			{HabitNodes}
		 </div>
	);
  }
})


var Habit = React.createClass({
	render: function(){
		return (
			<form method="post" class="habit-form">
				<h2>{this.props.name} <small>{this.props.id}</small></h2>
				<input type="hidden" name="id" value="{this.props.id}" />
				<input type="submit" value="done" class="habit-action" />
				<span class="habit-count">
					{this.props.id}
				</span>
			</form>
		);
	}
})

React.renderComponent(
	<HabitList endpoint="/habits" />,
	document.getElementById('content')
);
