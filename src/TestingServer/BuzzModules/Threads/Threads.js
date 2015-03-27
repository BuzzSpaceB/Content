/**
 * Enumeration type for Statuses.
 * @type {{Open: string, Closed: string, Hidden: string}}
 */
Status =
{
	Open: "Open",
	Closed: "Closed",
	Hidden: "Hidden"
};

/**
 * Enumeration type for PostTypes.
 * @type {{Question: string, Answer: string, Comment: string, Information: string}}
 */
PostType = 
{
	Question: "Question",
	Answer: "Answer",
	Comment: "Comment",
	Information: "Information"
};

/**
 * Creates a Post object.
 * @param _PostType - An enum value to describe what the content of the current thread refers to.
 * @param _Heading - A small text string that will be used as a heading for the post.
 * @param _Content - Text that contains the content of the post.
 * @param _DateTime - A field to show when a post was created.
 * @param _MimeType - Describes what type of content the post consist of.
 * @constructor
 */
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

function isAdministrator ()
{
    return true;
}

/**
 * The Constructor for a Thread object. It initializes a thread and a post within that thread. There exist a one-to-one relationship between a thread and a post.
 * @param _User - Identifies who created/initiated the thread.
 * @param _Parent - To build the thread tree. Describes which thread is the parent of the new thread. If it is the root thread, then parent is simply null.
 * @param _Level - To build the thread tree. Describes in what depth level in the tree this current thread is located.
 * @param _PostType - An enum value to describe what the content of the current thread refers to.
 * @param _Heading - A small text string that will be used as a heading for the post in this thread.
 * @param _Content - Text that contains the content of the post in this thread.
 * @param _DateTime - A field to show when a post was created.
 * @param _MimeType - Describes what type of content the post consist of.
 * @constructor
 */
function Thread (_ID, _User, _Parent, _Level, _PostType, _Heading, _Content, _DateTime, _MimeType)
{
	this.mID = _ID;
	this.mUser = _User;
	this.mParent = _Parent;
	this.mPost = new Post(_ID, _PostType, _Heading, _Content, _DateTime, _MimeType);
	this.mChildren = [];
	this.mStatus = Status.Open;
        this.mLevel = _Level;

	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	var ObjectID = Schema.ObjectId;
	
	require('./Persistence.js').doPersistence(Schema, mongoose, _PostType, _Heading, _Content, _MimeType, _User, _Parent, _Level, this.mPost, this.mStatus, this.mChildren);
}
/**
    All functions that are permitted within the scope of Threads.
 */
