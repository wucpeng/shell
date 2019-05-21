#!/usr/bin/expect
set timeout 300
set username [lindex $argv 0]
set password [lindex $argv 1]
set remhost [lindex $argv 2]
set localfile [lindex $argv 3]
set remotedir [lindex $argv 4]
set port [lindex $argv 5]
spawn scp -P $port $localfile $username@$remhost:$remotedir
expect {
        "*re you sure you want to continue connecting*"
        {
            send "yes\n"
            expect {
                "*assword*"
                    {
                        send "$password\n"
                    }
                }
        }
        "*assword*"
        {
                send "$password\n"
        }
    }
expect eof
