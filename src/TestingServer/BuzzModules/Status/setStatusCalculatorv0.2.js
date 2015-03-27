/**
 * Created by herb-adventure on 3/22/2015.
 */


// All of these assessors are supported
//ThreadsDepthAssessor
//NumPostsAssessor
//RoleAssessor
//WeightedSumAssessor
//AppraisalsAssessor



function setStatusCalculator(setStatusCalculatorRequest)
{


    var tda= new ThreadsDepthAssessor();
    var npa = new NumPostsAssessor();
    var ra = new RoleAssessor();
    var wsa= new WeightedSumAssessor();
    var aa=new AppraisalsAssessor();




        if(tda.isPrototypeOf(setStatusCalculatorRequest))
        {
            var treeSize=setStatusCalculatorRequest.assessProfile(setStatusCalculatorRequest); //invoke the ThreadDepthAssessor on the profile
            return treeSize;
        }

        else if(npa.isPrototypeOf(setStatusCalculatorRequest))
        {
            var numPosts=setStatusCalculatorRequest.assessProfile(setStatusCalculatorRequest); //invoke the default NumPostsassessor on the profile
            return numPosts;
        }

        else if(ra.isPrototypeOf(setStatusCalculatorRequest))
        {
            var credit=setStatusCalculatorRequest.assessProfile(setStatusCalculatorRequest); ////invoke the RoleAssessor on the profile
            return credit;
        }

        else if(wsa.isPrototypeOf(setStatusCalculatorRequest))
        {
            var weightedAverage=setStatusCalculatorRequest.assessProfile(setStatusCalculatorRequest); //invoke the WeightedSumAssessor on the profile
            return weightedAverage;
        }

        else if(aa.isPrototypeOf(setStatusCalculatorRequest))
        {
            var rating = setStatusCalculatorRequest.assessProfile(setStatusCalculatorRequest); //invoke the AppraisalsAssessor on the profile
            return rating;
        }

        else throw InvalidprofileAssessorException; // throw an exception if the assessor is not one of these



}

var SetStatusCalculatorResult=setStatusCalculator(setStatusCalculatorRequest);