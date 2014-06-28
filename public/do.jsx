/** @jsx React.DOM */ 

var Comment = React.createClass({

	getInitialState: function() {
	    return {count: 0};
	  },
   componentWillMount: function() {
   	var s = this;
   	setTimeout(function(){
   		s.setState({count: Math.random()})
   	}, 500);
   	console.log("mounting comment!!")
    // $.ajax({
    //   url: this.props.url,
    //   dataType: 'json',
    //   success: function(data) {
    //     this.setState({data: data});
    //   }.bind(this),
    //   error: function(xhr, status, err) {
    //     console.error(this.props.url, status, err.toString());
    //   }.bind(this)
    // });
  },

  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}

        <h4>---{this.state.count}--</h4>
      </div>
    );
  }
});


var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return <Comment author={comment.author}>{comment.text}</Comment>;
    });

    return (
      <div className="commentList">
        Hello, world! I am a CommentList.
         {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});


var CommentBox = React.createClass({
	getInitialState: function() {
	    return {data: []};
	  },
   componentWillMount: function() {
   	console.log("mounting box")
    // $.ajax({
    //   url: this.props.url,
    //   dataType: 'json',
    //   success: function(data) {
    //     this.setState({data: data});
    //   }.bind(this),
    //   error: function(xhr, status, err) {
    //     console.error(this.props.url, status, err.toString());
    //   }.bind(this)
    // });
	
	var s = this;
	setTimeout(function(){
		s.setState({data:[
			{author: "BENJAMIN2", text: "This is one comment"},
			{author: "SOME DUDE2", text: "This is *another* comment"}
		]});
	},500)
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});


var data = [
  {author: "BENJAMIN", text: "This is one comment"},
  // {author: "SOME DUDE", text: "This is *another* comment"}
];


React.renderComponent(
  <CommentBox data={data} />,
  document.getElementById('content')
);