Thread.prototype =
{
	constructor: Thread,

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
		this.mParent.getRoot();
            }
            else
            {
                return this;
            }
        },
        
	unfreeze: function ()
	{
		if (this.mChildren.length >= 1) {
			for (var i = 0; i < this.mChildren.length; i++) {
			    this.mChildren[i].unfreeze();
			}
		}
	var thread = new Thread(this.mID, this.mUser, this.mParent, this.mLevel, this.mPostType, this.mHeading, this.mContent, this.mDateTime, this.mMimeType);
        this.mThread = thread;
        this.mStatus = Status.Open;
	},

	closeThread: function ()
	{
		//Martha
	        if(isAdministrator() === true)
	        {
                console.log('closing thread');
                this.mStatus = Status.Closed;
		        this.closeChildren();
	            //creates thread summary
	            if(Object.isFrozen(this) === true)
	            {
	                this.createThreadSummary();
	            }
	        }
	        else
	        {
	            alert('You are not authorized to close this thread');
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
                    Object.freeze(this.mChildren[i]); //prevents modification
                }
            }
            Object.freeze(this); //prevents modification of the current thread
            this.mStatus = Status.Closed;	
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
            //Make use of the isAdministrator function as provided by the Authorization team
            if(isAdministrator() === true)
            {
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
            }
            else
            {
                //The thread was not successfully moved
                alert('You are not authorized to move this thread');
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
            return queryThreadRecursive(answer, temp, count, startDateTime, endDateTime, maxLevel, minLevel, userGroup, phraseSet);
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
            //If temp is null we have reached the end of the tree
            if (temp !== null)
            {
                //variables which will be used to check if the default values for endDateTime, userGroup and phraseSet should be set
                var allPostsTime = false;
                var allPostsUsers = false;
                var allPostsPhrases = false;
                       
                //If no startDateTime value is supplied the default value is set to the root thread's DateTime
                if (startDateTime === null || startDateTime === 0)
                    //Make use of the getRoot function as provided by the Spaces team (as it is a variable of the BuzzSpace)
                    startDateTime = getRoot().mDateTime;
                
                //If either endDateTime, userGroup or phraseSet is not supplied then set its relevant flag to true (this will mean that instead of checking against these values all releveant posts will be returned)
                if (endDateTime === null || endDateTime === 0)
                    allPostsTime = true;
                if (userGroup === null || userGroup === 0)
                    allPostsUsers = true;
                if (phraseSet === null || phraseSet === 0)
                    allPostsPhrases = true;

                //For each of temp threads children
                for (var i = 0;i < temp.getChildThreads().length; i++)
                {
                    //Check the startDateTime, minLevel and maxLevel query fileds
                    if ((temp.mDateTime > startDateTime) && (++count >= minLevel) && (++count <= maxLevel))
                    {
                        //Is there no limit from the endDateTime field?
                        if (allPostsTime)
                        {
                            /**
                            *Example of how a userGroup data set looks
                            *
                            *  userGroup = [
                            *     {user: 'John'},
                            *     {user: 'Susan'}
                            *  ];
                            **/
                            
                            //Is there no limit from the userGroup field?
                            if (allPostsUsers)
                            {
                                //Calls the function which adds the current thread's info to the answer array.
                                addToQueryAnswer(answer, temp, phraseSet, allPostsPhrases);
                            }
                            else if (userGroup.hasData(temp.mUser))//Else check the userGroup field.
                            {
                                    //Calls the function which adds the current thread's info to the answer array.
                                   addToQueryAnswer(answer, temp, phraseSet, allPostsPhrases); 
                            }
                        }
                        else if(temp.mDateTime < endDateTime) //Else check the endDateTime field.
                        {
                            //Is there no limit from the userGroup field?
                             if (allPostsUsers)
                            {
                                //Calls the function which adds the current thread's info to the answer array.
                                addToQueryAnswer(answer, temp, phraseSet, allPostsPhrases);
                            }
                            else if (userGroup.hasData(temp.mUser))//Else check the userGroup field.
                            {
                                //Calls the function which adds the current thread's info to the answer array.
                                addToQueryAnswer(answer, temp, phraseSet, allPostsPhrases);
                            }
                        }
                    }
                    //Call queryThreadRecursive again for each of the current thread's children
                    queryThreadRecursive(temp.getChildThreads()[i], count, startDateTime, endDateTime, maxLevel, minLevel,userGroup, phraseSet);
                }
            }
            else
            {
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
              *     {phrase: 'example phrase'},
              *     {phrase: 'second example phrase'}
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
                      {ParentID:  temp.mParent.mID,
                      Author:  temp.mUser,
                      TimeStamp:  temp.getPost().mDateTime,
                      Content:  temp.getPost().mContent,
                      Status:  temp.mStatus,
                      Level:  temp.mLevel};

                  //Add this thread's queryInfo object to the array of answers
                  answer.push(queryInfo);
              }
        },

	hideThread: function ()
	{
		//Sbo

	        if(this.getChildThreads().length >= 1)
	        {
	            for(var i = 0; i < this.mChildren.length ; i += 1)
	            {
	                this.mChildren[i].hideThread();
	            }
	        }
	        this.mStatus = Status.Hidden;

	},

	unhideThread: function ()
	{
		//Sbo
	
	        if(this.getChildThreads().length >= 1)
	        {
	            for(var i = 0; i < this.mChildren.length ; i++)
	            {
	                this.mChildren[i].unhideThread();
	            }
	        }
	        this.mStatus = Status.Open;
	},

	markPostAsRead: function ()
	{
		//Sbo
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
            counter += countChildren(this.mChildren[k]);
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
    }
};

/**
    The constructor for a thread summarizer.
    @constructor
 */
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
	constructor: ThreadSummary,

	reopenThread: function ()
	{
		//Martha
	        if(isAdministrator() === true) {
	            //checks if the thread is still inaccessible
	            if(Object.isFrozen(this.mThread) === true) {
	                //reopens the current thread
	                this.mThread.unfreeze();
	            }
	        }
	        else
	        {
	            alert("You are not authorized to open this thread");
	        }
	}
};


/**
 Unit Testing of our Thread Module.
 */

