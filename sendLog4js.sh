#! /bin/bash
cd /root/server/
currentDay=`date +%d`
echo "currentDay $currentDay"
for file in ./log4js/*log_*
do
    if test -f $file
    then
        strLen=${#file}
        fileDay=${file:strLen-2:strLen}
        if [ $currentDay != $fileDay ]
        then
                # echo $file "day" $fileDay
                echo "send log to data server $file"
                /usr/local/bin/autoscp.sh 账号 密码 IP $file 路径 22
                        rm -f $file
        fi
    fi
done
