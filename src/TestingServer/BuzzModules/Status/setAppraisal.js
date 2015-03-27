 /**
 * Created by Andrew Parkes
 */
 
 /**
 * The system will allow users to rate posts via an appraisal.
 * This is done by a user being linked to a appraisal and to a post.
 *
 * @param userId - User adding the appraisal
 * @param postId - Post that is having the appraisal added too
 * @param appraisalId - Appraisal between the linking
 * @param appraisals - database field for the appraisals
 */
 
exports.setAppraisal=function(_userId, _postId, _appraisalId)
{
	//linking a user a post and an appraisal
	
	if(db.appraisals.find({userId:_userId, postId:_postId})===null)//check if a user already has an appraisal for the specific post
	{
		var setAppraisals={userId: _userId, postId: _postId, appraisalId:_appraisalId};
		return JSON.stringify(setAppraisals);
	}
	else
	{
		var setAppraisals=db.appraisals.update({_userId: _userId}, postId:_postId, {$set:{appraisalId: _appraisalId}});
		return JSON.stringify(setAppraisals);
	}
}