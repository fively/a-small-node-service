#!/bin/bash

if [ "$1" = "" ] ; then
    echo '未指定运行的项目，启动中断并退出!!'
    exit 1
fi

cross-env nest start $1