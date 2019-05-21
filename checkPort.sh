#!/bin/bash
function check()
{
        port=`sudo netstat -lnt | grep $1 | awk ' {print $4}' | awk -F ':' '{print $2}'`;
#       echo $port;
        if [ $port == $1 ]; then
                echo "Port $1 Exist";
        else
                echo "Port $1 stop";
        fi
}

check $1
        
