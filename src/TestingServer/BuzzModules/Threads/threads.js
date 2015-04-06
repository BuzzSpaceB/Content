Status =
{
	Open: "Open",
	Closed: "Closed",
	Hidden: "Hidden",
	Read: "Read"
};

PostType = 
{
	Question: "Question",
	Answer: "Answer",
	Comment: "Comment",
	Information: "Information"
};

function Post (_ID, _PostType, _Heading, _Content, _DateTime, _MimeType)
{
    /**
        A post will have its own heading for the content it contains.
        This is in addition to the thread heading/description.
       |Thread              |
       ||=================| |
       ||Post Heading     | |
       ||=================| |
       ||                 | |
       ||  text content   | |
       ||                 | |
       ||_________________| |
     */
	this.mID = _ID;
 	this.mPostHeading = _Heading;
	this.mPostType = _PostType;
	this.mContent = _Content;
	this.mDateTime = _DateTime;
	this.mMimeType = _MimeType;
}

/**
    All functions that are permitted within the scope of a post.
 */
Post.prototype =
{
	constructor: Post
};

function ThreadSummary (_MimeType, _Content, _DateTime, _Thread)
{
	this.mMimeType = _MimeType;
	this.mContent = _Content;
	this.mDateTime = _DateTime;
	this.mThread = _Thread;
};

/**
    All functions permitted to create a thread summary.
 */
ThreadSummary.prototype =
{
	constructor: ThreadSummary
};



