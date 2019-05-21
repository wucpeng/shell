#!/bin/bash

declare version;

process()
{
        local md5=`md5sum "$1" | cut -c1-32`
        #echo "${1#*/}"
        cp "$1" "$1.$version"
        echo ${1:$2}
        echo "$md5"
}

list_dir() 
{
        for file in "$1"/*; do
                #echo $file
                if [ ! -e "$file" ]; then
                        continue
                fi
                if [ -d "$file" ]; then
                        list_dir "$file" $2
                else
                        process "$file" $2
                        echo `du -b "$file" | cut -f1`  
                fi
        done
}

if [ $# -ne 2 ]; then
        echo "Usage: $0 [dir] [ver]"
        exit 0
fi

#$1 = /var/www/data/

#len_1=14
version=$2
len_1=${#1}

#root=
root=${1##*/}

if [ ${#root} -eq 0 ]; then
        # path end of /

        #root=/var/www/data
        root=${1:0:$(($len_1-1))}
        #root=data/
        root=${root##*/}"/"
        #len_cut=9
        len_cut=$(( $len_1 - ${#root} ))
        #root=/var/www/data
        root=${1%/*}
else
        len_cut=$(( $len_1 - ${#root} ))
        root=$1
fi

#echo "root = $root"
#echo "cut = $len_cut"
#exit 0
list_dir $root $len_cut

#echo ok!
