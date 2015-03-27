/**
 * Created by Andrew Parkes
 */
 
 /**
 * Being able to get the Appraisal for later use.
 *
 * @param getAppraisalIdForRequest - get the needed appraisal Id
 * @param appraisals - database field for the appraisals
 */
 
 /*  Not needed
 function getAppraisal(getAppraisalIdForRequest)
 {   
	//getting referance to the db
	return db.appraisals.find({appraisalId:getAppraisalIdForRequest});
 }
 */
 
 /**
 * Being able to get the Appraisal Type for later use such as counting appraisals.
 *
 * @param getAppraisalIdForRequest - get the needed appraisal Id
 * @param appraisals - database field for the appraisals
 */
 
 function getAppraisalType(getAppraisalIdForRequest)
 {   
	var type;
	//geting the appraisal type
	return db.appraisals.find({appraisalId:getAppraisalIdForRequest, appraisalType:type});
	return type;
 }
 
 /**
 * Being able to get the Appraisal Id for later use such as counting appraisals.
 *
 * @param getAppraisalTypeForRequest - get the needed appraisal type
 * @param appraisals - database field for the appraisals
 */
 
 function getAppraisalId(getAppraisalTypeForRequest)
 {   
	var id;
	//geting the appraisal id
	return db.appraisals.find({appraisalId:id, appraisalType:getAppraisalTypeForRequest});
	return id;
 }