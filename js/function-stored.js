function dateDiff(from,to){
    dayofthisYear={0:365,1:365,2:366,3:365}
    febuary={0:28,1:28,2:29,3:28}
    norMonth={1:31,3:31,5:31,7:31,8:31,10:31,12:31,4:30,6:30,9:30,11:30}
    stackFrom=from.split('-',3);stackTo=to.split('-',3);
    stackFrom[1]/=1;stackTo[1]/=1;//Assign 08/=1;=>8 for Array True Key
    stackFrom[2]/=1;stackTo[2]/=1;
    diff=0;
    if(stackFrom[0]==stackTo[0]){
        ispecialYear=stackFrom[0]%4;
        myMonth=norMonth;
        myMonth[2]=febuary[ispecialYear];
        if(stackFrom[1]==stackTo[1]){
            diff=stackTo[2]-stackFrom[2];
        }else{
            for(var m=stackFrom[1];m<=stackTo[1];m++){
                if(m==stackFrom[1]){diff+=myMonth[m]-stackFrom[2];}
                else if(m==stackTo[1]){diff+=stackTo[2];}
                else{diff+=myMonth[m];}
            }
        }
    }else{
        for(var y=stackFrom[0];y<=stackTo[0];y++){
            ispecialYear=y%4;
            if(y==stackFrom[0]|y==stackTo[0]){
                myMonth=norMonth;
                myMonth[2]=febuary[ispecialYear];
                if(y==stackFrom[0]){
                    for(var m=stackFrom[1];m<=12;m++){
                        if(m==stackFrom[1]){diff+=myMonth[m]-stackFrom[2];}
                        else{diff+=myMonth[m];}
                    }

                }else{
                    for(var m=stackTo[1];m>=1;m--){
                        if(m==stackTo[1]){diff+=stackTo[2];}
                        else{diff+=myMonth[m];}
                    }
                }
            }else{
                diff+=dayofthisYear[ispecialYear];
            }
        }
    }
    return diff;
}