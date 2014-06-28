/** @jsx React.DOM */

var HabitList = React.createClass({
	getInitialState: function() {
		return {items: []};
	},
	componentWillMount: function() {
		reqwest(this.props.endpoint).then(function(d){
			this.setState({items:d})
		}.bind(this));
		// connect to pubnub

		var self = this;

		pubnub.subscribe({
			channel : "do_channel",
			message : function(m){

				this.HabitNodes.forEach(function(node){
					
					if(node.props.id == m.did){
						var current = node.state.count;
						node.setState({
							count:current+1,
							triggered:true
						})

						// untrigger
						setTimeout(function(){
							var current = node.state.count;
							node.setState({
								count:current,
								triggered:false
							})

						}, 1000)
					}
				})
			}.bind(this),
		});

	},
	HabitNodes:[],
	render: function() {

		this.HabitNodes = this.state.items.map(function (data) {
		return <Habit id={data._id} name={data.name} count={data.count}></Habit>;
	});

	return (
		<div>
			{this.HabitNodes}
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
			<form method="post" className={this.state.triggered?'habit-form triggered':'habit-form'}>
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
	<HabitList endpoint="/habits" channel="do_channel" />,
	document.getElementById('habits')
);