exports.CreationOfThreads = {
    Test1: function(test){
        var myObject = new Thread(0, "Jason", 0, 0, "Question", "Test1", "This is a test", "Today", "Text");
        var returnedObject = myObject.getPost();
        /**
         * The following line of code is called an Assertion. It is the "TEST" being performed.
         */
        test.equal(returnedObject.mPostHeading, "Test1", "This should pass.");
        test.done();
    },

    Test2: function(test){
        var myObject = new Thread(0, "Jason", 0, 0, "Question", "Test2", "Content Tester", "Yesterday", "Text");
        var returnedObject = myObject.getPost();
        test.equal(returnedObject.mPostHeading, "Test2", "This should pass.");
        test.equal(returnedObject.mContent, "Content Tester", "This should pass.");
        test.equal(returnedObject.mMimeType, "Text", "This should pass.");
        test.done();
    },
    //Test of moveThread()
    Test3: function(test){
        var myObject1 = new Thread(0, "Herman", 0, 0, "Question", "Test3.1", "Move test", "Today", "Text");
        var myObject2 = new Thread(1, "Herman", 0, 0, "Question", "Test3.2", "New parent", "Today", "Text");
        myObject2.submitPost(2, "Herman", "Question", "Test3.3", "Thread to move", "Text");
        var childObject = myObject2.mChildren[0];
        childObject.moveThread(myObject1);
        var returnedObject1 = childObject.getParentThread().getPost();
        var returnedObject2 = myObject1.mChildren[0].getPost();
        test.equal(returnedObject1.mPostHeading, "Test3.1", "Move threads test 1.");
        test.equal(returnedObject2.mPostHeading, "Test3.3", "Move threads test 2.");
        test.done();
    },
    //Test of queryThread()
    Test4: function(test){
        var date1 = new Date();
        var date2 = new Date();
        var date3 = new Date();
        
        var myObject1 = new Thread(0, "Herman", 0, 2, "Question", "Test4.1", "Query test 1", date2, "Text");
        //var myObject2 = new Thread(_ID, _User, _Parent, _Level, _PostType, _Heading, _Content, _DateTime,
        // _MimeType)
        //(startDateTime, endDateTime, maxLevel, minLevel, userGroup, phraseSet)
        
        myObject1.submitPost(1, "Herman", "Question", "Test4.2", "Query test 2", "Text");
        myObject1.submitPost(2, "Herman", "Question", "Test4.3", "Query test 3", "Text");
	    
        var userGroup = [{user: "Herman"}];
        var phraseSet = [{phrase: "Query"}];
        
        var returnedObject1 = myObject1.queryThread(0,0,0,0,0,0);
        var returnedObject2 = myObject1.queryThread(date1,date3,0,0,0,0);
        var returnedObject3 = myObject1.queryThread(0,0,3,1,0,0);
        var returnedObject4 = myObject1.queryThread(0,0,0,0,userGroup,0);
        var returnedObject5 = myObject1.queryThread(0,0,0,0,0,phraseSet);
        
        test.equal(returnedObject1[0].Content, "Query test", "Query threads test 1.1");
	    test.equal(returnedObject1[1].Content, "Query test", "Query threads test 1.2");
	    test.equal(returnedObject1[2].Content, "Query test", "Query threads test 1.3");
	    test.equal(returnedObject1[0].Content, "Query test", "Query threads test 1");
        test.equal(returnedObject2[0].Content, "Query test", "Query threads test 2");
        test.equal(returnedObject3[0].Content, "Query test", "Query threads test 3");
        test.equal(returnedObject4[0].Content, "Query test", "Query threads test 4.1");
	    test.equal(returnedObject4[1].Content, "Query test", "Query threads test 4.2");
        test.equal(returnedObject5[0].Content, "Query test", "Query threads test 5.1");
	    test.equal(returnedObject5[1].Content, "Query test", "Query threads test 5.2");
	    test.equal(returnedObject5[2].Content, "Query test", "Query threads test 5.3");
        test.done();
    },

    //test of closeThread()

    Test5: function(test)
    {
        var Obj = new Thread(0, "Martha", 0, 2, "Question", "Test5", "Query test 1", 2, "Text");
        Obj.closeThread();
        /**
         * The Equal test function.
         * equal(currentValue, expectedValue, AssertionMessage);
         */
        test.equal(Obj.mStatus, "Closed", "Failure to close a thread.");
        Obj.submitPost(32, "Jason", "Answer", "Closing of Children", "Testing the closing of child threads.", "Text");
        test.equal(Obj.mChildren[0].mStatus, "Closed", "Failure to close child threads.");
        test.done();

    },
    //test of reopenThread()
    Test6: function(test)
    {
        var Obj = new Thread(0, "Martha", 0, 0, "Question", "Test6", "Query test 1", 2, "Text");
        Obj.closeThread(); //Closing only to test reopening functionality
        test.equal(Obj.mStatus, "Closed", "Failed to close the thread to reopen.");
        var newObj = Obj.reopenThread();
        test.equal(newObj.mStatus, "Open", "Failed to reopen the thread.");
        test.done();
    },
    Test7: function(test){
        var dateT = new Date();
        var Obj = new Thread(8394, "Jason", 0, 0, "Answer", "Testing Children", "Testing the child", dateT, "Text");
        Obj.submitPost(8395, "Jason", PostType.Question, "Is it a child?", "This should be a child of object 8394", "Text");
        var child = Obj.mChildren[0].getPost();
        test.equal(child.mID, "8395", "This post is not the child of 8394");
        test.equal(child, Obj.mChildren[0].getPost(), "Not the actual child");
        test.done();
    }
}