module.exports = function(mID, mUser, mParent, mLevel, mPostType, mHeading, mContent, mDateTime, mMimeType){
	return{
		create: function(){
			// this.mChildren = [];
			this.mPost = new Post(mID, mPostType, mHeading, mContent, mDateTime, mMimeType);
			this.mStatus = Status.Open;
			this.mChildren = [];
			var mongoose = require('mongoose');
			var Schema = mongoose.Schema;
			var ObjectID = Schema.ObjectId;
	
			require('./Persistence.js').doPersistence(Schema, mongoose, mPostType, mHeading, mContent, mMimeType, mUser, mParent, mLevel, this.mPost, this.mStatus, this.mChildren);
		},

		ThreadSummary: function(_MimeType, _Content, _DateTime, _Thread)
		{
			this.mMimeType = _MimeType;
			this.mContent = _Content;
			this.mDateTime = _DateTime;
			this.mThread = _Thread;
		},

		// Post: function(_ID, _PostType, _Heading, _Content, _DateTime, _MimeType)
		// {
		//     *
		//         A post will have its own heading for the content it contains.
		//         This is in addition to the thread heading/description.
		//        |Thread              |
		//        ||=================| |
		//        ||Post Heading     | |
		//        ||=================| |
		//        ||                 | |
		//        ||  text content   | |
		//        ||                 | |
		//        ||_________________| |
		     
		// 	this.mID = _ID;
		//  	this.mPostHeading = _Heading;
		// 	this.mPostType = _PostType;
		// 	this.mContent = _Content;
		// 	this.mDateTime = _DateTime;
		// 	this.mMimeType = _MimeType;
		// },

		getChildThreads: function ()
		{
			return this.mChildren;
		},

	    /**
	     * Creates a new thread as a child of the current thread.
	     * @param _ID - The unique identification for the new thread.
	     * @param _User - The user who created the thread.
	     * @param _PostType - Describes the what the type of post is.
	     * @param _Heading - The heading of a post in the new thread.
	     * @param _Content - The text content of the post in the new thread.
	     * @param _MimeType - Describes the content syntax of the new post content.
	     */
		submitPost: function (_ID, _User, _PostType, _Heading, _Content, _MimeType){
		      //Jason
		    var dateCreated = new Date();
		    var childThread = new Thread(_ID, _User, this, (this.mLevel + 1), _PostType, _Heading, _Content, dateCreated, _MimeType);
		    this.mChildren.push(childThread);
		},

		getPost: function ()
		{
			return this.mPost;
		},

		getParentThread: function ()
		{
			return this.mParent;
		},
	        
	    getRoot: function ()
		{
		    if (this.mParent !== null) {
		        if (this.mParent !== 0)
		            (this.mParent).getRoot();
		        else
		            return this;
		    }
		    else
		    {
		        return this;
		    }
		},
	        
		unfreeze: function ()
		{
	        this.mStatus = Status.Open;
			if (this.mChildren.length >= 1) {
				for (var i = 0; i < this.mChildren.length; i++) {
				    this.mChildren[i].unfreeze();
				}
			}
		},

		closeThread: function ()
		{
			//Martha
	            this.mStatus = Status.Closed;
	            this.closeChildren();
	            if(this.mStatus === Status.Closed)
	            {
	                this.createThreadSummary();
	            }
		},
		
		createThreadSummary: function()
		{
			var summary = new ThreadSummary(this.mMimeType, this.mContent, this.mDateTime, this);
			var index = this.mChildren.indexOf(this);
			if(index !== -1) {
			    this.mParent.mChildren[index] = summary;
			}
			return summary.toString();
		},
		
		closeChildren: function ()
		{
		    //checks if this thread has childThreads and prevent them from modification and adding other properties
	            if (this.mChildren.length >= 1) {
	                for (var i = 0; i < this.mChildren.length; i++) {
	                    this.mChildren[i].mStatus = Status.Closed;
	                }
	            }
		},

	    setLevels: function()
	    {
	        //traverses this thread's children
	        if (this.mChildren.length >= 1) {
	            for (var i = 0; i < this.mChildren.length; i++) {
	                this.mChildren[i].setLevels();
	            }
	        }
	        this.mLevel = this.getParentThread().mLevel + 1; //sets this thread's level to one more than its parents level
	    },

	    /**
	    * @param newParent - Describes which thread will be the current thread's new parent (i.e. the thread the current thread will attach to). If it is null the thread will not move.
	    **/
		moveThread: function (newParent)
		{
			//Herman
	            if(newParent !== null)
	            {
	                //Remove this thread from its current parent's children array
	                var index = this.mParent.mChildren.indexOf(this);
	                if(index !== -1) {
	                        this.mParent.mChildren.splice(index, 1);
	                }

	                //Add this thread to its new parent's children array
	                newParent.mChildren.push(this);

	                //Assign newParent as this thread's parent
	                this.mParent = newParent;

	                //Assign newParent's status to this thread (e.g. current thread is open, if it is moved to be the child of a thread which is closed then the current thread will also become closed
	                this.mStatus = newParent.mStatus;

	                //Assign newParent's status to this thread's children and their children, etc.
	                if(newParent.mStatus !== this.mStatus)
	                {
	                    if(newParent.mStatus === Status.Open)
	                    {
	                        if(this.mStatus === Status.Closed)
	                            this.reopenThread();
	                        else if (this.mStatus === Status.Hidden)
	                            this.unhideThread();
	                    }
	                    else if (newParent.mStatus === Status.Closed)
	                    {
	                        this.closeThread();
	                    }
	                    else if (newParent.mStatus === Status.Hidden)
	                    {
	                        if (this.mStatus === Status.Closed)
	                            this.reopenThread();
	                        this.hideThread();
	                    }
	                }
	                this.setLevels();

	                //The thread was successfully moved
	                return true;
	            }
	            else
	            {
	                //The thread was not successfully moved
	                return false;
	            }
		},

	    /**
	    * @param startDateTime -  Restrict returned posts to be after this time stamp. Default is the time stamp of the root post in the Buzz space.
	    * @param endDateTime -  Restrict returned posts to be before this time stamp. If unspecified all posts are returned.
	    * @param maxLevel - Restrict returned posts to be at most at the specified depth relative to the post. If this value is 0, minLevel will also be 0 only the specified post is returned.
	    * @param minLevel - Restrict returned posts to be at least at the specified depth relative to the post. Obviously it has to be less or equal to maxLevel. If both minLevel and maxLevel is 1, only the immediate children are retirieved.
	    * @param userGroup - Restricts returned posts to be limited to a specific user group.
	    * @param phraseSet - Restrict returned posts to be only posts that contains all the strings specified in the phrase set. The default is an empty set. If the set is empty all posts are returned.
	    **/
		queryThread: function (startDateTime, endDateTime, maxLevel, minLevel, userGroup, phraseSet)
		{
			//Herman
	            //Variable to keep track of the current thread being checked as it traverses the tree
	            var temp = this;
	             //Variable to keep track of the depth of the temp thread in relation to the starting thread
	            var count = -1;
	            //Array of queryInfo objects to be returned as the search results for this query
	            var answer = [];
	            
	            //Check to see if default values for maxLevel and minLevel must be set and if they should then set them
	            if (maxLevel === 0 || maxLevel === null)
	                minLevel = 0;
	            if (minLevel > maxLevel || minLevel === null)
	                minLevel = maxLevel;

	            //Call the recursive extension of this function to traverse the children of this thread
	            return temp.queryThreadRecursive(answer, temp, count, startDateTime, endDateTime, maxLevel, minLevel, userGroup, phraseSet);
		},

	    /**
	     * @param answer - The array in which the answer will be stored in.
	     * @param temp - The passes thread currently being tested.
	     * @param count - A counter used to keep track of the depth of the tree in relation to the starting thread.
	     * @param startDateTime -  Restrict returned posts to be after this time stamp. Default is the time stamp of the root post in the Buzz space.
	     * @param endDateTime -  Restrict returned posts to be before this time stamp. If unspecified all posts are returned.
	     * @param maxLevel - Restrict returned posts to be at most at the specified depth relative to the post. If this value is 0, minLevel will also be 0 only the specified post is returned.
	     * @param minLevel - Restrict returned posts to be at least at the specified depth relative to the post. Obviously it has to be less or equal to maxLevel. If both minLevel and maxLevel is 1, only the immediate children are retirieved.
	     * @param userGroup - Restricts returned posts to be limited to a specific user group.
	     * @param phraseSet - Restrict returned posts to be only posts that contains all the strings specified in the phrase set. The default is an empty set. If the set is empty all posts are returned.
	     **/
	    queryThreadRecursive: function (answer, temp, count, startDateTime, endDateTime, maxLevel, minLevel, userGroup, phraseSet)
		{
			//Herman
	        //variables which will be used to check if the default values for endDateTime, userGroup and phraseSet should be set
	        var allPostsTime = false;
	        var allPostsUsers = false;
	        var allPostsPhrases = false;

	        //If no startDateTime value is supplied the default value is set to the root thread's DateTime
	        if (startDateTime === null || startDateTime === 0) {
	            //Make use of the getRoot function as provided by the Spaces team (as it is a variable of the BuzzSpace)
	            startDateTime = temp.getRoot().getPost().mDateTime;
	        }

	        //If either endDateTime, userGroup or phraseSet is not supplied then set its relevant flag to true (this will mean that instead of checking against these values all releveant posts will be returned)
	        if (endDateTime === null || endDateTime === 0)
	            allPostsTime = true;
	        if (userGroup === null || userGroup === 0)
	            allPostsUsers = true;
	        if (phraseSet === null || phraseSet === 0)
	            allPostsPhrases = true;
	        ++count;

	        //Check the startDateTime, minLevel and maxLevel query fields
	        if ((temp.getPost().mDateTime >= startDateTime) && (count >= minLevel) && (count <= maxLevel)) {
	            //Is there no limit from the endDateTime field?
	            if (allPostsTime) {
	                /**
	                 *Example of how a userGroup data set looks
	                 *
	                 *  userGroup = [
	                 *     'John',
	                 *     'Susan'
	                 *  ];
	                 **/
	                //Is there no limit from the userGroup field?
	                if (allPostsUsers) {
	                    //Calls the function which adds the current thread's info to the answer array.
	                    temp.addToQueryAnswer(answer, temp, phraseSet, allPostsPhrases);
	                }
	                else if (userGroup.indexOf(temp.mUser) !== -1)//Else check the userGroup field.
	                {
	                    //Calls the function which adds the current thread's info to the answer array.
	                    temp.addToQueryAnswer(answer, temp, phraseSet, allPostsPhrases);
	                }
	            }
	            else if (temp.getPost().mDateTime <= endDateTime) //Else check the endDateTime field.
	            {
	                //Is there no limit from the userGroup field?
	                if (allPostsUsers) {
	                    //Calls the function which adds the current thread's info to the answer array.
	                    temp.addToQueryAnswer(answer, temp, phraseSet, allPostsPhrases);
	                }
	                else if (userGroup.hasData(temp.mUser))//Else check the userGroup field.
	                {
	                    //Calls the function which adds the current thread's info to the answer array.
	                    temp.addToQueryAnswer(answer, temp, phraseSet, allPostsPhrases);
	                }
	            }
	        }

	        //If the current thread has children
	        if(typeof temp.mChildren !== 'undefined' && temp.getChildThreads().length > 0) {
	            //For each of temp threads children
	            for (var i = 0; i < temp.mChildren.length; i += 1) {
	                //Call queryThreadRecursive again for each of the current thread's children
	                temp.queryThreadRecursive(answer, temp.getChildThreads()[i], count, startDateTime, endDateTime, maxLevel, minLevel, userGroup, phraseSet);
	            }

	            //Once the entire tree has been traversed we return the array of queryInfo objects as an answer.
	            return answer;
	        }
		},

	    /**
	     * @param answer - The array in which the answer will be stored in.
	     * @param temp - The passes thread currently being tested.
	     * @param phraseSet - Restrict returned posts to be only posts that contains all the strings specified in the phrase set. The default is an empty set. If the set is empty all posts are returned.
	     * @param allPostsPhrases - A flag to indicate whether there are any phrases for which the query must search.
	     **/
	    addToQueryAnswer: function (answer, temp, phraseSet, allPostsPhrases)
	    {
	         //Variable to help check if the phrases contained in phraseSet all appear in the current thread's content
	         var flag = true;

	         /**
	          *Example of how a phraseSet data set looks
	          *
	          *  phraseSet = [
	          *     'example phrase',
	          *     'second example phrase'
	          *  ];
	          **/

	         //If no phraseSet was supplied then just return all relevant posts
	         if (!allPostsPhrases)
	         {
	            //For loop that traverses all the phrases in the phraseSet
	            for(var i in phraseSet)
	            {
	                //Compare each phrase in the phraseSet to the current thread's content
	                if((temp.getPost().mContent.indexOf(phraseSet[i]) === -1))
	                {
	                    //If a phrase is not found in the current thread's content then set the flag to false.
	                    flag = false;
	                }
	            }
	         }
	         //If all phrases were found we can then proceed to add this thread's info to the answer array
	         if (flag)
	         {
	              //If current thread does not have a parent thread then set the Parent ID to 0
	              var parentID = 0;
	              if (temp.mParent !== 0) {
	                  parentID = temp.mParent.mID;
	              }

	             /**
	              * queryInfo - an object of all the information about a post the query will return.
	              *
	              * ParentID - The ID of the current thread's parent.
	              *  Author - The user who posted the current thread.
	              * TimeStamp - The date and time the current threads was made.
	              * Content - The content of the post of the current thread;
	              * Status - The status of the current thread.
	              * Level - The depth level of the current thread in the main tree.
	              **/
	              var queryInfo =
	                  {ParentID:  parentID,
	                  Author:  temp.mUser,
	                  TimeStamp:  temp.getPost().mDateTime,
	                  Content:  temp.getPost().mContent,
	                  Status:  temp.mStatus,
	                  Level:  temp.mLevel};

	              //Add this thread's queryInfo object to the array of answers
	              answer.push(queryInfo);
	          }
	    },

	    /**
	     *   This functions hide Threads that the adminstrator doesnt want them
	     *   to be visible from the other users
	     **/
	    hideThread: function ()
	    {
	        //This checks whether the current Thread has children or not
	        if(this.getChildThreads().length >= 1)
	        {
	            //This for loop iterate through the child Threads and Hide them
	            for(var i = 0; i < this.mChildren.length ; i += 1)
	            {
	                this.mChildren[i].hideThread();
	            }
	        }
	        //We change the status to Hidden to indicate that this Threads are now hidden,
	        //so no modification will be done to them
	        this.mStatus = Status.Hidden;

	    },

	    /**
	     *   This functions unHide Threads that the adminstrator has Hidden before and
	     *   now the Adminstrator want them to be visible to the other users
	     **/

	    unhideThread: function ()
	    {

	        //This checks whether the current Thread has children or not
	        if(this.getChildThreads().length >= 1)
	        {
	            //This for loop iterate through the child Threads and unHide them
	            for(var i = 0; i < this.mChildren.length ; i++)
	            {
	                this.mChildren[i].unhideThread();
	            }
	        }
	        //We change the status to Open to indicate that this Threads are now Visible,
	        //and they can be viewed,commented to,e.t.c
	        this.mStatus = Status.Open;
	    },

		markPostAsRead: function ()
		{
			//check if the post is read. if yes, return.
			if(this.mStatus === Status.Read)
	        	{
	            		return;
	        	}
	        	else
	        	{
	            	//else read the post
	            	this.readPost(this.mUser,this.mID);
	        	}
			
		},
		
		readPost: function(userid, postid) 
		{
	        	this.mUser = userid;
	        	this.mID = postid;

	        	//check if the current user and post exist in the database and change the status to read;
	        	if (this.mUser === MongoDbUser && this.mID === MongoDbPostId)
	        	{
	            		this.mStatus = Status.Read;
	        	}

	    },

	    /**
	     * Counts the number of thread children that resides beneath our current thread.
	     * @returns {number}
	     */
		countDescendants: function ()
		{
	        //Jason
			var counter = 0;
	        var k = 0;

	        for (k; k < (this.mChildren.length); k++){
	            ++counter;
	            counter += this.countChildren(this.mChildren[k]);
	        }
	        return counter;
		},

	    /**
	     * A simple recursive function to count the children in a tree structure.
	     * @param _Node - A thread node of which we want to count children from.
	     * @returns {number}
	     */
	    countChildren: function (_Node){
	        //Jason
	        var extraCount = 0;
	        for (var i = 0; i < _Node.mChildren.length; i++){
	            ++extraCount; //Counts the current node as child
	            extraCount += _Node.countChildren(_Node.mChildren[i]);
	        }
	        return extraCount;
	    },

	    reopenThread: function ()
	    {
	        //Martha
	        //checks if the thread is still inaccessible
	        if(this.mStatus === Status.Closed) {
	            //reopens the current thread
	            this.unfreeze();
	        }
	    }
	};
}