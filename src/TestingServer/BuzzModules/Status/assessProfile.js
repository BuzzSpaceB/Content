/**
 * Created by johannmarx on 15/03/22.
 */

/**
 * The system will enable lecturers to specify different ways in which the profiles
 * of users can be assessed. This is done through a number of pluggable ProfileAssessors,
 * each implementing the ProfileAssessor interface.*
 * @param assessProfileRequest - get required assessor request - which is a pluggable Profile Assessor
 */
function assessProfile(assessProfileRequest)
{
    var currentAssessmentRequest = JSON.parse(assessProfileRequest);

    var assessmentValue;

    if (!currentAssessmentRequest)
    {
        window.alert("No profile assessment request has been plugged in");
        return;
    }
    else
    assessmentValue = window[currentAssessmentRequest]();
    return assessmentValue;
}